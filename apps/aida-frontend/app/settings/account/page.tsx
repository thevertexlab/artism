'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save,
  UserPlus,
  LogIn,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserProfile {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  isVerified: boolean;
}

const AccountSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'register' | 'login' | 'security'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: '30'
  });

  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    username: 'current_user',
    email: 'user@example.com',
    displayName: 'Current User',
    bio: 'This is my personal bio...',
    isVerified: false
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    agreeToTerms: false
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Handle user profile update
  const handleProfileUpdate = () => {
    // API call can be added here
    toast.success('User profile updated');
  };

  // 密码强度检查
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Weak', color: 'text-red-500' };
      case 2:
      case 3: return { text: 'Medium', color: 'text-yellow-500' };
      case 4:
      case 5: return { text: 'Strong', color: 'text-green-500' };
      default: return { text: 'Weak', color: 'text-red-500' };
    }
  };

  // Form validation
  const validateRegisterForm = () => {
    if (!registerForm.username.trim()) {
      toast.error('Please enter username');
      return false;
    }
    if (!registerForm.email.trim()) {
      toast.error('Please enter email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!registerForm.password) {
      toast.error('Please enter password');
      return false;
    }
    if (getPasswordStrength(registerForm.password) < 2) {
      toast.error('Password is too weak, please use a more complex password');
      return false;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Password confirmation does not match');
      return false;
    }
    if (!registerForm.agreeToTerms) {
      toast.error('Please agree to the terms of service');
      return false;
    }
    return true;
  };

  // Handle user registration
  const handleRegister = () => {
    if (!validateRegisterForm()) return;

    // Registration API call can be added here
    toast.success('Registration successful!');
    // Clear form
    setRegisterForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      agreeToTerms: false
    });
  };

  // Handle user login
  const handleLogin = () => {
    // Login API call can be added here
    toast.success('Login successful!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'register', label: 'Register', icon: UserPlus },
    { id: 'login', label: 'Login', icon: LogIn },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Account Settings</h1>

      {/* Tab navigation */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-[#333]">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-[#8899A6] hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* 个人资料标签页 */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    {profile.displayName}
                    {profile.isVerified && (
                      <CheckCircle className="w-5 h-5 text-blue-500 ml-2" />
                    )}
                  </h2>
                  <p className="text-gray-500 dark:text-[#8899A6]">@{profile.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    显示名称
                  </label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    个人简介
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="介绍一下你自己..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存更改
                </button>
              </div>
            </div>
          )}

          {/* 注册标签页 */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <UserPlus className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">创建新账户</h2>
                <p className="text-gray-500 dark:text-[#8899A6]">加入AIDA社区，开始您的AI艺术之旅</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    用户名 *
                  </label>
                  <input
                    type="text"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入用户名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    显示名称 *
                  </label>
                  <input
                    type="text"
                    value={registerForm.displayName}
                    onChange={(e) => setRegisterForm({...registerForm, displayName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入显示名称"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    邮箱地址 *
                  </label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入邮箱地址"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    密码 *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入密码"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">密码强度:</span>
                        <span className={getPasswordStrengthText(getPasswordStrength(registerForm.password)).color}>
                          {getPasswordStrengthText(getPasswordStrength(registerForm.password)).text}
                        </span>
                      </div>
                      <div className="mt-1 flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= getPasswordStrength(registerForm.password)
                                ? level <= 2 ? 'bg-red-500' : level <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    确认密码 *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="再次输入密码"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={registerForm.agreeToTerms}
                  onChange={(e) => setRegisterForm({...registerForm, agreeToTerms: e.target.checked})}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  我同意 <a href="#" className="text-blue-500 hover:underline">服务条款</a> 和 <a href="#" className="text-blue-500 hover:underline">隐私政策</a>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRegister}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  创建账户
                </button>
              </div>
            </div>
          )}

          {/* 登录标签页 */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <LogIn className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">登录账户</h2>
                <p className="text-gray-500 dark:text-[#8899A6]">欢迎回到AIDA社区</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入邮箱地址"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    密码
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入密码"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      记住我
                    </label>
                  </div>
                  <a href="#" className="text-sm text-blue-500 hover:underline">
                    忘记密码？
                  </a>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleLogin}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  登录
                </button>
              </div>
            </div>
          )}

          {/* 安全设置标签页 */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">安全设置</h2>
                <p className="text-gray-500 dark:text-[#8899A6]">保护您的账户安全</p>
              </div>

              <div className="space-y-6">
                {/* 两步验证 */}
                <div className="border border-gray-200 dark:border-[#333] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">两步验证</h3>
                        <p className="text-sm text-gray-500 dark:text-[#8899A6]">
                          {securitySettings.twoFactorEnabled ? '已启用' : '未启用'} - 为您的账户添加额外保护
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ease-in-out cursor-pointer ${
                        securitySettings.twoFactorEnabled ? 'bg-blue-500 dark:bg-[#0066FF]' : 'bg-gray-200 dark:bg-[#333]'
                      }`}
                      onClick={() => setSecuritySettings({...securitySettings, twoFactorEnabled: !securitySettings.twoFactorEnabled})}
                    >
                      <span className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </div>
                  </div>
                </div>

                {/* 邮件通知 */}
                <div className="border border-gray-200 dark:border-[#333] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">邮件通知</h3>
                        <p className="text-sm text-gray-500 dark:text-[#8899A6]">
                          接收重要的账户活动邮件通知
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ease-in-out cursor-pointer ${
                        securitySettings.emailNotifications ? 'bg-blue-500 dark:bg-[#0066FF]' : 'bg-gray-200 dark:bg-[#333]'
                      }`}
                      onClick={() => setSecuritySettings({...securitySettings, emailNotifications: !securitySettings.emailNotifications})}
                    >
                      <span className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        securitySettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </div>
                  </div>
                </div>

                {/* 登录警报 */}
                <div className="border border-gray-200 dark:border-[#333] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">登录警报</h3>
                        <p className="text-sm text-gray-500 dark:text-[#8899A6]">
                          检测到异常登录时发送警报
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ease-in-out cursor-pointer ${
                        securitySettings.loginAlerts ? 'bg-blue-500 dark:bg-[#0066FF]' : 'bg-gray-200 dark:bg-[#333]'
                      }`}
                      onClick={() => setSecuritySettings({...securitySettings, loginAlerts: !securitySettings.loginAlerts})}
                    >
                      <span className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </div>
                  </div>
                </div>

                {/* 会话超时 */}
                <div className="border border-gray-200 dark:border-[#333] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">会话超时</h3>
                        <p className="text-sm text-gray-500 dark:text-[#8899A6]">
                          设置自动登出时间
                        </p>
                      </div>
                    </div>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-[#333] rounded-lg bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15">15分钟</option>
                      <option value="30">30分钟</option>
                      <option value="60">1小时</option>
                      <option value="120">2小时</option>
                      <option value="never">永不</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => toast.success('安全设置已保存')}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存设置
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
