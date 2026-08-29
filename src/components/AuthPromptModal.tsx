import React from 'react';
import { NavigationTab, AppLanguage } from '../types';

interface AuthPromptModalProps {
  targetTab?: NavigationTab | null;
  language: AppLanguage;
  onLogin: () => void;
  onSignUp: () => void;
  onClose: () => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  targetTab = 'connect',
  language,
  onLogin,
  onSignUp,
  onClose,
}) => {
  // Title & description customized based on the tab user clicked
  const getTabDetails = () => {
    switch (targetTab) {
      case 'sos':
      case 'sos_monitor':
        return {
          icon: 'emergency',
          iconColor: 'bg-[#ffdad6] text-[#ba1a1a]',
          title: language === 'mr' ? 'आपत्कालीन SOS साठी लॉग इन आवश्यक' : language === 'hi' ? 'आपातकालीन SOS के लिए लॉग इन आवश्यक' : 'Sign In Required for Emergency SOS',
          description:
            language === 'mr'
              ? 'तातडीची वैद्यकीय मदत, रुग्णवाहिका किंवा सुरक्षिततेसाठी थेट स्वयंसेवकांना अलर्ट पाठवण्यासाठी तुमचे प्रोफाइल व संपर्क क्रमांक आवश्यक आहे.'
              : language === 'hi'
              ? 'आपातकालीन चिकित्सा, एम्बुलेंस और सुरक्षा के लिए स्वयंसेवकों को जीपीएस अलर्ट भेजने के लिए लॉग इन आवश्यक है।'
              : 'Dispatching real-time emergency medical alerts with live GPS coordinates to verified volunteers requires an authenticated profile.',
        };
      case 'connect':
        return {
          icon: 'groups',
          iconColor: 'bg-[#ffdbcb] text-[#9c3f00]',
          title: language === 'mr' ? 'स्वयंसेवक व दिंडी संवादासाठी लॉग इन करा' : language === 'hi' ? 'स्वयंसेवक नेटवर्क के लिए लॉग इन करें' : 'Sign In to Connect with Volunteers',
          description:
            language === 'mr'
              ? 'मार्गदर्शन करणाऱ्या पडताळणीकृत स्वयंसेवकांशी थेट संपर्क साधण्यासाठी आणि दिंडी ग्रुपवर अपडेट्स पोस्ट करण्यासाठी कृपया लॉग इन करा.'
              : language === 'hi'
              ? 'सत्यापित स्वयंसेवकों से संपर्क करने और दिंडी समूह में संदेश साझा करने के लिए कृपया साइन इन करें।'
              : 'Sign in to contact verified on-route volunteers directly, request assistance, and interact with the Dindi community feed.',
        };
      case 'profile':
      default:
        return {
          icon: 'account_circle',
          iconColor: 'bg-[#ffdbcb] text-[#9c3f00]',
          title: language === 'mr' ? 'प्रोफाइलसाठी लॉग इन आवश्यक' : language === 'hi' ? 'प्रोफाइल के लिए लॉग इन करें' : 'Sign In to Access Profile',
          description:
            language === 'mr'
              ? 'तुमचे ओळखपत्र, आपत्कालीन संपर्क, बहु-भूमिका (वारकरी/सेवक) बॅजेस व ऑफलाइन नकाशे व्यवस्थापित करण्यासाठी लॉग इन करा.'
              : language === 'hi'
              ? 'अपनी पहचान, आपातकालीन संपर्क, स्वयंसेवक भूमिकाएं और सेटिंग्स देखने के लिए कृपया लॉग इन करें।'
              : 'Access your verified pilgrim identity card, emergency medical contacts, seva roles, and personal settings by signing in.',
        };
    }
  };

  const details = getTabDetails();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-[#e0c0b2] space-y-5 animate-scaleUp relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#f4ede5] hover:bg-[#e0c0b2] text-[#584237] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Feature Icon Header */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mb-3 ${details.iconColor}`}>
            <span className="material-symbols-outlined text-3xl filled">{details.icon}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#1e1b17] leading-snug">
            {details.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#584237] mt-2 leading-relaxed px-2">
            {details.description}
          </p>
        </div>

        {/* Guest Access Benefits Note */}
        <div className="bg-[#fff8f1] rounded-2xl p-3.5 border border-[#e0c0b2]/60 text-xs text-[#584237] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#9c3f00]">
            <span className="material-symbols-outlined text-sm filled">info</span>
            <span>{language === 'mr' ? 'अतिथींसाठी उपलब्ध सुविधा' : language === 'hi' ? 'अतिथियों के लिए खुली सुविधाएं' : 'Guest Mode Access'}</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {language === 'mr'
              ? 'लॉग आउट असताना तुम्ही थेट नकाशा (अन्नछत्र, विश्रांती, पाणी) आणि पालखी मार्गदर्शक मोफत पाहू शकता.'
              : language === 'hi'
              ? 'लॉग आउट होने पर भी आप लाइव नक्शा (अन्नछत्र, पानी, चिकित्सा) और आध्यात्मिक गाइड देख सकते हैं।'
              : 'You can freely explore the live pilgrimage map (food, water, resting halts) and spiritual guide without signing in.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={onLogin}
            className="w-full py-3.5 bg-[#9c3f00] hover:bg-[#7a3000] text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            <span>{language === 'mr' ? 'लॉग इन करा (Log In)' : language === 'hi' ? 'लॉग इन करें' : 'Log In to Continue'}</span>
          </button>

          <button
            onClick={onSignUp}
            className="w-full py-3 bg-[#ffdbcb] hover:bg-[#ffb693] text-[#7a3000] font-bold rounded-2xl border border-[#9c3f00]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            <span>{language === 'mr' ? 'नवीन खाते तयार करा (Sign Up)' : language === 'hi' ? 'नया खाता बनाएं' : 'Create Free Account'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-[#8c7166] hover:text-[#1e1b17] transition-colors"
          >
            {language === 'mr' ? 'नकाशा व माहिती पाहत राहा (Continue Browsing)' : language === 'hi' ? 'नक्शा देखना जारी रखें' : 'Continue Browsing Map & Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
