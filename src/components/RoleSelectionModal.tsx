import React, { useState } from 'react';
import { UserRole, AppLanguage, UserProfile } from '../types';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  language: AppLanguage;
  onSaveRoles: (selectedRoles: UserRole[], primaryRole: UserRole) => void;
}

interface RoleOption {
  role: UserRole;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  subtitleEn: string;
  subtitleMr: string;
  subtitleHi: string;
  icon: string;
  badgeColor: string;
  descriptionEn: string;
  descriptionMr: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'pilgrim',
    titleEn: 'Pilgrim',
    titleMr: 'वारकरी (यात्रेकरू)',
    titleHi: 'वारकरी (तीर्थयात्री)',
    subtitleEn: 'Standard Wari Participant',
    subtitleMr: 'पालखी सोहळा पदयात्री',
    subtitleHi: 'पालकी शोभायात्रा पदयात्री',
    icon: 'directions_walk',
    badgeColor: 'bg-[#9c3f00]',
    descriptionEn: 'Receive live alerts, route navigation, and trigger emergency SOS on-ground.',
    descriptionMr: 'थेट मार्ग, अन्न-पाणी माहिती व गरज पडल्यास आपत्कालीन SOS मदत मागवा.',
  },
  {
    role: 'volunteer',
    titleEn: 'Seva Volunteer',
    titleMr: 'स्वयंसेवक (सेवा दल)',
    titleHi: 'स्वयंसेवक (सेवा दल)',
    subtitleEn: 'Emergency & Route Assistance',
    subtitleMr: 'आपत्कालीन SOS मदत व मार्ग सेवा',
    subtitleHi: 'आपातकालीन सहायता व मार्ग सेवा',
    icon: 'volunteer_activism',
    badgeColor: 'bg-[#c2410c]',
    descriptionEn: 'Accept pending SOS alerts, dispatch aid to pilgrims, and coordinate crowd safety.',
    descriptionMr: 'वारकऱ्यांचे रखडलेले SOS स्वीकारून मदत पोहचवणे व पूर्ण झाले म्हणून नोंदवणे.',
  },
  {
    role: 'camp_manager',
    titleEn: 'Camp & Food Manager',
    titleMr: 'तंबू व अन्नछत्र व्यवस्थापक',
    titleHi: 'तंबू व अन्नछत्र प्रबंधक',
    subtitleEn: 'Halt & Inventory Logistics',
    subtitleMr: 'मुक्काम व अन्न-पाणी व्यवस्थापन',
    subtitleHi: 'मुकाम व रसद प्रबंधन',
    icon: 'holiday_village',
    badgeColor: 'bg-[#15803d]',
    descriptionEn: 'Manage tent capacities, meal distribution counters, and volunteer shifts.',
    descriptionMr: 'विश्रांती शेड, अन्नदान रांगा व स्थानिक सेवेचे थेट व्यवस्थापन.',
  },
  {
    role: 'medical',
    titleEn: 'Medical / First Aid',
    titleMr: 'वैद्यकीय सेवा पथक',
    titleHi: 'चिकित्सा सहायता दल',
    subtitleEn: 'Doctors & Ambulances',
    subtitleMr: 'डॉक्टर, औषधे व 108 रुग्णवाहिका',
    subtitleHi: 'डॉक्टर व एम्बुलेंस सहायता',
    icon: 'medical_services',
    badgeColor: 'bg-[#b91c1c]',
    descriptionEn: 'Direct triage for medical emergency SOS beacons, heatstroke, and blister care.',
    descriptionMr: 'तातडीच्या वैद्यकीय आपत्कालीन घटनांवर थेट उपचार व समन्वय.',
  },
  {
    role: 'ngo',
    titleEn: 'NGO & Organization',
    titleMr: 'सामाजिक संस्था / NGO',
    titleHi: 'सामाजिक संगठन / NGO',
    subtitleEn: 'Resource Support',
    subtitleMr: 'पाणी व मदत वाटप समन्वयक',
    subtitleHi: 'संसाधन सहायता',
    icon: 'diversity_3',
    badgeColor: 'bg-[#4338ca]',
    descriptionEn: 'Coordinate clean drinking water, sanitation vans, and lost-and-found desks.',
    descriptionMr: 'शुद्ध पाणी वाटप, हरवलेल्या व्यक्ती कक्ष व सेवेचे संयोजन.',
  },
];

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  user,
  language,
  onSaveRoles,
}) => {
  // Ensure we have an initial array of selected roles
  const initialRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role || 'pilgrim'];
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(initialRoles);
  const [primaryRole, setPrimaryRole] = useState<UserRole>(user.role || initialRoles[0] || 'pilgrim');

  if (!isOpen) return null;

  const toggleRole = (role: UserRole) => {
    let next: UserRole[];
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length === 1) {
        // Must have at least 1 role
        return;
      }
      next = selectedRoles.filter((r) => r !== role);
      if (primaryRole === role) {
        setPrimaryRole(next[0]);
      }
    } else {
      next = [...selectedRoles, role];
    }
    setSelectedRoles(next);
  };

  const handleSave = () => {
    const finalPrimary = selectedRoles.includes(primaryRole) ? primaryRole : selectedRoles[0];
    onSaveRoles(selectedRoles, finalPrimary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-t-[28px] md:rounded-3xl shadow-2xl border border-[#e0c0b2] max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
        {/* Modal Header */}
        <div className="p-5 pb-3 border-b border-[#f4ede5] flex items-start justify-between bg-[#fff8f1]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#9c3f00] text-2xl filled">checklist</span>
              <h2 className="text-lg font-bold text-[#1e1b17]">
                {language === 'mr' ? 'भूमिका निवडा (Multiple Roles)' : language === 'hi' ? 'भूमिकाएं चुनें (Multiple Roles)' : 'Select Your Roles'}
              </h2>
            </div>
            <p className="text-xs text-[#584237]">
              {language === 'mr'
                ? 'तुम्ही एकाच वेळी अनेक भूमिका (उदा. वारकरी + स्वयंसेवक) निवडू शकता.'
                : language === 'hi'
                ? 'आप एक साथ कई भूमिकाएं (जैसे वारकरी + स्वयंसेवक) चुन सकते हैं।'
                : 'Select all roles that apply. You can participate as both a Pilgrim and Volunteer.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#eee7df] text-[#584237] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Roles Checkbox List */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <p className="text-xs font-bold text-[#584237] uppercase tracking-wider">
            {language === 'mr' ? 'उपलब्ध भूमिका (Check to Enable):' : language === 'hi' ? 'उपलब्ध भूमिकाएं (चेक करें):' : 'Available Roles:'}
          </p>

          <div className="space-y-2.5">
            {ROLE_OPTIONS.map((opt) => {
              const isChecked = selectedRoles.includes(opt.role);
              const isPrimary = primaryRole === opt.role;

              const title = language === 'mr' ? opt.titleMr : language === 'hi' ? opt.titleHi : opt.titleEn;
              const subtitle = language === 'mr' ? opt.subtitleMr : language === 'hi' ? opt.subtitleHi : opt.subtitleEn;
              const desc = language === 'mr' ? opt.descriptionMr : opt.descriptionEn;

              return (
                <div
                  key={opt.role}
                  onClick={() => toggleRole(opt.role)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-[#fff4ed] border-[#ea580c] shadow-xs'
                      : 'bg-white border-[#e0c0b2] hover:bg-[#faf7f2]'
                  }`}
                >
                  {/* Custom Styled Checkbox */}
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#9c3f00] border-[#9c3f00] text-white shadow-xs'
                          : 'bg-white border-[#bba89b]'
                      }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      )}
                    </div>
                  </div>

                  {/* Icon & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-lg ${isChecked ? 'text-[#9c3f00]' : 'text-[#584237]'}`}>
                          {opt.icon}
                        </span>
                        <h3 className="font-bold text-sm text-[#1e1b17]">{title}</h3>
                      </div>

                      {isChecked && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrimaryRole(opt.role);
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                            isPrimary
                              ? 'bg-[#9c3f00] text-white border-[#9c3f00]'
                              : 'bg-white text-[#584237] border-[#e0c0b2] hover:border-[#9c3f00]'
                          }`}
                          title="Set as active view mode"
                        >
                          {isPrimary
                            ? (language === 'mr' ? '★ मुख्य भूमिका' : language === 'hi' ? '★ मुख्य' : '★ Primary')
                            : (language === 'mr' ? 'मुख्य करा' : language === 'hi' ? 'मुख्य बनाएं' : 'Set Primary')}
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] font-medium text-[#c2410c]">{subtitle}</p>
                    <p className="text-[11px] text-[#584237] mt-1 leading-snug">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#fff8f1] border-t border-[#f4ede5] flex items-center justify-between gap-3">
          <div className="text-xs text-[#584237]">
            <span className="font-bold text-[#1e1b17]">{selectedRoles.length}</span>{' '}
            {language === 'mr' ? 'भूमिका निवडल्या' : language === 'hi' ? 'भूमिका चुनी गईं' : 'roles enabled'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237] hover:bg-[#eee7df] transition-colors"
            >
              {language === 'mr' ? 'रद्द करा' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#9c3f00] hover:bg-[#7a3000] text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>{language === 'mr' ? 'भूमिका जतन करा' : language === 'hi' ? 'भूमिकाएं सहेजें' : 'Save Roles'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
