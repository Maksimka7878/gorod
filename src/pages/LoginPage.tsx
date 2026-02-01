import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container-cg py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-[#26C6DA]">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{isLogin ? 'Вход' : 'Регистрация'}</span>
          </nav>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              {/* Tabs */}
              <div className="flex mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                    isLogin
                      ? 'border-[#26C6DA] text-[#26C6DA]'
                      : 'border-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Вход
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                    !isLogin
                      ? 'border-[#26C6DA] text-[#26C6DA]'
                      : 'border-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Регистрация
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Registration Fields */}
                {!isLogin && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Введите ваше имя"
                          className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#26C6DA] transition-colors"
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+7 (___) ___-__-__"
                          className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#26C6DA] transition-colors"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#26C6DA] transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Введите пароль"
                      className="w-full h-11 pl-10 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#26C6DA] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                {!isLogin && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Подтвердите пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Повторите пароль"
                        className="w-full h-11 pl-10 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#26C6DA] transition-colors"
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Terms Agreement */}
                {!isLogin && (
                  <div className="mb-4">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300"
                        required={!isLogin}
                      />
                      <span className="text-sm text-gray-600">
                        Я согласен с{' '}
                        <Link to="/#/terms" className="text-[#26C6DA] hover:underline">
                          условиями использования
                        </Link>
                      </span>
                    </label>
                  </div>
                )}

                {/* Forgot Password */}
                {isLogin && (
                  <div className="flex justify-end mb-4">
                    <Link to="/#/forgot-password" className="text-sm text-[#26C6DA] hover:underline">
                      Забыли пароль?
                    </Link>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
                >
                  {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Или через</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 mt-4">
                  <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#26C6DA] transition-colors text-xs font-bold">
                    VK
                  </button>
                  <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#26C6DA] transition-colors text-xs font-bold">
                    OK
                  </button>
                  <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#26C6DA] transition-colors text-lg font-bold">
                    G
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
