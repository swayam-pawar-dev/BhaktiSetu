import React, { useState } from 'react';
import { UserRole, AppLanguage, UserProfile, OnboardingStep } from '../types';
import { TRANSLATIONS } from '../data/mockData';
import { ROLE_OPTIONS } from './RoleSelectionModal';

interface OnboardingFlowProps {
  initialStep?: OnboardingStep;
  initialIsSignUp?: boolean;
  user: UserProfile;
  onComplete: (updatedUser: Partial<UserProfile>) => void;
  onSkip?: () => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialStep = 'login',
  initialIsSignUp = false,
  user,
  onComplete,
  language,
  onLanguageChange,
}) => {
  const [step, setStep] = useState<OnboardingStep>(initialStep === 'splash' ? 'login' : initialStep);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  
  // Multi-role selection state
  const initialRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role || 'pilgrim'];
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(initialRoles);
  const [primaryRole, setPrimaryRole] = useState<UserRole>(user.role || initialRoles[0] || 'pilgrim');

  // Input states
  const [mobileNumber, setMobileNumber] = useState(
    user.emergencyMobile ? user.emergencyMobile.replace('+91 ', '') : '9822019876'
  );
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('warkari123');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('4921');
  const [fullName, setFullName] = useState(user.fullName || 'Swayam Pawar');
  const [age, setAge] = useState(user.age || '45');
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup || 'O+');
  const [emergencyName, setEmergencyName] = useState(user.emergencyName || 'Ramesh Pawar');
  const [emergencyMobile, setEmergencyMobile] = useState(user.emergencyMobile || '+91 98221 44556');
  const [documentName, setDocumentName] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const toggleRole = (role: UserRole) => {
    let next: UserRole[];
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length === 1) return; // Keep at least one
      next = selectedRoles.filter((r) => r !== role);
      if (primaryRole === role) {
        setPrimaryRole(next[0]);
      }
    } else {
      next = [...selectedRoles, role];
    }
    setSelectedRoles(next);
  };

  // Screen 1: Login & Registration with Multiple Role Selection (Checkboxes)
  if (step === 'login') {
    const handleAuthSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isSignUp) {
        // Direct Login -> go directly to complete / main app
        onComplete({
          fullName: fullName || 'Varkari Pilgrim',
          role: primaryRole,
          roles: selectedRoles,
          language,
          isLoggedIn: true,
          isRegistered: true,
          emergencyMobile: `+91 ${mobileNumber}`,
        });
      } else {
        if (!otpSent) {
          setOtpSent(true);
        } else {
          setStep('setup');
        }
      }
    };

    const handleQuickGuest = () => {
      onComplete({
        fullName: 'Varkari Pilgrim',
        role: 'pilgrim',
        roles: ['pilgrim'],
        language,
        isLoggedIn: true,
        isRegistered: false,
      });
    };

    return (
      <div className="min-h-screen w-full bg-[#fff8f1] flex flex-col justify-center items-center p-4 md:p-6 relative">
        {/* Background glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ffdbcb] rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#e0e0ff] rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 md:p-8 relative z-10 border border-[#e0c0b2]/40">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#9c3f00] text-white mb-2 shadow-md">
              <span className="material-symbols-outlined text-3xl filled">temple_hindu</span>
            </div>
            <h2 className="text-2xl font-bold text-[#9c3f00]">{t.appName}</h2>
            <p className="text-xs text-[#584237] mt-0.5">{t.tagline}</p>

            {/* Login vs Sign up Switcher */}
            <div className="flex bg-[#f4ede5] p-1 rounded-xl mt-4 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  !isSignUp
                    ? 'bg-white text-[#9c3f00] shadow-xs'
                    : 'text-[#584237] hover:text-[#1e1b17]'
                }`}
              >
                {language === 'mr' ? 'लॉग इन (Log In)' : language === 'hi' ? 'लॉग इन' : 'Log In'}
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  isSignUp
                    ? 'bg-white text-[#9c3f00] shadow-xs'
                    : 'text-[#584237] hover:text-[#1e1b17]'
                }`}
              >
                {language === 'mr' ? 'नवीन नोंदणी (Sign Up)' : language === 'hi' ? 'पंजीकरण' : 'Sign Up'}
              </button>
            </div>
          </div>

          {/* Multiple Roles Checkbox Selection */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-[#1e1b17] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[#9c3f00] text-base filled">checklist</span>
                <span>{language === 'mr' ? 'तुमच्या भूमिका (Multiple Roles)' : language === 'hi' ? 'आपकी भूमिकाएं' : 'Select Roles (Multi-Select)'}</span>
              </label>
              <span className="text-[11px] font-bold text-[#9c3f00] bg-[#ffdbcb]/60 px-2 py-0.5 rounded-full">
                {selectedRoles.length} {language === 'mr' ? 'निवडले' : 'selected'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map((r) => {
                const isSelected = selectedRoles.includes(r.role);
                const title = language === 'mr' ? r.titleMr.split(' ')[0] : language === 'hi' ? r.titleHi.split(' ')[0] : r.titleEn;
                const subtitle = language === 'mr' ? r.subtitleMr : r.subtitleEn;

                return (
                  <div
                    key={r.role}
                    onClick={() => toggleRole(r.role)}
                    className={`relative p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 ${
                      isSelected
                        ? 'border-[#9c3f00] bg-[#fff4ed] shadow-xs'
                        : 'border-[#e0c0b2] bg-white hover:bg-[#faf7f2]'
                    }`}
                  >
                    {/* Checkbox Icon */}
                    <div
                      className={`w-4 h-4 rounded mt-0.5 shrink-0 border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#9c3f00] border-[#9c3f00] text-white'
                          : 'bg-white border-[#bba89b]'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-xs font-bold">check</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#1e1b17] truncate leading-tight">{title}</p>
                      <p className="text-[10px] text-[#584237] truncate mt-0.5">{subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-[#1e1b17] mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e0c0b2] focus:border-[#9c3f00] text-sm text-[#1e1b17] outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1e1b17] mb-1">
                {t.mobileNumber}
              </label>
              <div className="flex rounded-xl border border-[#e0c0b2] focus-within:border-[#9c3f00] overflow-hidden bg-white">
                <span className="flex items-center px-3 bg-[#f4ede5] text-[#584237] text-xs font-bold border-r border-[#e0c0b2]">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={t.enter10Digit}
                  className="flex-1 px-3.5 py-2.5 text-sm text-[#1e1b17] outline-none"
                  maxLength={10}
                />
              </div>
            </div>

            {isSignUp && otpSent && (
              <div className="bg-[#f9f3eb] p-3 rounded-xl border border-[#e0c0b2]/60 animate-fadeIn">
                <label className="block text-xs font-semibold text-[#584237] mb-1">
                  {t.enterOtp} (Simulation code: 4921)
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold p-2 bg-white border border-[#9c3f00]/40 rounded-lg outline-none"
                  maxLength={4}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#9c3f00] hover:bg-[#7a3000] text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-1"
            >
              <span>{isSignUp ? (otpSent ? t.verifyOtp : t.sendOtp) : (language === 'mr' ? 'लॉग इन करा' : language === 'hi' ? 'लॉग इन करें' : 'Log In & Continue')}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>

            {/* Quick Guest Access */}
            <button
              type="button"
              onClick={handleQuickGuest}
              className="w-full py-2.5 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237] hover:bg-[#eee7df] transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">person_pin</span>
              <span>{language === 'mr' ? 'अतिथी म्हणून पुढे जा (Guest Access)' : language === 'hi' ? 'अतिथि के रूप में जारी रखें' : 'Continue as Guest'}</span>
            </button>
          </form>

          {/* Language Selection footer */}
          <div className="mt-5 pt-3.5 border-t border-[#e0c0b2]/50 text-center">
            <p className="text-[11px] font-semibold text-[#584237] mb-1.5">{t.languageSelection}</p>
            <div className="flex justify-center items-center gap-3 text-xs font-bold">
              <button
                onClick={() => onLanguageChange('mr')}
                className={`${language === 'mr' ? 'text-[#9c3f00] underline' : 'text-[#584237] hover:text-[#9c3f00]'}`}
              >
                मराठी
              </button>
              <span className="text-[#e0c0b2]">|</span>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`${language === 'hi' ? 'text-[#9c3f00] underline' : 'text-[#584237] hover:text-[#9c3f00]'}`}
              >
                हिंदी
              </button>
              <span className="text-[#e0c0b2]">|</span>
              <button
                onClick={() => onLanguageChange('en')}
                className={`${language === 'en' ? 'text-[#9c3f00] underline' : 'text-[#584237] hover:text-[#9c3f00]'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Detailed Profile Setup (if user opts for Sign Up)
  return (
    <div className="min-h-screen bg-[#fff8f1] flex flex-col items-center pb-28">
      {/* Header */}
      <header className="w-full bg-[#fff8f1] shadow-xs flex items-center px-4 h-14 sticky top-0 z-30 border-b border-[#e0c0b2]/40">
        <button
          onClick={() => setStep('login')}
          className="p-2 -ml-2 rounded-full text-[#9c3f00] hover:bg-[#eee7df]"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="font-bold text-lg text-[#9c3f00] text-center flex-1 pr-6">
          {t.appName}
        </h1>
      </header>

      <main className="w-full max-w-xl px-4 py-6">
        <div className="mb-6 text-center md:text-left">
          <h2 className="text-2xl font-bold text-[#9c3f00]">{t.profileSetup}</h2>
          <p className="text-xs text-[#584237] mt-1">
            Complete your profile to ensure safety and instant volunteer coordination.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-[#e0c0b2]/40 space-y-6">
          {/* Personal Details */}
          <section className="space-y-4">
            <h3 className="text-base font-bold text-[#1e1b17] flex items-center gap-2 border-b border-[#eee7df] pb-2">
              <span className="material-symbols-outlined text-[#9c3f00] filled">person</span>
              {t.personalDetails}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#fff8f1] border border-[#e0c0b2] rounded-xl p-3 text-sm text-[#1e1b17] outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                  {t.age}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full bg-[#fff8f1] border border-[#e0c0b2] rounded-xl p-3 text-sm text-[#1e1b17] outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                  {t.preferredLanguage}
                </label>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as AppLanguage)}
                  className="w-full bg-[#fff8f1] border border-[#e0c0b2] rounded-xl p-3 text-sm text-[#1e1b17] outline-none focus:border-[#9c3f00]"
                >
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                  {t.bloodGroup}
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-[#fff8f1] border border-[#e0c0b2] rounded-xl p-3 text-sm text-[#1e1b17] outline-none focus:border-[#9c3f00]"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-[#1e1b17] flex items-center gap-2 border-b border-[#eee7df] pb-2">
              <span className="material-symbols-outlined text-[#9c3f00] filled">contact_phone</span>
              {t.emergencyContact}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                  {t.contactPersonName}
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Relative or friend's name"
                  className="w-full bg-[#fff8f1] border border-[#e0c0b2] rounded-xl p-3 text-sm text-[#1e1b17] outline-none focus:border-[#9c3f00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                  {t.mobileNumber}
                </label>
                <input
                  type="tel"
                  value={emergencyMobile}
                  onChange={(e) => setEmergencyMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-[#fff8f1] border border-[#e0c0b2] rounded-xl p-3 text-sm text-[#1e1b17] outline-none focus:border-[#9c3f00]"
                />
              </div>
            </div>
          </section>

          {/* Role Verification ID */}
          <section className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-[#1e1b17] flex items-center gap-2 border-b border-[#eee7df] pb-2">
              <span className="material-symbols-outlined text-[#9c3f00] filled">verified_user</span>
              {t.roleVerification}
            </h3>

            <label className="bg-[#f4ede5] p-5 rounded-xl border-2 border-dashed border-[#e0c0b2] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#eee7df] transition-colors block">
              <span className="material-symbols-outlined text-4xl text-[#9c3f00] mb-2 filled">
                upload_file
              </span>
              <p className="text-sm font-semibold text-[#1e1b17]">
                {documentName ? `Uploaded: ${documentName}` : t.uploadId}
              </p>
              <p className="text-xs text-[#584237] mt-0.5">
                Tap to select a document (Aadhaar / Seva Pass)
              </p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setDocumentName(e.target.files[0].name);
                  }
                }}
              />
            </label>
          </section>
        </div>
      </main>

      {/* Fixed Complete Setup Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#e0c0b2] p-4 shadow-lg z-40">
        <div className="max-w-xl mx-auto flex justify-center">
          <button
            onClick={() => {
              onComplete({
                fullName,
                age,
                role: primaryRole,
                roles: selectedRoles,
                language,
                bloodGroup,
                emergencyName,
                emergencyMobile,
                isRegistered: true,
                isLoggedIn: true,
                documentUploaded: documentName || undefined,
              });
            }}
            className="w-full bg-[#9c3f00] hover:bg-[#7a3000] text-white font-bold py-4 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-lg"
          >
            <span>{t.completeSetup}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
