import React, { useState, useEffect } from 'react';
import { AppLanguage, UserProfile, EmergencyAlert } from '../types';
import { TRANSLATIONS } from '../data/mockData';
import {
  createSOSIncident,
  cancelSOSIncident,
  subscribeToSOSIncidents,
  isFirebaseConnected,
} from '../services/firebase';

interface SOSViewProps {
  language: AppLanguage;
  user: UserProfile;
}

export const SOSView: React.FC<SOSViewProps> = ({ language, user }) => {
  const t = TRANSLATIONS[language];
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedUrgency, setSelectedUrgency] = useState<'medical' | 'shelter' | 'water' | 'lost_person' | 'general'>('medical');
  const [emergencyNote, setEmergencyNote] = useState('');
  const [showLostPersonModal, setShowLostPersonModal] = useState(false);
  const [lostPersonName, setLostPersonName] = useState('');
  const [lostPersonAge, setLostPersonAge] = useState('');
  const [lostPersonClothes, setLostPersonClothes] = useState('');
  const [lostPersonDindi, setLostPersonDindi] = useState('Dindi No. 14');
  const [lostReportSuccess, setLostReportSuccess] = useState(false);

  // Subscribe to real-time SOS alerts and track the pilgrim's own active incident
  useEffect(() => {
    const unsubscribe = subscribeToSOSIncidents((incidents) => {
      // Find active incident created by this user or matching mobile/name
      const myIncident = incidents.find(
        (inc) =>
          (inc.userId === user.uid ||
            inc.userPhone === user.emergencyMobile ||
            inc.userName === user.fullName) &&
          inc.status !== 'cancelled' &&
          inc.status !== 'completed' &&
          inc.status !== 'resolved'
      );

      if (myIncident) {
        setActiveAlert(myIncident);
      } else {
        // If our active alert was completed or resolved by volunteer, keep for brief confirmation or clear
        setActiveAlert((prev) => {
          if (prev && (prev.status === 'accepted' || prev.status === 'pending')) {
            const completedMatch = incidents.find((inc) => inc.id === prev.id && inc.status === 'completed');
            if (completedMatch) {
              return completedMatch;
            }
          }
          return null;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid, user.emergencyMobile, user.fullName]);

  // Elapsed wait timer while ON HOLD / PENDING
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeAlert && (activeAlert.status === 'pending' || activeAlert.status === 'unassigned')) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeAlert?.status]);

  const handleTriggerSOS = async () => {
    setIsTriggering(true);
    try {
      const titleMap = {
        medical: language === 'mr' ? 'तातडीची वैद्यकीय मदत' : language === 'hi' ? 'आपातकालीन चिकित्सा' : 'Emergency Medical Assistance',
        water: language === 'mr' ? 'पाण्याची तातडीची गरज' : language === 'hi' ? 'जल संकट' : 'Urgent Water Assistance',
        shelter: language === 'mr' ? 'आश्रय / विश्रांती गरज' : language === 'hi' ? 'आश्रय सहायता' : 'Emergency Shelter Need',
        lost_person: language === 'mr' ? 'हरवलेली व्यक्ती शोध' : language === 'hi' ? 'लापता व्यक्ति तलाश' : 'Missing Person SOS',
        general: language === 'mr' ? 'तातडीची मदत हवी' : language === 'hi' ? 'सामान्य आपातकाल' : 'General Emergency Help',
      };

      const newAlert = await createSOSIncident({
        title: titleMap[selectedUrgency],
        type: selectedUrgency,
        icon: selectedUrgency === 'medical' ? 'warning' : selectedUrgency === 'water' ? 'water_drop' : 'emergency',
        urgency: 'high',
        status: 'pending', // STAYS ON HOLD UNTIL A VOLUNTEER ACCEPTS
        distanceText: 'Within 200m radius',
        locationText: 'Lonand Palkhi Talav Sector 4',
        timeAgo: 'Just now',
        userName: user.fullName || 'Varkari Pilgrim',
        userId: user.uid || `user_${Date.now()}`,
        userPhone: user.emergencyMobile || '+91 98220 19876',
        description: emergencyNote || (language === 'mr' ? 'वारकऱ्याला तातडीने स्वयंसेवक मदतीची गरज आहे.' : 'Pilgrim urgently requests on-ground volunteer aid.'),
      });

      setActiveAlert(newAlert);
      setEmergencyNote('');
    } catch (err) {
      console.error('Error triggering SOS:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleCancelSOS = async () => {
    if (activeAlert) {
      await cancelSOSIncident(activeAlert.id);
      setActiveAlert(null);
    }
  };

  const handleLostReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLostReportSuccess(true);

    try {
      await createSOSIncident({
        title: `${language === 'mr' ? 'हरवले:' : 'Missing:'} ${lostPersonName} (${lostPersonAge} yrs)`,
        type: 'lost_person',
        icon: 'person_search',
        urgency: 'high',
        status: 'pending',
        distanceText: 'All Sectors Broadcast',
        locationText: `${lostPersonDindi} • Lonand Base`,
        timeAgo: 'Just now',
        userName: user.fullName || 'Dindi Coordinator',
        userId: user.uid,
        userPhone: user.emergencyMobile || '+91 98220 19876',
        description: `Name: ${lostPersonName}, Age: ${lostPersonAge}, Dindi: ${lostPersonDindi}. Appearance: ${lostPersonClothes}`,
      });
    } catch (err) {
      console.error('Error broadcasting lost person:', err);
    }

    setTimeout(() => {
      setLostReportSuccess(false);
      setShowLostPersonModal(false);
      setLostPersonName('');
      setLostPersonAge('');
      setLostPersonClothes('');
    }, 2000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isPending = activeAlert && (activeAlert.status === 'pending' || activeAlert.status === 'unassigned');
  const isAccepted = activeAlert && (activeAlert.status === 'accepted' || activeAlert.status === 'in_progress');
  const isCompleted = activeAlert && (activeAlert.status === 'completed' || activeAlert.status === 'resolved');

  return (
    <div className="min-h-screen bg-[#fff8f1] px-3 sm:px-4 md:px-8 py-4 pb-32 max-w-2xl mx-auto space-y-4.5 w-full overflow-x-hidden box-border">
      {/* Top Banner */}
      <div className="text-center space-y-1 px-2">
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ba1a1a]">
            {isFirebaseConnected() ? 'Live Cloud SOS Network' : 'Instant Real-Time SOS Network'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#ba1a1a] tracking-tight flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-2xl sm:text-3xl filled">emergency</span>
          <span>{t.emergencyAssistance}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#584237] max-w-md mx-auto leading-relaxed">
          {language === 'mr'
            ? 'SOS बटण दाबताच तुमची विनंती थेट स्वयंसेवक पोर्टलवर प्रलंबित राहील. स्वयंसेवकाने स्वीकारताच थेट संपर्क होईल.'
            : language === 'hi'
            ? 'एसओएस दबाते ही आपकी कॉल स्वयंसेवक पोर्टल पर पेंडिंग रहेगी जब तक कोई स्वयंसेवक इसे स्वीकार नहीं करता।'
            : 'Pressing SOS places your request On Hold / Pending on the live Volunteer Portal until a nearby volunteer accepts it.'}
        </p>
      </div>

      {/* Emergency Type Selector (when idle) */}
      {!activeAlert && (
        <div className="bg-white rounded-2xl p-3 border border-[#e0c0b2] shadow-xs space-y-2">
          <label className="text-xs font-bold text-[#584237] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#9c3f00] filled">category</span>
            <span>{language === 'mr' ? 'मदतीचा प्रकार निवडा:' : language === 'hi' ? 'मदद का प्रकार:' : 'Select Emergency Need:'}</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { type: 'medical' as const, label: 'Medical', labelMr: 'वैद्यकीय', icon: 'medical_services' },
              { type: 'water' as const, label: 'Water', labelMr: 'पाणी', icon: 'water_drop' },
              { type: 'shelter' as const, label: 'Shelter', labelMr: 'विश्रांती', icon: 'home_pin' },
              { type: 'general' as const, label: 'Urgent', labelMr: 'तातडीची', icon: 'warning' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setSelectedUrgency(item.type)}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  selectedUrgency === item.type
                    ? 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a] font-bold shadow-xs'
                    : 'bg-[#fff8f1] border-[#e0c0b2] text-[#584237] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span className="text-[11px] leading-none">{language === 'mr' ? item.labelMr : item.label}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={emergencyNote}
            onChange={(e) => setEmergencyNote(e.target.value)}
            placeholder={language === 'mr' ? 'उदा. भोवळ आली आहे, लोणंद तलावाजवळ आहोत...' : 'Optional details (e.g. Near tent 4, need glucose)...'}
            className="w-full text-xs p-2.5 rounded-xl border border-[#e0c0b2] bg-[#fff8f1] outline-none focus:border-[#ba1a1a]"
          />
        </div>
      )}

      {/* Main Circular SOS Button or Active Alert Status */}
      {!activeAlert ? (
        <div className="py-3 flex flex-col items-center justify-center relative w-full">
          <div className="relative flex items-center justify-center w-52 h-52 sm:w-56 sm:h-56">
            <button
              onClick={handleTriggerSOS}
              disabled={isTriggering}
              aria-label="Send SOS location"
              className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-white text-center p-4 shadow-2xl transition-all duration-300 bg-[#ba1a1a] hover:bg-[#93000a] ring-6 ring-[#ffdad6]/70 active:scale-95"
            >
              <span className="material-symbols-outlined text-5xl mb-1 filled">sos</span>
              <span className="text-sm font-extrabold tracking-wider leading-tight uppercase max-w-[130px]">
                {language === 'mr' ? 'मदत मागवा (SOS)' : language === 'hi' ? 'मदद मांगें (SOS)' : 'TRIGGER SOS'}
              </span>
              <span className="text-[10px] text-white/90 mt-1 font-medium">
                {language === 'mr' ? 'स्वयंसेवक डेस्क' : 'Alert Volunteers'}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Real-time Dynamic Lifecycle State Card */
        <div className="space-y-3 animate-fadeIn">
          {/* 1. STATE: ON HOLD / PENDING VOLUNTEER ACCEPTANCE */}
          {isPending && (
            <div className="bg-[#fffcf9] rounded-3xl p-5 border-2 border-[#ea580c] shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#f4ede5] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#fff4ed] text-[#c2410c] flex items-center justify-center border border-[#ea580c]/30">
                    <span className="material-symbols-outlined text-2xl animate-spin">hourglass_top</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] inline-block">
                      {language === 'mr' ? 'प्रलंबित (ON HOLD)' : language === 'hi' ? 'होल्ड पर (PENDING)' : 'STATUS: ON HOLD / PENDING'}
                    </span>
                    <h3 className="text-base font-bold text-[#1e1b17] mt-0.5">
                      {language === 'mr' ? 'स्वयंसेवक स्वीकारण्याची वाट पाहत आहे' : language === 'hi' ? 'स्वयंसेवक के स्वीकारने की प्रतीक्षा' : 'Waiting for Volunteer to Accept'}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#584237] block">{language === 'mr' ? 'प्रतीक्षा वेळ' : 'Wait Time'}</span>
                  <span className="text-sm font-extrabold text-[#c2410c]">{formatTimer(elapsedSeconds)}</span>
                </div>
              </div>

              <div className="bg-[#fff8f1] p-3.5 rounded-2xl border border-[#e0c0b2]/60 space-y-1.5 text-xs text-[#584237]">
                <div className="flex items-center justify-between font-bold text-[#1e1b17]">
                  <span>{activeAlert.title}</span>
                  <span className="text-[#9c3f00]">{activeAlert.locationText}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {language === 'mr'
                    ? 'हा अलर्ट सर्व ऑन-ड्युटी स्वयंसेवकांच्या फोनवर लाइव्ह दिसत आहे. कोणीतरी स्वीकारताच येथे अपडेट होईल.'
                    : 'Your emergency beacon is broadcasting live to all logged-in volunteers in this sector.'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCancelSOS}
                  className="flex-1 py-3 rounded-2xl border-2 border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  <span>{language === 'mr' ? 'अलर्ट रद्द करा' : language === 'hi' ? 'रद्द करें' : 'Cancel Request'}</span>
                </button>
                <a
                  href="tel:108"
                  className="flex-1 py-3 rounded-2xl bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>{language === 'mr' ? '108 थेट डायल' : 'Direct Call 108'}</span>
                </a>
              </div>
            </div>
          )}

          {/* 2. STATE: ACCEPTED BY VOLUNTEER (IN PROGRESS) */}
          {isAccepted && (
            <div className="bg-[#fff8f1] rounded-3xl p-5 border-2 border-[#006b1b] shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#e0c0b2]/50 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-[#94f990] text-[#006b1b] flex items-center justify-center font-bold text-base shrink-0 border border-[#006b1b]/30">
                    <span className="material-symbols-outlined text-2xl filled">check_circle</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006b1b] bg-[#94f990]/50 px-2.5 py-0.5 rounded-full inline-block">
                      {language === 'mr' ? 'स्वयंसेवकाने स्वीकारले' : language === 'hi' ? 'स्वयंसेवक ने स्वीकार किया' : 'TASK ACCEPTED BY VOLUNTEER'}
                    </span>
                    <h3 className="text-base font-extrabold text-[#1e1b17] mt-0.5 truncate">
                      {activeAlert.acceptedByVolunteerName || activeAlert.assignedVolunteer || 'Verified Seva Volunteer'}
                    </h3>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#584237] block">{language === 'mr' ? 'मार्गस्थ' : 'En Route'}</span>
                  <span className="text-xs font-extrabold text-[#006b1b]">~3 mins</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#e0c0b2] space-y-2">
                <p className="text-xs text-[#584237]">
                  {language === 'mr'
                    ? 'स्वयंसेवक तुमच्या दिशेने रवाना झाले आहेत. थेट संपर्क साधण्यासाठी खालील बटण दाबा.'
                    : 'The volunteer is heading toward your location. Tap below to call them directly.'}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e1b17]">
                    <span className="material-symbols-outlined text-sm text-[#006b1b] filled">volunteer_activism</span>
                    <span>{activeAlert.acceptedByVolunteerName || 'Volunteer on duty'}</span>
                  </div>
                  <a
                    href={`tel:${activeAlert.acceptedByVolunteerPhone || '+919822011223'}`}
                    className="px-4 py-2 bg-[#006b1b] hover:bg-[#005214] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>{language === 'mr' ? 'स्वयंसेवकाला कॉल करा' : 'Call Volunteer'}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 3. STATE: COMPLETED / RESOLVED */}
          {isCompleted && (
            <div className="bg-[#e8f5e9] rounded-3xl p-5 border-2 border-[#1b5e20] shadow-xl text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-[#a5d6a7] text-[#1b5e20] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl filled">done_all</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1b5e20]">
                  {language === 'mr' ? 'मदत यशस्वीरित्या पूर्ण झाली!' : 'Emergency Assistance Completed!'}
                </h3>
                <p className="text-xs text-[#2e7d32] mt-1">
                  {activeAlert.resolutionNotes || (language === 'mr' ? 'स्वयंसेवकाने मदत पूर्ण झाली म्हणून नोंदवले आहे.' : 'Assistance has been provided on the ground.')}
                </p>
              </div>
              <button
                onClick={() => setActiveAlert(null)}
                className="px-6 py-2.5 bg-[#1b5e20] hover:bg-[#0d3b11] text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                {language === 'mr' ? 'ठीक आहे (Close)' : 'Dismiss & Return'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Dial Emergency Helplines */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-bold text-[#584237] uppercase tracking-wider">
          {language === 'mr' ? 'थेट शासकीय व पोलीस हेल्पलाइन' : language === 'hi' ? 'सीधी हेल्पलाइन' : 'Direct Emergency Helplines'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href="tel:108"
            className="p-3.5 bg-white rounded-2xl border border-[#ba1a1a]/30 shadow-xs flex items-center justify-between hover:bg-[#ffdad6]/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl filled">ambulance</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#1e1b17]">{t.call108}</h4>
                <p className="text-[11px] text-[#584237]">Maharashtra Govt Ambulance</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#ba1a1a] group-hover:translate-x-1 transition-transform text-lg">
              call
            </span>
          </a>

          <a
            href="tel:+912186223456"
            className="p-3.5 bg-white rounded-2xl border border-[#e0c0b2] shadow-xs flex items-center justify-between hover:bg-[#f9f3eb] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e0e0ff] text-[#4c56af] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl filled">local_police</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#1e1b17]">{t.controlRoom}</h4>
                <p className="text-[11px] text-[#584237]">District Administration</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#4c56af] group-hover:translate-x-1 transition-transform text-lg">
              call
            </span>
          </a>
        </div>
      </div>

      {/* Secondary Action: Report Lost Person */}
      <div className="pt-1">
        <button
          onClick={() => setShowLostPersonModal(true)}
          className="w-full bg-[#f4ede5] hover:bg-[#eee7df] text-[#584237] font-bold py-3.5 rounded-2xl border border-[#e0c0b2] flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-xs sm:text-sm"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl text-[#9c3f00] filled">person_search</span>
          <span>{t.reportLostPerson}</span>
        </button>
      </div>

      {/* Lost Person Report Modal */}
      {showLostPersonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-[#e0c0b2] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#eee7df] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#ba1a1a]">
                  {language === 'mr' ? 'हरवलेल्या भाविकाची नोंद' : 'Report Missing Pilgrim'}
                </h3>
                <p className="text-[11px] text-[#584237]">
                  {language === 'mr' ? 'दिंडी प्रमुख आणि स्वयंसेवकांना थेट ब्रॉडकास्ट' : 'Broadcast to all volunteers & control desks'}
                </p>
              </div>
              <button
                onClick={() => setShowLostPersonModal(false)}
                className="p-1.5 rounded-full bg-[#eee7df] text-[#584237]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {lostReportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#94f990] text-[#006b1b] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl filled">check</span>
                </div>
                <h4 className="text-base font-bold text-[#1e1b17]">
                  {language === 'mr' ? 'नोंद प्रसारित करण्यात आली!' : 'Report Broadcasted!'}
                </h4>
                <p className="text-xs text-[#584237]">
                  {language === 'mr' ? 'स्वयंसेवक व पोलीस नियंत्रण कक्षाला थेट पाठवले आहे.' : 'Dispatched to volunteer network.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleLostReportSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                    {language === 'mr' ? 'हरवलेल्या व्यक्तीचे नाव' : "Missing Person's Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={lostPersonName}
                    onChange={(e) => setLostPersonName(e.target.value)}
                    placeholder="e.g. Anandibai Kadam"
                    className="w-full p-2.5 sm:p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl text-xs sm:text-sm outline-none focus:border-[#9c3f00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                      {language === 'mr' ? 'वय' : 'Age'}
                    </label>
                    <input
                      type="number"
                      required
                      value={lostPersonAge}
                      onChange={(e) => setLostPersonAge(e.target.value)}
                      placeholder="e.g. 68"
                      className="w-full p-2.5 sm:p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl text-xs sm:text-sm outline-none focus:border-[#9c3f00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                      {language === 'mr' ? 'दिंडी / गट' : 'Dindi / Group'}
                    </label>
                    <input
                      type="text"
                      value={lostPersonDindi}
                      onChange={(e) => setLostPersonDindi(e.target.value)}
                      placeholder="e.g. Dindi No. 14"
                      className="w-full p-2.5 sm:p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl text-xs sm:text-sm outline-none focus:border-[#9c3f00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e1b17] mb-1">
                    {language === 'mr' ? 'कपडे आणि ओळख खूण' : 'Clothing & Identification'}
                  </label>
                  <input
                    type="text"
                    required
                    value={lostPersonClothes}
                    onChange={(e) => setLostPersonClothes(e.target.value)}
                    placeholder="e.g. Yellow saree, Tulsi mala"
                    className="w-full p-2.5 sm:p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl text-xs sm:text-sm outline-none focus:border-[#9c3f00]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLostPersonModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237]"
                  >
                    {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm filled">campaign</span>
                    <span>{language === 'mr' ? 'प्रसारित करा' : 'Broadcast'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
