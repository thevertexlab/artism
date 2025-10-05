'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  isNewChat?: boolean; // Mark if this is a newly created chat
}

export default function ChatsPage() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // 从localStorage加载聊天数据
  const loadChatsFromStorage = (): Chat[] => {
    if (typeof window === 'undefined') return [];
    try {
      const savedChats = localStorage.getItem('aida-chats');
      return savedChats ? JSON.parse(savedChats) : [];
    } catch (error) {
      console.error('Error loading chats from localStorage:', error);
      return [];
    }
  };

  // 保存聊天数据到localStorage
  const saveChatsToStorage = (chats: Chat[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('aida-chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to localStorage:', error);
    }
  };

  // 从localStorage加载消息数据
  const loadMessagesFromStorage = (): Record<string, Message[]> => {
    if (typeof window === 'undefined') return {};
    try {
      const savedMessages = localStorage.getItem('aida-messages');
      return savedMessages ? JSON.parse(savedMessages) : {};
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      return {};
    }
  };

  // 保存消息数据到localStorage
  const saveMessagesToStorage = (messages: Record<string, Message[]>) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('aida-messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  };

  // 创建新聊天的函数
  const createNewChat = (userInfo: {
    userId: string;
    userName: string;
    userAvatar: string;
    userLocation: string;
    artStyle: string;
    isOnline: string;
  }) => {
    const newChat: Chat = {
      id: userInfo.userId,
      name: userInfo.userName,
      avatar: userInfo.userAvatar,
      lastMessage: `Started a conversation from ${userInfo.userLocation}`,
      timestamp: 'Just now',
      unread: 0,
      online: userInfo.isOnline === 'true',
      isVerified: true,
      isNewChat: true, // 标记为新聊天
    };

    setChats(prevChats => {
      // 检查是否已存在该聊天
      const existingChatIndex = prevChats.findIndex(chat => chat.id === userInfo.userId);
      let updatedChats: Chat[];

      if (existingChatIndex !== -1) {
        // 如果已存在，更新时间戳并移到顶部
        updatedChats = [...prevChats];
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          timestamp: 'Just now',
          isNewChat: true // 重新标记为新聊天
        };
        // 移到顶部
        const [updatedChat] = updatedChats.splice(existingChatIndex, 1);
        updatedChats = [updatedChat, ...updatedChats];
      } else {
        // 如果不存在，添加新聊天到顶部
        updatedChats = [newChat, ...prevChats];
      }

      // 保存到localStorage
      saveChatsToStorage(updatedChats);
      return updatedChats;
    });

    // 设置为活跃聊天
    setActiveChat(newChat);

    // 初始化欢迎消息
    const welcomeMessage: Message = {
      id: 'welcome-' + Date.now(),
      text: `Hello! I'm ${userInfo.userName}, an AI artist specializing in ${userInfo.artStyle}. I'm excited to chat with you!`,
      sender: 'other',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages([welcomeMessage]);

    // 保存欢迎消息到allMessages
    setAllMessages(prevAllMessages => {
      const updatedMessages = {
        ...prevAllMessages,
        [userInfo.userId]: [welcomeMessage]
      };
      saveMessagesToStorage(updatedMessages);
      return updatedMessages;
    });

    // 5秒后移除"新聊天"标记
    setTimeout(() => {
      setChats(prevChats => {
        const updatedChats = prevChats.map(chat =>
          chat.id === userInfo.userId
            ? { ...chat, isNewChat: false }
            : chat
        );
        // 保存到localStorage
        saveChatsToStorage(updatedChats);
        return updatedChats;
      });
    }, 5000);
  };

  // 初始化聊天数据
  useEffect(() => {
    // 默认聊天数据
    const defaultChats: Chat[] = [
    {
      id: '1',
      name: 'Leonardo AI',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'I\'ve been studying the techniques of the Renaissance period.',
      timestamp: '10:45 AM',
      unread: 2,
      online: true,
      isVerified: true,
    },
    {
      id: '2',
      name: 'Van Gogh AI',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'The stars are particularly bright tonight.',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      isVerified: true,
    },
    {
      id: '3',
      name: 'Frida AI',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Self-portraits reveal the inner soul.',
      timestamp: 'Monday',
      unread: 0,
      online: true,
      isVerified: false,
    },
  ];

    // 从localStorage加载保存的聊天
    const savedChats = loadChatsFromStorage();

    // 合并默认聊天和保存的聊天，避免重复
    const mergedChats: Chat[] = [...savedChats];

    // 添加不存在的默认聊天
    defaultChats.forEach(defaultChat => {
      if (!mergedChats.find(chat => chat.id === defaultChat.id)) {
        mergedChats.push(defaultChat);
      }
    });

    setChats(mergedChats);

    // 从localStorage加载保存的消息
    const savedMessages = loadMessagesFromStorage();

    // 合并默认消息和保存的消息
    const defaultMessages: Record<string, Message[]> = {
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
          id: '6',
          text: 'The stars are particularly bright tonight.',
          sender: 'other',
          timestamp: 'Yesterday, 9:15 PM',
          read: true,
        },
      ],
      '3': [
        {
          id: '7',
          text: 'Self-portraits reveal the inner soul.',
          sender: 'other',
          timestamp: 'Monday, 3:20 PM',
          read: true,
        },
      ],
    };

    // 合并消息数据
    const mergedMessages = { ...defaultMessages, ...savedMessages };
    setAllMessages(mergedMessages);

    // 处理从世界地图传来的新聊天请求
    const isNewChat = searchParams.get('newChat');
    if (isNewChat === 'true') {
      const userInfo = {
        userId: searchParams.get('userId') || '',
        userName: searchParams.get('userName') || '',
        userAvatar: searchParams.get('userAvatar') || '',
        userLocation: searchParams.get('userLocation') || '',
        artStyle: searchParams.get('artStyle') || '',
        isOnline: searchParams.get('isOnline') || 'false',
      };

      if (userInfo.userId && userInfo.userName) {
        // 延迟一点创建新聊天，确保初始聊天列表已设置
        setTimeout(() => {
          createNewChat(userInfo);
        }, 100);
      }

      // 清理URL参数（可选）
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams]);

  // 滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 选择聊天时加载消息
  useEffect(() => {
    if (activeChat) {
      setMessages(allMessages[activeChat.id] || []);
    }
  }, [activeChat, allMessages]);

  // 处理聊天选择
  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);

    // 清除未读消息计数和新聊天标记
    if (chat.unread > 0 || chat.isNewChat) {
      setChats(prevChats => {
        const updatedChats = prevChats.map(c =>
          c.id === chat.id ? { ...c, unread: 0, isNewChat: false } : c
        );
        // 保存到localStorage
        saveChatsToStorage(updatedChats);
        return updatedChats;
      });
    }
  };

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

      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);

      // 更新allMessages并保存到localStorage
      setAllMessages(prevAllMessages => {
        const updatedAllMessages = {
          ...prevAllMessages,
          [activeChat.id]: updatedMessages
        };
        saveMessagesToStorage(updatedAllMessages);
        return updatedAllMessages;
      });

      // 更新聊天列表中的最后消息
      setChats(prevChats => {
        const updatedChats = prevChats.map(chat =>
          chat.id === activeChat.id
            ? { ...chat, lastMessage: newMessage, timestamp: 'Just now' }
            : chat
        );
        saveChatsToStorage(updatedChats);
        return updatedChats;
      });

      setNewMessage('');
    }
  };

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle search
  const handleChatSearch = () => {
    if (searchTerm.trim()) {
      console.log('Searching chats for:', searchTerm);
      // Search functionality is already implemented through filteredChats
    }
  };

  // Handle search box enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleChatSearch();
    }
  };

  // Filter chat list
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Chats</h1>
        
        <div className="flex h-[calc(100vh-200px)] rounded-lg overflow-hidden">
          {/* Chat list */}
          <div className="w-full sm:w-1/3 bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-[#333] flex flex-col">
            {/* Search box */}
            <div className="p-4 border-b border-gray-200 dark:border-[#333]">
              <div className="relative flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-[#8899A6] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full bg-gray-100 dark:bg-[#0D0D0D] border border-gray-200 dark:border-[#333] rounded-l-full py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#8899A6] focus:outline-none focus:border-blue-500 dark:focus:border-[#0066FF]"
                  />
                </div>
                <button
                  onClick={handleChatSearch}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-[#0066FF] dark:hover:bg-blue-600 text-white px-3 py-2 rounded-r-full border border-blue-500 dark:border-[#0066FF] transition-colors flex items-center justify-center"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* 聊天列表 */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
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
                            {chat.isNewChat && (
                              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                New
                              </span>
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