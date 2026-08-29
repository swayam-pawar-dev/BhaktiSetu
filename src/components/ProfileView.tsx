import React, { useState } from 'react';
import { UserProfile, UserRole, AppLanguage, EmergencyContact } from '../types';
import { INITIAL_EMERGENCY_CONTACTS, TRANSLATIONS } from '../data/mockData';
import { ROLE_OPTIONS } from './RoleSelectionModal';
import {
  isFirebaseConnected,
  getFirebaseConfig,
  saveCustomFirebaseConfig,
  appLogout,
  FirebaseConfigOptions,
} from '../services/firebase';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenOnboarding: () => void;
  onOpenRoleModal: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  language,
  onLanguageChange,
  onOpenOnboarding,
  onOpenRoleModal,
  onLogout,
}) => {
  const t = TRANSLATIONS[language];
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isOfflineDownloading, setIsOfflineDownloading] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  // Firebase Config Form state
  const existingConfig = getFirebaseConfig();
  const [apiKey, setApiKey] = useState(existingConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(existingConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(existingConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(existingConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(existingConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(existingConfig?.appId || '');
  const [jsonConfigInput, setJsonConfigInput] = useState('');
  const [firebaseStatusMsg, setFirebaseStatusMsg] = useState<string | null>(null);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const newContact: EmergencyContact = {
      id: `c-${Date.now()}`,
      name: newContactName,
      relation: newContactRelation || 'Family',
      phone: newContactPhone,
    };

    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
    setShowAddContactModal(false);
  };

  const handleToggleOfflineMaps = () => {
    if (user.offlineMapDownloaded) {
      onUpdateUser({ offlineMapDownloaded: false });
    } else {
      setIsOfflineDownloading(true);
      setTimeout(() => {
        setIsOfflineDownloading(false);
        onUpdateUser({ offlineMapDownloaded: true });
        setDownloadSuccessToast(true);
        setTimeout(() => setDownloadSuccessToast(false), 3000);
      }, 1500);
    }
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    let configObj: FirebaseConfigOptions;

    // Check if pasted JSON
    if (jsonConfigInput.trim()) {
      try {
        const cleaned = jsonConfigInput.replace(/const\s+firebaseConfig\s*=\s*/, '').replace(/;$/, '');
        const parsed = JSON.parse(cleaned);
        configObj = {
          apiKey: parsed.apiKey || '',
          authDomain: parsed.authDomain || '',
          projectId: parsed.projectId || '',
          storageBucket: parsed.storageBucket || '',
          messagingSenderId: parsed.messagingSenderId || '',
          appId: parsed.appId || '',
        };
      } catch (err) {
        setFirebaseStatusMsg('Invalid JSON format. Please check your pasted keys.');
        return;
      }
    } else {
      configObj = {
        apiKey: apiKey.trim(),
        authDomain: authDomain.trim(),
        projectId: projectId.trim(),
        storageBucket: storageBucket.trim(),
        messagingSenderId: messagingSenderId.trim(),
        appId: appId.trim(),
      };
    }

    if (!configObj.apiKey || !configObj.projectId) {
      setFirebaseStatusMsg('API Key and Project ID are required.');
      return;
    }

    saveCustomFirebaseConfig(configObj);
    setFirebaseStatusMsg('Firebase configuration saved successfully! Reloading...');
    setTimeout(() => {
      setShowFirebaseModal(false);
      window.location.reload();
    }, 1200);
  };

  const userRolesList = user.roles && user.roles.length > 0 ? user.roles : [user.role || 'pilgrim'];

  return (
    <div className="min-h-screen bg-[#fff8f1] px-3 sm:px-4 md:px-8 py-4 pb-36 max-w-2xl mx-auto space-y-4 w-full overflow-x-hidden box-border">
      {/* Toast feedback */}
      {downloadSuccessToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#006b1b] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce border border-white">
          <span className="material-symbols-outlined text-sm">download_done</span>
          <span>{t.downloaded || 'Downloaded'} (145 MB)!</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#e0c0b2]/60 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left min-w-0">
        <div className="relative shrink-0">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
            alt={user.fullName}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#ffdbcb] shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#006b1b] text-white rounded-full flex items-center justify-center text-xs shadow-sm border border-white">
            <span className="material-symbols-outlined text-xs filled">check</span>
          </span>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-[#1e1b17] truncate">{user.fullName || 'Varkari Pilgrim'}</h2>
              <p className="text-xs text-[#584237] mt-0.5">
                {t.age || 'Age'}: {user.age} • {t.bloodGroup || 'Blood Group'}: {user.bloodGroup} • {user.emergencyMobile}
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-center sm:self-start shrink-0">
              {user.isLoggedIn ? (
                <span className="bg-[#dcfce7] text-[#15803d] text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#15803d]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]"></span>
                  <span>{language === 'mr' ? 'लॉग इन सक्रिय' : 'Logged In'}</span>
                </span>
              ) : (
                <span className="bg-[#f4ede5] text-[#584237] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Guest
                </span>
              )}
            </div>
          </div>

          {/* Active Roles Badges & Switcher */}
          <div className="mt-3.5 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              {userRolesList.map((r) => {
                const opt = ROLE_OPTIONS.find((item) => item.role === r);
                const isPrimary = user.role === r;
                const title = opt ? (language === 'mr' ? opt.titleMr.split(' ')[0] : opt.titleEn) : r;

                return (
                  <span
                    key={r}
                    className={`text-xs px-2.5 py-1 rounded-xl font-bold border flex items-center gap-1 ${
                      isPrimary
                        ? 'bg-[#ffdbcb] text-[#9c3f00] border-[#9c3f00]/40 shadow-2xs'
                        : 'bg-[#f4ede5] text-[#584237] border-[#e0c0b2]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {opt?.icon || 'person'}
                    </span>
                    <span>{title}</span>
                    {isPrimary && <span className="text-[10px] text-[#9c3f00] font-black">★</span>}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                onClick={onOpenRoleModal}
                className="bg-[#9c3f00] hover:bg-[#7a3000] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">checklist</span>
                <span>{language === 'mr' ? 'भूमिका बदला / जोडा (Roles)' : 'Change / Add Roles'}</span>
              </button>

              <button
                onClick={onLogout}
                className="bg-white hover:bg-[#ffdad6]/40 text-[#ba1a1a] border border-[#ba1a1a]/40 text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>{language === 'mr' ? 'लॉग आउट (Log Out)' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud & Backend Configuration Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#e0c0b2]/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdbcb] text-[#9c3f00] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl filled">database</span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#1e1b17]">
                {language === 'mr' ? 'डेटाबेस व क्लाउड स्थिती' : 'Firebase Cloud Sync'}
              </h3>
              <p className="text-[11px] text-[#584237]">
                {isFirebaseConnected()
                  ? (language === 'mr' ? 'क्लाउड फायरबेस जोडलेले आहे (Active)' : 'Cloud Firestore Active & Connected')
                  : (language === 'mr' ? 'रिअल-टाइम लोकल सिंक चालू आहे (Ready for Keys)' : 'Real-time multi-device sync ready for Keys')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFirebaseModal(true)}
            className="text-xs font-bold text-[#9c3f00] bg-[#fff4ed] border border-[#ea580c]/30 hover:bg-[#ffdbcb] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">key</span>
            <span>{language === 'mr' ? 'कीज व्यवस्थापन' : 'Manage Keys'}</span>
          </button>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#e0c0b2]/60 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-[#1e1b17] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-lg filled">contact_phone</span>
            <span>{t.emergencyContacts || t.emergencyContact} ({contacts.length})</span>
          </h3>

          <button
            onClick={() => setShowAddContactModal(true)}
            className="text-xs font-bold text-[#9c3f00] hover:bg-[#ffdbcb]/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>{t.addNew || 'Add New'}</span>
          </button>
        </div>

        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3 rounded-2xl bg-[#fff8f1] border border-[#e0c0b2]/50 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#1e1b17] truncate">{contact.name}</h4>
                <p className="text-[11px] sm:text-xs text-[#584237]">
                  {contact.relation} • {contact.phone}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${contact.phone}`}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#006b1b] text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm sm:text-base">call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Maps & Connectivity Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#e0c0b2]/60 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ffdbcb] text-[#9c3f00] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl filled">cloud_download</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#1e1b17] truncate">{t.offlineMaps}</h3>
              <p className="text-[11px] sm:text-xs text-[#584237] line-clamp-2">
                {user.offlineMapDownloaded
                  ? (t.offlineMapCached || 'All 250km route tiles & halts cached')
                  : (t.offlineMapPrompt || 'Download for no-signal Dive Ghat & rural zones')}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleOfflineMaps}
            disabled={isOfflineDownloading}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              user.offlineMapDownloaded
                ? 'bg-[#94f990]/40 text-[#006b1b] border border-[#006b1b]/30'
                : 'bg-[#9c3f00] text-white hover:bg-[#7a3000]'
            }`}
          >
            {isOfflineDownloading ? (
              <>
                <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                <span>{t.caching || 'Caching...'}</span>
              </>
            ) : user.offlineMapDownloaded ? (
              <>
                <span className="material-symbols-outlined text-xs filled">check</span>
                <span>{t.downloaded || 'Downloaded'}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xs">download</span>
                <span>{t.downloadMapBtn || 'Download (145MB)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Language Preference Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#e0c0b2]/60 space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-[#1e1b17] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#9c3f00] text-lg filled">translate</span>
          <span>{t.appLanguage}</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { code: 'mr' as AppLanguage, name: 'मराठी' },
            { code: 'hi' as AppLanguage, name: 'हिंदी' },
            { code: 'en' as AppLanguage, name: 'English' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => onLanguageChange(item.code)}
              className={`py-2.5 px-2 rounded-2xl border text-center transition-all text-xs font-bold ${
                language === item.code
                  ? 'border-[#9c3f00] bg-[#ffdbcb]/60 text-[#9c3f00] shadow-xs'
                  : 'border-[#e0c0b2] text-[#584237] hover:bg-[#f9f3eb]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Firebase Keys Configuration Modal */}
      {showFirebaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#e0c0b2] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#eee7df] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#9c3f00]">Firebase Cloud Config</h3>
                <p className="text-xs text-[#584237]">Connect your Firebase project keys</p>
              </div>
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="p-1.5 rounded-full bg-[#eee7df] text-[#584237]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {firebaseStatusMsg && (
              <div className="p-3 bg-[#f0fdf4] border border-[#86efac] text-[#166534] rounded-xl text-xs font-semibold">
                {firebaseStatusMsg}
              </div>
            )}

            <form onSubmit={handleSaveFirebaseConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1e1b17] mb-1">
                  Paste JSON / Config Object (Optional quick paste)
                </label>
                <textarea
                  rows={3}
                  value={jsonConfigInput}
                  onChange={(e) => setJsonConfigInput(e.target.value)}
                  placeholder='{ "apiKey": "AIzaSy...", "projectId": "vithai-wari" }'
                  className="w-full text-xs p-2.5 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl font-mono outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div className="text-center text-[10px] font-bold text-[#584237] uppercase tracking-wider">
                — OR ENTER FIELDS MANUALLY —
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e1b17] mb-1">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full text-xs p-2.5 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e1b17] mb-1">Project ID</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="my-wari-app"
                  className="w-full text-xs p-2.5 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e1b17] mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="my-wari-app.firebaseapp.com"
                  className="w-full text-xs p-2.5 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFirebaseModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9c3f00] hover:bg-[#7a3000] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Emergency Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-[#e0c0b2] space-y-4">
            <div className="flex justify-between items-center border-b border-[#eee7df] pb-3">
              <h3 className="text-sm sm:text-base font-bold text-[#9c3f00]">
                {t.addEmergencyContactModalTitle || 'Add Emergency Contact'}
              </h3>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="p-1.5 rounded-full bg-[#eee7df] text-[#584237]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">{t.name || 'Name'}</label>
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Vitthalrao Patil"
                  className="w-full p-2.5 sm:p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl text-xs sm:text-sm outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">{t.relation || 'Relation'}</label>
                <input
                  type="text"
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  placeholder="e.g. Dindi Leader / Sibling"
                  className="w-full p-2.5 sm:p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl text-xs sm:text-sm outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">{t.phoneNumber || 'Phone Number'}</label>
                <input
                  type="tel"
                  required
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full p-2.5 sm:p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl text-xs sm:text-sm outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237]"
                >
                  {t.cancel || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#9c3f00] hover:bg-[#7a3000] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {t.saveContact || 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
