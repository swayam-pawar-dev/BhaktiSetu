import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  UserProfile,
  AppLanguage,
  OnboardingStep,
  CampData,
  EmergencyAlert,
  UserRole,
} from './types';
import { TRANSLATIONS, DEFAULT_CAMP_DATA } from './data/mockData';
import { TopHeader } from './components/TopHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { OnboardingFlow } from './components/OnboardingFlow';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { MapView } from './components/MapView';
import { GuideView } from './components/GuideView';
import { ConnectView } from './components/ConnectView';
import { SOSView } from './components/SOSView';
import { ProfileView } from './components/ProfileView';
import { SevaPortalView } from './components/SevaPortalView';
import { CampManagerView } from './components/CampManagerView';
import { EmergencySOSMonitorView } from './components/EmergencySOSMonitorView';
import { AuthPromptModal } from './components/AuthPromptModal';
import {
  subscribeToSOSIncidents,
  getCurrentUser,
  appLogout,
  isFirebaseConnected,
} from './services/firebase';

export default function App() {
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('login');
  const [initialIsSignUp, setInitialIsSignUp] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState<boolean>(false);
  const [pendingTabAfterAuth, setPendingTabAfterAuth] = useState<NavigationTab | null>(null);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('map');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [language, setLanguage] = useState<AppLanguage>('mr');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showSideMenu, setShowSideMenu] = useState<boolean>(false);

  // Camp management and Dynamic Live SOS Alerts state
  const [campData, setCampData] = useState<CampData>(DEFAULT_CAMP_DATA);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = getCurrentUser();
    if (saved) return saved;
    return {
      fullName: 'Swayam Pawar',
      age: 45,
      role: 'pilgrim',
      roles: ['pilgrim', 'volunteer'],
      language: 'mr',
      bloodGroup: 'O+',
      emergencyName: 'Ramesh Pawar',
      emergencyMobile: '+91 98221 44556',
      isRegistered: true,
      isLoggedIn: true,
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDd0uQi7WAnO3iV6S8-VCokWTykFUTSiR1fgXY42CoAgFK2qXRMLuwNMm-OgzlEsa8Fg9PkA22AV-Jq5OuBpEzDu0qLj2WakSj9PujLBc7noFHNJfxrtT5PJmkknmZjYzLxhnp1fcXPcVMQS4tSWkLjvvSLbPun3XAU9rlApmZR4n478dUOFtLkzwt3GSEAR6_2so8KlGEICkmBBZOq_o3Xx68AJmIPoMpRU216U4gE6XQHgWrjkypw',
      offlineMapDownloaded: true,
    };
  });

  // Subscribe to real-time SOS incidents from Firestore / Live Broadcast
  useEffect(() => {
    const unsubscribe = subscribeToSOSIncidents((incidents) => {
      setEmergencyAlerts(incidents);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const t = TRANSLATIONS[language];
  const isPilgrim = user.role === 'pilgrim';
  const pendingSosCount = emergencyAlerts.filter(
    (a) => a.status === 'pending' || a.status === 'unassigned'
  ).length;

  // Auto-switch tabs when user role changes between Pilgrim and Non-Pilgrim
  useEffect(() => {
    if (isPilgrim) {
      if (currentTab === 'seva' || currentTab === 'camp' || currentTab === 'sos_monitor') {
        setCurrentTab('map');
      }
    } else {
      if (currentTab === 'connect' || currentTab === 'sos' || currentTab === 'guide') {
        setCurrentTab('seva');
      }
    }
  }, [user.role]);

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('bhaktisetu_user_profile', JSON.stringify(next));
      return next;
    });
  };

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    handleUpdateUser({ language: newLang });
  };

  const handleLogout = async () => {
    await appLogout();
    handleUpdateUser({ isLoggedIn: false });
    setCurrentTab('map');
  };

  const handleTabSelect = (tab: NavigationTab) => {
    if (!user.isLoggedIn && tab !== 'map' && tab !== 'guide') {
      setPendingTabAfterAuth(tab);
      setShowAuthPrompt(true);
      return;
    }
    setSelectedArticleId(null);
    setCurrentTab(tab);
  };

  // If user requested onboarding / login screens
  if (isOnboarding) {
    return (
      <OnboardingFlow
        initialStep={onboardingStep}
        initialIsSignUp={initialIsSignUp}
        user={user}
        language={language}
        onLanguageChange={handleLanguageChange}
        onComplete={(updated) => {
          handleUpdateUser({ ...updated, isLoggedIn: true });
          setIsOnboarding(false);
          if (pendingTabAfterAuth) {
            const nextTab = pendingTabAfterAuth;
            setPendingTabAfterAuth(null);
            setCurrentTab(nextTab);
          } else {
            setCurrentTab(updated.role === 'pilgrim' ? 'map' : 'seva');
          }
        }}
        onSkip={() => {
          setIsOnboarding(false);
          setCurrentTab(user.role === 'pilgrim' ? 'map' : 'seva');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f1] text-[#1e1b17] flex flex-col font-sans selection:bg-[#ffdbcb] selection:text-[#7a3000] w-full max-w-full overflow-x-hidden">
      {/* Top App Bar */}
      <TopHeader
        currentTab={currentTab}
        user={user}
        language={language}
        onToggleLanguage={handleLanguageChange}
        showBack={!!selectedArticleId}
        onBack={() => setSelectedArticleId(null)}
        titleOverride={selectedArticleId ? 'Spiritual Article' : undefined}
        onOpenProfile={() => {
          if (!user.isLoggedIn) {
            setPendingTabAfterAuth('profile');
            setShowAuthPrompt(true);
          } else {
            setCurrentTab('profile');
          }
        }}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenMenu={() => setShowSideMenu(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {currentTab === 'map' && (
          <MapView
            language={language}
            onOpenArticle={(articleId) => {
              setCurrentTab('guide');
              setSelectedArticleId(articleId);
            }}
          />
        )}

        {currentTab === 'connect' && <ConnectView language={language} />}

        {currentTab === 'sos' && (
          <SOSView language={language} user={user} />
        )}

        {currentTab === 'guide' && (
          <GuideView
            language={language}
            selectedArticleId={selectedArticleId}
            onSelectArticle={(id) => setSelectedArticleId(id)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            language={language}
            onUpdateUser={handleUpdateUser}
            onLanguageChange={handleLanguageChange}
            onOpenOnboarding={() => {
              setInitialIsSignUp(false);
              setOnboardingStep('login');
              setIsOnboarding(true);
            }}
            onOpenRoleModal={() => setShowRoleModal(true)}
            onLogout={handleLogout}
          />
        )}

        {/* Non-Pilgrim Portal Views */}
        {currentTab === 'seva' && (
          <SevaPortalView
            campData={campData}
            onUpdateCampData={setCampData}
            alerts={emergencyAlerts}
            onNavigateTab={handleTabSelect}
            language={language}
            user={user}
          />
        )}

        {currentTab === 'camp' && (
          <CampManagerView
            campData={campData}
            onUpdateCampData={setCampData}
            language={language}
            user={user}
          />
        )}

        {currentTab === 'sos_monitor' && (
          <EmergencySOSMonitorView
            alerts={emergencyAlerts}
            onUpdateAlerts={setEmergencyAlerts}
            onOpenMapCoordinates={(loc) => {
              setCurrentTab('map');
            }}
            language={language}
            user={user}
          />
        )}
      </main>

      {/* Persistent Bottom Dock Navigation */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={handleTabSelect}
        language={language}
        userRole={user.role}
        unassignedSosCount={pendingSosCount}
      />

      {/* Auth Prompt Modal for Logged Out Users */}
      {showAuthPrompt && (
        <AuthPromptModal
          targetTab={pendingTabAfterAuth}
          language={language}
          onLogin={() => {
            setShowAuthPrompt(false);
            setInitialIsSignUp(false);
            setOnboardingStep('login');
            setIsOnboarding(true);
          }}
          onSignUp={() => {
            setShowAuthPrompt(false);
            setInitialIsSignUp(true);
            setOnboardingStep('login');
            setIsOnboarding(true);
          }}
          onClose={() => {
            setShowAuthPrompt(false);
            setPendingTabAfterAuth(null);
          }}
        />
      )}

      {/* Role Selection Popup Modal */}
      {showRoleModal && (
        <RoleSelectionModal
          selectedRoles={user.roles || [user.role]}
          primaryRole={user.role}
          language={language}
          onSave={(roles, primary) => {
            handleUpdateUser({ roles, role: primary });
            setShowRoleModal(false);
          }}
          onClose={() => setShowRoleModal(false)}
        />
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-5 border border-[#e0c0b2] space-y-4 animate-slideDown mt-12">
            <div className="flex justify-between items-center border-b border-[#eee7df] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9c3f00] filled">notifications</span>
                <h3 className="text-base font-bold text-[#1e1b17]">
                  {t.notificationsTitle || 'Pilgrimage Alerts & Notifications'}
                </h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1.5 rounded-full bg-[#eee7df] text-[#584237]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#fff8f1] rounded-2xl border border-[#e0c0b2]/50 text-xs space-y-1">
                <div className="flex justify-between items-center text-[#9c3f00] font-bold">
                  <span>{language === 'mr' ? 'पालखी आगमन' : 'Palkhi Arrival'}</span>
                  <span>10m ago</span>
                </div>
                <p className="text-[#1e1b17]">
                  {language === 'mr'
                    ? 'संत ज्ञानेश्वर महाराज पालखी लोणंद तळावर दाखल झाली आहे.'
                    : 'Sant Dnyaneshwar Maharaj Palkhi has arrived at Lonand Camp grounds.'}
                </p>
              </div>

              <div className="p-3 bg-[#fff8f1] rounded-2xl border border-[#e0c0b2]/50 text-xs space-y-1">
                <div className="flex justify-between items-center text-[#006b1b] font-bold">
                  <span>{language === 'mr' ? 'अन्नछत्र सेवा' : 'Seva Annachhatra'}</span>
                  <span>35m ago</span>
                </div>
                <p className="text-[#1e1b17]">
                  {language === 'mr'
                    ? 'श्री राम सेवा अन्नछत्र स्टॉल नं ४ वर गरम महाप्रसाद सुरू आहे.'
                    : 'Free warm Mahaprasad is now being served at Shri Ram Seva NGO stall #4.'}
                </p>
              </div>

              {pendingSosCount > 0 && (
                <div className="p-3 bg-[#ffdad6] rounded-2xl border border-[#ba1a1a]/40 text-xs space-y-1">
                  <div className="flex justify-between items-center text-[#ba1a1a] font-bold">
                    <span>{language === 'mr' ? 'सक्रिय आपत्कालीन मदत' : 'Active Emergency SOS'}</span>
                    <span>Live</span>
                  </div>
                  <p className="text-[#93000a]">
                    {pendingSosCount} {language === 'mr' ? 'मदत विनंत्या स्वयंसेवकांच्या प्रतीक्षेत आहेत.' : 'SOS requests are waiting on hold for volunteer acceptance.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side Menu Drawer */}
      {showSideMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
          <div className="bg-[#fff8f1] w-4/5 max-w-xs h-full shadow-2xl p-6 flex flex-col justify-between border-r border-[#e0c0b2] animate-slideRight">
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center justify-between border-b border-[#eee7df] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#c35100] text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-2xl filled">temple_hindu</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#9c3f00]">{t.appName}</h2>
                    <p className="text-[10px] text-[#584237]">Pandharpur Wari 2026</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSideMenu(false)}
                  className="p-1 rounded-full text-[#584237] hover:bg-[#eee7df]"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1 text-sm font-semibold text-[#1e1b17]">
                {(isPilgrim
                  ? [
                      { tab: 'map' as NavigationTab, label: t.map, icon: 'map' },
                      { tab: 'connect' as NavigationTab, label: t.connect, icon: 'groups' },
                      { tab: 'sos' as NavigationTab, label: t.sos, icon: 'emergency' },
                      { tab: 'guide' as NavigationTab, label: t.guide, icon: 'auto_stories' },
                      { tab: 'profile' as NavigationTab, label: t.profile, icon: 'person' },
                    ]
                  : [
                      { tab: 'seva' as NavigationTab, label: t.sevaPortal || 'Seva Portal', icon: 'dashboard' },
                      { tab: 'camp' as NavigationTab, label: t.campStatus || 'Camp Operations', icon: 'tune' },
                      { tab: 'sos_monitor' as NavigationTab, label: t.emergencyMonitor || 'SOS Live Monitor', icon: 'emergency' },
                      { tab: 'map' as NavigationTab, label: t.map, icon: 'map' },
                      { tab: 'profile' as NavigationTab, label: t.profile, icon: 'person' },
                    ]
                ).map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setShowSideMenu(false);
                      handleTabSelect(item.tab);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      currentTab === item.tab
                        ? 'bg-[#9c3f00] text-white'
                        : 'hover:bg-[#f4ede5] text-[#584237]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl filled">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-[#eee7df] space-y-2">
                {user.isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setShowRoleModal(true);
                        setShowSideMenu(false);
                      }}
                      className="w-full text-left text-xs font-semibold text-[#9c3f00] p-2 hover:bg-[#f4ede5] rounded-xl flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">checklist</span>
                      <span>{language === 'mr' ? 'भूमिका निवडा (Multi-Role Popup)' : 'Select Roles (Checkbox Popup)'}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setShowSideMenu(false);
                      }}
                      className="w-full text-left text-xs font-semibold text-[#ba1a1a] p-2 hover:bg-[#ffdad6]/40 rounded-xl flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span>{language === 'mr' ? 'लॉग आउट (Log Out)' : 'Log Out'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowSideMenu(false);
                      setInitialIsSignUp(false);
                      setOnboardingStep('login');
                      setIsOnboarding(true);
                    }}
                    className="w-full text-left text-xs font-bold text-[#9c3f00] p-2 bg-[#ffdbcb]/60 hover:bg-[#ffdbcb] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">login</span>
                    <span>{language === 'mr' ? 'लॉग इन करा (Log In)' : 'Log In / Sign Up'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-[#8c7166] pt-4 border-t border-[#eee7df]">
              <p className="font-bold text-[#9c3f00]">ज्ञानोबा माऊली तुकाराम</p>
              <p className="text-[10px] mt-0.5">BhaktiSetu • Real-time Wari Support</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
