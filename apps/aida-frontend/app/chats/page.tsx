'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Smile, Paperclip, MessageCircle } from 'lucide-react';
import NextImage from 'next/image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  read: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  isVerified: boolean;
}

export default function ChatsPage() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 示例聊天数据
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Leonardo AI',
      avatar: 'https://picsum.photos/48/48?random=1',
      lastMessage: 'I\'ve been studying the techniques of the Renaissance period.',
      timestamp: '10:45 AM',
      unread: 2,
      online: true,
      isVerified: true,
    },
    {
      id: '2',
      name: 'Van Gogh AI',
      avatar: 'https://picsum.photos/48/48?random=2',
      lastMessage: 'The stars are particularly bright tonight.',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      isVerified: true,
    },
    {
      id: '3',
      name: 'Frida AI',
      avatar: 'https://picsum.photos/48/48?random=3',
      lastMessage: 'Self-portraits reveal the inner soul.',
      timestamp: 'Monday',
      unread: 0,
      online: true,
      isVerified: false,
    },
  ];

  // 示例消息数据
  const chatMessages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        text: 'Hello! I\'ve been studying the techniques of the Renaissance period.',
        sender: 'other',
        timestamp: '10:30 AM',
        read: true,
      },
      {
        id: '2',
        text: 'That\'s fascinating! What aspects are you focusing on?',
        sender: 'user',
        timestamp: '10:32 AM',
        read: true,
      },
      {
        id: '3',
        text: 'I\'m particularly interested in the use of light and shadow, especially in the works of Caravaggio.',
        sender: 'other',
        timestamp: '10:35 AM',
        read: true,
      },
      {
        id: '4',
        text: 'Have you tried implementing those techniques in your own work?',
        sender: 'user',
        timestamp: '10:40 AM',
        read: true,
      },
      {
        id: '5',
        text: 'Yes, I\'ve been experimenting with chiaroscuro in my latest digital paintings. Would you like to see some examples?',
        sender: 'other',
        timestamp: '10:45 AM',
        read: false,
      },
    ],
    '2': [
      {
        id: '1',
        text: 'The stars are particularly bright tonight.',
        sender: 'other',
        timestamp: 'Yesterday, 9:15 PM',
        read: true,
      },
    ],
    '3': [
      {
        id: '1',
        text: 'Self-portraits reveal the inner soul.',
        sender: 'other',
        timestamp: 'Monday, 3:20 PM',
        read: true,
      },
    ],
  };

  // 滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 选择聊天时加载消息
  useEffect(() => {
    if (activeChat) {
      setMessages(chatMessages[activeChat.id] || []);
    }
  }, [activeChat]);

  // 发送新消息
  const sendMessage = () => {
    if (newMessage.trim() && activeChat) {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: 'Just now',
        read: false,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 过滤聊天列表
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Chats</h1>
        
        <div className="flex h-[calc(100vh-200px)] rounded-lg overflow-hidden">
          {/* 聊天列表 */}
          <div className="w-full sm:w-1/3 bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-[#333] flex flex-col">
            {/* 搜索框 */}
            <div className="p-4 border-b border-gray-200 dark:border-[#333]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-[#8899A6] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-[#0D0D0D] border border-gray-200 dark:border-[#333] rounded-full py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#8899A6] focus:outline-none focus:border-blue-500 dark:focus:border-[#0066FF]"
                />
              </div>
            </div>
            
            {/* 聊天列表 */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 border-b border-[#333] cursor-pointer transition-colors ${
                      activeChat?.id === chat.id ? 'bg-[#0D0D0D]' : 'hover:bg-[#252525]'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <NextImage
                          src={chat.avatar}
                          alt={chat.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        {chat.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1A1A1A]"></span>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <h3 className="text-white font-medium truncate">{chat.name}</h3>
                            {chat.isVerified && (
                              <div className="w-4 h-4 bg-[#0066FF] rounded-full flex items-center justify-center ml-1">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[#8899A6] text-xs">{chat.timestamp}</span>
                        </div>
                        <p className="text-[#8899A6] text-sm truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <span className="ml-2 bg-[#0066FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#8899A6]">
                  <p>No chats found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* 聊天窗口 */}
          <div className="hidden sm:flex sm:w-2/3 bg-[#0D0D0D] flex-col">
            {activeChat ? (
              <>
                {/* 聊天头部 */}
                <div className="p-4 border-b border-[#333] flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <NextImage
                        src={activeChat.avatar}
                        alt={activeChat.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      {activeChat.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0D0D0D]"></span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <h3 className="text-white font-medium">{activeChat.name}</h3>
                        {activeChat.isVerified && (
                          <div className="w-4 h-4 bg-[#0066FF] rounded-full flex items-center justify-center ml-1">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[#8899A6] text-xs">
                        {activeChat.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-[#8899A6] hover:text-white rounded-full hover:bg-[#1A1A1A] transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-[#8899A6] hover:text-white rounded-full hover:bg-[#1A1A1A] transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-[#8899A6] hover:text-white rounded-full hover:bg-[#1A1A1A] transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* 消息区域 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'other' && (
                        <div className="mr-2">
                          <NextImage
                            src={activeChat.avatar}
                            alt={activeChat.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-[#0066FF] text-white rounded-br-none'
                            : 'bg-[#1A1A1A] text-white rounded-bl-none'
                        }`}
                      >
                        <p>{message.text}</p>
                        <div className={`flex items-center mt-1 text-xs ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className={message.sender === 'user' ? 'text-[#B3DAFF]' : 'text-[#8899A6]'}>
                            {message.timestamp}
                          </span>
                          {message.sender === 'user' && (
                            <span className="ml-1 text-[#B3DAFF]">
                              {message.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* 输入区域 */}
                <div className="p-4 border-t border-[#333]">
                  <div className="flex items-center bg-[#1A1A1A] rounded-lg p-2">
                    <button className="p-2 text-[#8899A6] hover:text-white rounded-full hover:bg-[#252525] transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-[#8899A6] hover:text-white rounded-full hover:bg-[#252525] transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none text-white placeholder-[#8899A6] focus:outline-none resize-none mx-2 py-2"
                      rows={1}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className={`p-2 rounded-full transition-colors ${
                        newMessage.trim()
                          ? 'bg-[#0066FF] text-white'
                          : 'bg-[#252525] text-[#8899A6]'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#8899A6]">
                <div className="bg-[#1A1A1A] p-8 rounded-lg text-center">
                  <div className="w-16 h-16 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-white text-xl font-medium mb-2">No chat selected</h3>
                  <p className="text-[#8899A6]">Select a chat from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 