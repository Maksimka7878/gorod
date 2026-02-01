import { Link } from 'react-router-dom';
import { Phone, MessageCircle } from 'lucide-react';

const footerLinks = {
  shop: {
    title: 'Интернет-магазин',
    links: [
      { name: 'Акции', href: '/promotions' },
      { name: 'Распродажа', href: '/sale' },
      { name: 'Доставка и оплата', href: '/delivery' },
      { name: 'Программа лояльности', href: '/loyalty' },
      { name: 'Подарочные сертификаты', href: '/certificates' },
    ],
  },
  stores: {
    title: 'Розничная сеть',
    links: [
      { name: 'Адреса магазинов', href: '/stores' },
      { name: 'О компании', href: '/about' },
      { name: 'Вакансии', href: '/careers' },
    ],
  },
  content: {
    title: 'Знаем, что почитать',
    links: [
      { name: 'Скоро в продаже', href: '/coming-soon' },
      { name: 'Эксклюзивные новинки', href: '/exclusive' },
      { name: 'Читай-журнал', href: '/blog' },
    ],
  },
};

const socialLinks = [
  { name: 'VK', href: 'https://vk.com' },
  { name: 'OK', href: 'https://ok.ru' },
  { name: 'YT', href: 'https://youtube.com' },
  { name: 'TG', href: 'https://t.me' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-6">
      <div className="container-cg">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 mb-10">
          {/* Contact Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              8 495 424-84-44
            </h3>
            <div className="space-y-2">
              <Link
                to="/faq"
                className="flex items-center gap-2 text-gray-600 hover:text-[#26C6DA] transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Вопросы и ответы
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-3"
                style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
              >
                <Phone className="w-4 h-4" />
                Написать обращение
              </Link>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-gray-100 hover:bg-[#E0F7FA] rounded-full flex items-center justify-center text-gray-600 hover:text-[#26C6DA] transition-all text-xs font-bold"
                    aria-label={social.name}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              {footerLinks.shop.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-[#26C6DA] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stores Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              {footerLinks.stores.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.stores.links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-[#26C6DA] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              {footerLinks.content.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.content.links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 hover:text-[#26C6DA] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* QR Code & Apps */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="w-20 h-20 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center border border-gray-200">
                <div className="grid grid-cols-5 gap-0.5 w-14 h-14">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-full aspect-square ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'
                        }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mb-3">
                Наведите камеру, чтобы скачать приложение
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">App</span>
                </div>
                <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © 2025, Читай-город
            </p>

            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Принимаем к оплате:</span>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-gray-600">МИР</span>
                </div>
                <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-gray-600">VISA</span>
                </div>
                <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-gray-600">MC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
