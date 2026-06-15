import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/chat', label: 'Chat', icon: '💬', match: '/chat' },
  { to: '/users', label: 'Users', icon: '👥', match: '/users' },
  { to: '/match', label: 'Match', icon: '🎲', match: '/match', accent: true },
  { to: '/groups', label: 'Groups', icon: '🏘️', match: '/group' },
  { to: '/profile', label: 'Profile', icon: '👤', match: '/profile' },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-base-200 bg-base-100/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]"
      aria-label="Main navigation"
    >
      <ul className="flex items-stretch justify-around px-1 py-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.match === '/group'
              ? location.pathname.startsWith('/group')
              : location.pathname === item.to;
          return (
            <li key={item.to} className="flex-1 max-w-[5rem]">
              <Link
                to={item.to}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 px-1 text-[10px] font-semibold transition-colors ${
                  isActive
                    ? item.accent
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-content shadow-sm'
                      : 'bg-primary/10 text-primary'
                    : 'text-base-content/60 hover:bg-base-200/80'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
