import React from 'react';
import { NavigationTab, UserProfile, AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface TopHeaderProps {
  currentTab: NavigationTab;
  user: UserProfile;
  titleOverride?: string;
  onBack?: () => void;
  showBack?: boolean;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  onOpenRoleModal?: () => void;
  onOpenMenu?: () => void;
  language: AppLanguage;
  onToggleLanguage: (lang: AppLanguage) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  user,
  titleOverride,
  onBack,
  showBack = false,
  onOpenProfile,
  onOpenNotifications,
  onOpenMenu,
  language,
  onToggleLanguage,
}) => {
  const t = TRANSLATIONS[language];

  // Derive title based on current screen/tab
  let title = titleOverride || t.appName;
  if (!titleOverride) {
    if (currentTab === 'map') title = t.appName;
    else if (currentTab === 'connect') title = t.connect;
    else if (currentTab === 'sos') title = t.sos || 'SOS';
    else if (currentTab === 'guide') title = t.guide || 'Guide';
    else if (currentTab === 'profile') title = t.profile;
    else if (currentTab === 'seva') title = t.sevaPortal || 'Seva Portal';
    else if (currentTab === 'camp') title = t.campStatus || 'Camp Operations';
    else if (currentTab === 'sos_monitor') title = t.emergencyMonitor || 'SOS Monitor';
  }

  return (
    <header className="w-full top-0 sticky bg-[#fff8f1] shadow-sm z-40 border-b border-[#e0c0b2]/40">
      <div className="flex items-center justify-between px-3 md:px-8 h-14 md:h-16 w-full max-w-7xl mx-auto overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="p-1.5 -ml-1 sm:p-2 sm:-ml-2 rounded-full text-[#9c3f00] hover:bg-[#eee7df] active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">arrow_back</span>
            </button>
          ) : (
            <button
              onClick={onOpenMenu}
              aria-label="Menu"
              className="p-1.5 -ml-1 sm:p-2 sm:-ml-2 rounded-full text-[#9c3f00] hover:bg-[#eee7df] active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">menu</span>
            </button>
          )}

          <h1 className="font-bold text-base sm:text-lg text-[#9c3f00] tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
            {title}
          </h1>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6">
          <button
            onClick={() => onToggleLanguage(language === 'mr' ? 'hi' : language === 'hi' ? 'en' : 'mr')}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#9c3f00]/30 text-[#9c3f00] hover:bg-[#ffdbcb] transition-colors"
          >
            {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'}
          </button>
        </nav>

        {/* Right Action Icons: Notification & Profile Avatar */}
        <div className="flex items-center gap-2">
          {/* Quick Language Toggle on Mobile */}
          <div className="flex items-center text-xs font-medium text-[#584237] bg-[#f4ede5] rounded-full p-0.5 border border-[#e0c0b2]">
            <button
              onClick={() => onToggleLanguage('mr')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-colors ${language === 'mr' ? 'bg-[#9c3f00] text-white font-bold' : 'hover:text-[#9c3f00]'}`}
              title="मराठी"
            >
              म
            </button>
            <button
              onClick={() => onToggleLanguage('hi')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-colors ${language === 'hi' ? 'bg-[#9c3f00] text-white font-bold' : 'hover:text-[#9c3f00]'}`}
              title="हिंदी"
            >
              हि
            </button>
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-colors ${language === 'en' ? 'bg-[#9c3f00] text-white font-bold' : 'hover:text-[#9c3f00]'}`}
              title="English"
            >
              EN
            </button>
          </div>

          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="p-2 rounded-full text-[#584237] hover:bg-[#eee7df] transition-colors relative"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
          </button>

          {user.isLoggedIn ? (
            <button
              onClick={onOpenProfile}
              aria-label="Profile"
              className="w-9 h-9 rounded-full overflow-hidden border border-[#e0c0b2] hover:ring-2 hover:ring-[#9c3f00] transition-all active:scale-95 shrink-0"
              title={user.fullName}
            >
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1 bg-[#9c3f00] hover:bg-[#7a3000] text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0"
              title="Log In"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span className="hidden sm:inline">{language === 'mr' ? 'लॉग इन' : language === 'hi' ? 'लॉग इन' : 'Log In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
