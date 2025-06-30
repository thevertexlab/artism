import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Wifi, WifiOff } from 'lucide-react';
import { buildApiUrl, getApiHeaders } from '../config/api';

interface ConnectionStatus {
  name: string;
  url: string;
  status: 'checking' | 'connected' | 'failed';
  response?: any;
  error?: string;
}

const ConnectionTest: React.FC = () => {
  const [connections, setConnections] = useState<ConnectionStatus[]>([
    {
      name: 'Ismism Backend (Express.js)',
      url: buildApiUrl('ismism', '/api/movements'),
      status: 'checking',
    },
    {
      name: 'Artism Backend (FastAPI)',
      url: buildApiUrl('artism', '/api/v1/artists/'),
      status: 'checking',
    },
  ]);

  const testConnection = async (connection: ConnectionStatus): Promise<ConnectionStatus> => {
    try {
      const response = await fetch(connection.url, {
        headers: getApiHeaders(),
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        return {
          ...connection,
          status: 'connected',
          response: data,
        };
      } else {
        return {
          ...connection,
          status: 'failed',
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        ...connection,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const testAllConnections = async () => {
    setConnections(prev => prev.map(conn => ({ ...conn, status: 'checking' })));

    const results = await Promise.all(
      connections.map(connection => testConnection(connection))
    );

    setConnections(results);
  };

  useEffect(() => {
    testAllConnections();
  }, []);

  const getStatusIcon = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'checking':
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'checking':
        return 'border-blue-200 bg-blue-50';
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wifi className="w-6 h-6" />
          前后端连接测试
        </h2>
        <button
          onClick={testAllConnections}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          重新测试
        </button>
      </div>

      <div className="grid gap-4">
        {connections.map((connection, index) => (
          <motion.div
            key={connection.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border-2 rounded-lg ${getStatusColor(connection.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{connection.name}</h3>
              {getStatusIcon(connection.status)}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              <strong>URL:</strong> {connection.url}
            </p>
            
            {connection.status === 'connected' && connection.response && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm font-medium text-green-700 mb-2">✅ 连接成功</p>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(connection.response, null, 2).slice(0, 200)}
                  {JSON.stringify(connection.response, null, 2).length > 200 && '...'}
                </pre>
              </div>
            )}
            
            {connection.status === 'failed' && connection.error && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm font-medium text-red-700 mb-2">❌ 连接失败</p>
                <p className="text-xs text-red-600">{connection.error}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">连接状态说明</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Ismism Backend</strong>: 艺术流派时间线数据服务 (Express.js + MongoDB)</p>
          <p>• <strong>Artism Backend</strong>: 核心艺术数据和AI服务 (FastAPI + MongoDB)</p>
          <p>• 如果连接失败，请确保后端服务正在运行</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;
