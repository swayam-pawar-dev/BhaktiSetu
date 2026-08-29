import React from 'react';
import { NavigationTab, AppLanguage, UserRole } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface BottomNavBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: AppLanguage;
  userRole?: UserRole;
  unassignedSosCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  language,
  userRole = 'pilgrim',
  unassignedSosCount = 0,
}) => {
  const t = TRANSLATIONS[language];
  const isPilgrim = userRole === 'pilgrim';

  interface NavItem {
    tab: NavigationTab;
    label: string;
    icon: string;
    isSos?: boolean;
    badgeCount?: number;
  }

  const pilgrimNavItems: NavItem[] = [
    { tab: 'map', label: t.map, icon: 'map' },
    { tab: 'connect', label: t.connect, icon: 'groups' },
    { tab: 'sos', label: t.sos, icon: 'emergency_home', isSos: true },
    { tab: 'guide', label: t.guide, icon: 'auto_stories' },
    { tab: 'profile', label: t.profile, icon: 'account_circle' },
  ];

  const sevaPortalNavItems: NavItem[] = [
    { tab: 'seva', label: t.sevaPortal || 'Portal', icon: 'dashboard' },
    { tab: 'camp', label: t.campStatus || 'Camp', icon: 'tune' },
    {
      tab: 'sos_monitor',
      label: t.emergencyMonitor || 'SOS Live',
      icon: 'emergency',
      isSos: true,
      badgeCount: unassignedSosCount,
    },
    { tab: 'map', label: t.map, icon: 'map' },
    { tab: 'profile', label: t.profile, icon: 'account_circle' },
  ];

  const navItems: NavItem[] = isPilgrim ? pilgrimNavItems : sevaPortalNavItems;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#ffffff] border-t border-[#e0c0b2]/50 shadow-[0px_-4px_16px_rgba(26,35,126,0.08)] rounded-t-2xl py-1.5 px-2">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;

          if (item.isSos) {
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={`relative flex flex-col items-center justify-center px-3 py-1 transition-all rounded-full ${
                  isActive
                    ? 'bg-[#c35100] text-white shadow-md transform scale-95'
                    : 'text-[#ba1a1a] hover:bg-[#ffdad6]/50 active:scale-90'
                }`}
              >
                {item.badgeCount !== undefined && item.badgeCount > 0 && !isActive && (
                  <span className="absolute top-0.5 right-1.5 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {item.badgeCount}
                  </span>
                )}
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[11px] font-bold mt-0.5 ${
                    isActive ? 'text-white' : 'text-[#ba1a1a]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-[#c35100] text-white shadow-sm'
                  : 'text-[#584237] hover:bg-[#eee7df]/60 active:scale-90'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span
                className={`text-[11px] font-medium mt-0.5 ${
                  isActive ? 'text-white font-bold' : 'text-[#584237]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

