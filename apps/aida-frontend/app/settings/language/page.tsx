'use client';

import { Languages, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const LanguageSettingsPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('zh-CN');
  
  const languages = [
    { code: 'zh-CN', name: 'Simplified Chinese', local: 'Simplified Chinese' },
    { code: 'en-US', name: 'English (US)', local: 'English (US)' },
    { code: 'ja-JP', name: 'Japanese', local: '日本語' },
    { code: 'ko-KR', name: 'Korean', local: '한국어' },
    { code: 'fr-FR', name: 'French', local: 'Français' },
    { code: 'de-DE', name: 'German', local: 'Deutsch' },
    { code: 'es-ES', name: 'Spanish', local: 'Español' },
    { code: 'ru-RU', name: 'Russian', local: 'Русский' },
  ];
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/settings" className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-[#8899A6]" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Language Settings</h1>
      </div>
      
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow overflow-hidden p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-4">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">语言偏好</h2>
            <p className="text-gray-500 dark:text-[#8899A6]">选择您喜好的界面语言</p>
          </div>
        </div>
        
        <div className="space-y-1">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                selectedLanguage === language.code 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-[#1A1A1A] text-gray-700 dark:text-[#ADBAC7]'
              }`}
              onClick={() => setSelectedLanguage(language.code)}
            >
              <div className="flex items-center">
                <span className="text-base">{language.local}</span>
                <span className="text-sm text-gray-500 dark:text-[#8899A6] ml-2">
                  {language.name !== language.local ? `(${language.name})` : ''}
                </span>
              </div>
              {selectedLanguage === language.code && (
                <Check className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#333]">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">翻译选项</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-[#ADBAC7]">自动翻译外语内容</span>
              <div className="w-12 h-6 rounded-full bg-blue-500 dark:bg-[#0066FF] flex items-center">
                <span className="w-5 h-5 rounded-full bg-white transform translate-x-6"></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-[#ADBAC7]">显示原始语言内容</span>
              <div className="w-12 h-6 rounded-full bg-gray-200 dark:bg-[#333] flex items-center">
                <span className="w-5 h-5 rounded-full bg-white transform translate-x-1"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettingsPage; 