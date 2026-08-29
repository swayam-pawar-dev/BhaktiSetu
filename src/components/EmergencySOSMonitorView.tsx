import React, { useState } from 'react';
import { EmergencyAlert, AppLanguage, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/mockData';
import { acceptSOSIncident, completeSOSIncident, isFirebaseConnected } from '../services/firebase';

interface EmergencySOSMonitorViewProps {
  alerts: EmergencyAlert[];
  onUpdateAlerts?: (updated: EmergencyAlert[]) => void;
  onOpenMapCoordinates?: (locationText: string) => void;
  language: AppLanguage;
  user: UserProfile;
}

export const EmergencySOSMonitorView: React.FC<EmergencySOSMonitorViewProps> = ({
  alerts,
  onOpenMapCoordinates,
  language,
  user,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [selectedCallUser, setSelectedCallUser] = useState<{ name: string; phone: string } | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Dynamic filter from real database state (No hardcoded messages)
  const activeAlerts = alerts.filter(
    (a) => a.status === 'pending' || a.status === 'accepted' || a.status === 'in_progress' || a.status === 'unassigned'
  );
  const resolvedAlerts = alerts.filter(
    (a) => a.status === 'completed' || a.status === 'resolved'
  );

  const handleAcceptTask = async (alertId: string) => {
    try {
      await acceptSOSIncident(alertId, {
        id: user.uid || `vol_${Date.now()}`,
        name: user.fullName || 'Volunteer On-Ground',
        phone: user.emergencyMobile || '+91 98220 11223',
      });
      showNotice(language === 'mr' ? 'मदत स्वीकारली! तुम्ही या आपत्कालीन घटनेला नियुक्त झाला आहात.' : 'Task accepted! You are assigned to this emergency.');
    } catch (err) {
      console.error('Error accepting task:', err);
    }
  };

  const handleOpenResolveModal = (alertId: string) => {
    setResolvingAlertId(alertId);
    setResolutionNotes(language === 'mr' ? 'वारकऱ्याला मदत पोहचवली व प्रकृती स्थिर आहे.' : 'Assistance provided successfully on the ground.');
  };

  const handleConfirmResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingAlertId) return;

    try {
      await completeSOSIncident(resolvingAlertId, resolutionNotes);
      showNotice(language === 'mr' ? 'घटना पूर्ण झाली म्हणून नोंदवली गेली.' : 'Emergency successfully marked as completed & resolved.');
    } catch (err) {
      console.error('Error completing task:', err);
    } finally {
      setResolvingAlertId(null);
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5ede4] text-[#1e1b17] pb-36 pt-1 px-3 md:px-6 max-w-xl mx-auto space-y-4">
      {/* Dynamic Database Status Strip */}
      <div className="flex items-center justify-between px-2 pt-1 text-xs text-[#584237]">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span>
          <span>{isFirebaseConnected() ? 'Firebase Cloud SOS Feed' : 'Live Sync SOS Feed'}</span>
        </div>
        <span className="text-[11px] font-semibold bg-[#fffcf9] px-2.5 py-0.5 rounded-full border border-[#e8d5c4]">
          {activeAlerts.length} {language === 'mr' ? 'सक्रिय विनंत्या' : 'Active Queued'}
        </span>
      </div>

      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1e1b17] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce border border-[#9c3f00]">
          <span className="material-symbols-outlined text-base text-[#84e380]">check_circle</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs: Active Alerts vs Resolved */}
      <div className="flex border-b border-[#e0c0b2] pt-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 text-sm font-bold text-center transition-all relative ${
            activeTab === 'active'
              ? 'text-[#9c3f00]'
              : 'text-[#584237]/70 hover:text-[#1e1b17]'
          }`}
        >
          <span>{language === 'mr' ? 'सक्रिय विनंत्या (Active SOS)' : 'Active Alerts'}</span>
          <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-[#ffdad6] text-[#ba1a1a] font-extrabold">
            {activeAlerts.length}
          </span>
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9c3f00] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`flex-1 py-3 text-sm font-bold text-center transition-all relative ${
            activeTab === 'resolved'
              ? 'text-[#9c3f00]'
              : 'text-[#584237]/70 hover:text-[#1e1b17]'
          }`}
        >
          <span>{language === 'mr' ? 'पूर्ण झालेले (Resolved)' : 'Resolved'}</span>
          <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-[#e8e2d8] text-[#584237] font-extrabold">
            {resolvedAlerts.length}
          </span>
          {activeTab === 'resolved' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9c3f00] rounded-full" />
          )}
        </button>
      </div>

      {/* List of Alerts */}
      <div className="space-y-4 pt-1">
        {activeTab === 'active' && activeAlerts.length === 0 && (
          <div className="bg-[#fffcf9] rounded-3xl p-8 text-center border border-[#e8d5c4] shadow-xs space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl filled">verified</span>
            </div>
            <h3 className="text-base font-bold text-[#1e1b17]">
              {language === 'mr' ? 'सध्या कोणतीही प्रलंबित SOS विनंती नाही' : 'All Clear! No Pending SOS Requests'}
            </h3>
            <p className="text-xs text-[#584237] max-w-sm mx-auto">
              {language === 'mr'
                ? 'वारकऱ्यांनी SOS बटण दाबताच थेट येथे रिअल-टाइम विनंती दिसेल आणि तुम्ही ती स्वीकारू शकता.'
                : 'Whenever a pilgrim triggers an emergency SOS on their device, it will appear here immediately on hold until you accept it.'}
            </p>
          </div>
        )}

        {activeTab === 'resolved' && resolvedAlerts.length === 0 && (
          <div className="bg-[#fffcf9] rounded-3xl p-8 text-center border border-[#e8d5c4] shadow-xs space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#584237]">history</span>
            <h3 className="text-base font-bold text-[#1e1b17]">
              {language === 'mr' ? 'कोणत्याही पूर्ण झालेल्या नोंदी नाहीत' : 'No Resolved Alerts Yet'}
            </h3>
            <p className="text-xs text-[#584237]">
              {language === 'mr'
                ? 'स्वयंसेवकांनी पूर्ण केलेले सर्व इमर्जन्सी टास्क येथे सुरक्षित राहतील.'
                : 'Completed emergency cases will be archived here for record.'}
            </p>
          </div>
        )}

        {(activeTab === 'active' ? activeAlerts : resolvedAlerts).map((alert) => {
          const isPendingOnHold = alert.status === 'pending' || alert.status === 'unassigned';
          const isAcceptedInProgress = alert.status === 'accepted' || alert.status === 'in_progress';
          const isResolved = alert.status === 'completed' || alert.status === 'resolved';

          const isAssignedToMe =
            alert.acceptedByVolunteerId === user.uid ||
            alert.assignedVolunteer?.includes(user.fullName);

          return (
            <div
              key={alert.id}
              className={`rounded-[24px] overflow-hidden shadow-sm border transition-all ${
                isPendingOnHold
                  ? 'border-[#ea580c] bg-[#fffcf9]'
                  : isAcceptedInProgress
                  ? 'border-[#006b1b] bg-[#fffcf9]'
                  : 'border-[#e8d5c4] bg-[#fffcf9]'
              }`}
            >
              {/* Header */}
              <div
                className={`px-5 py-3.5 flex items-center justify-between border-b ${
                  isPendingOnHold
                    ? 'bg-[#fff4ed] border-[#ea580c]/30 text-[#93000a]'
                    : isAcceptedInProgress
                    ? 'bg-[#f0fdf4] border-[#006b1b]/30 text-[#006b1b]'
                    : 'bg-[#f4ede5] border-[#e0c0b2]/60 text-[#584237]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`material-symbols-outlined text-xl filled ${
                      isPendingOnHold ? 'text-[#ba1a1a]' : 'text-[#006b1b]'
                    }`}
                  >
                    {alert.type === 'medical'
                      ? 'warning'
                      : alert.type === 'water'
                      ? 'water_drop'
                      : alert.type === 'shelter'
                      ? 'home_pin'
                      : alert.type === 'lost_person'
                      ? 'person_search'
                      : 'emergency'}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight truncate">
                    {alert.title}
                  </h3>
                </div>

                {/* Status Badges */}
                {isPendingOnHold && (
                  <span className="bg-[#ea580c] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>{language === 'mr' ? 'प्रलंबित / ON HOLD' : 'ON HOLD'}</span>
                  </span>
                )}
                {isAcceptedInProgress && (
                  <span className="bg-[#006b1b] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs shrink-0">
                    {language === 'mr' ? 'स्वीकारले' : 'ACCEPTED'}
                  </span>
                )}
                {isResolved && (
                  <span className="bg-[#15803d] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0">
                    {language === 'mr' ? 'पूर्ण झाले' : 'COMPLETED'}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3.5">
                {/* Distance & Pilgrim Info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e1b17]">
                      <span className="material-symbols-outlined text-sm text-[#9c3f00] filled">
                        location_on
                      </span>
                      <span>{alert.locationText || 'Lonand Sector 4'}</span>
                    </div>
                    <p className="text-[11px] text-[#584237]">{alert.distanceText}</p>
                  </div>

                  <span className="text-[11px] text-[#584237] font-semibold">
                    {alert.timeAgo || 'Recent'}
                  </span>
                </div>

                {/* Description & User Note */}
                <div className="bg-[#f9f3eb] rounded-2xl p-3.5 text-xs text-[#584237] leading-relaxed border border-[#e0c0b2]/40 space-y-1">
                  <div className="flex justify-between items-center font-bold text-[#1e1b17]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#9c3f00] filled">person</span>
                      <span>{alert.userName}</span>
                    </span>
                    <span className="text-[#9c3f00]">{alert.userPhone}</span>
                  </div>
                  <p className="text-[11px] text-[#1e1b17] pt-0.5">{alert.description}</p>

                  {/* Assigned Volunteer Details */}
                  {alert.acceptedByVolunteerName && (
                    <div className="mt-2 pt-2 border-t border-[#e0c0b2]/60 text-[11px] text-[#006b1b] font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>Accepted by: {alert.acceptedByVolunteerName}</span>
                      </span>
                      <span className="text-[#584237] font-medium">{alert.acceptedByVolunteerPhone}</span>
                    </div>
                  )}

                  {alert.resolutionNotes && (
                    <p className="mt-1 pt-1 border-t border-[#e0c0b2]/40 text-[11px] text-[#15803d]">
                      <span className="font-bold">Resolution: </span>{alert.resolutionNotes}
                    </p>
                  )}
                </div>

                {/* Primary Action Button (Accept Task / Mark Completed) */}
                {!isResolved && (
                  <div>
                    {isPendingOnHold ? (
                      <button
                        type="button"
                        onClick={() => handleAcceptTask(alert.id)}
                        className="w-full bg-[#9c3f00] hover:bg-[#7a3000] text-white font-extrabold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-sm"
                      >
                        <span className="material-symbols-outlined text-lg filled">volunteer_activism</span>
                        <span>{language === 'mr' ? 'मदत स्वीकारा (Accept Task)' : 'Accept Emergency Task'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenResolveModal(alert.id)}
                        className="w-full bg-[#006b1b] hover:bg-[#005214] text-white font-extrabold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-sm"
                      >
                        <span className="material-symbols-outlined text-lg filled">check_circle</span>
                        <span>{language === 'mr' ? 'मदत पूर्ण झाली म्हणून नोंदवा' : 'Mark as Completed / Resolved'}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Secondary Action Buttons: Call User & Map */}
                <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                  <a
                    href={`tel:${alert.userPhone}`}
                    className="w-full py-2.5 px-3 bg-[#fffcf9] hover:bg-[#f4ede5] border border-[#9c3f00]/40 rounded-2xl text-xs font-bold text-[#9c3f00] flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all text-center"
                  >
                    <span className="material-symbols-outlined text-base">call</span>
                    <span>{language === 'mr' ? 'भाविकाला कॉल' : 'Call Pilgrim'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenMapCoordinates) {
                        onOpenMapCoordinates(alert.locationText);
                      }
                    }}
                    className="w-full py-2.5 px-3 bg-[#fffcf9] hover:bg-[#f4ede5] border border-[#9c3f00]/40 rounded-2xl text-xs font-bold text-[#9c3f00] flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">near_me</span>
                    <span>{language === 'mr' ? 'नकाशावर पहा' : 'View on Map'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution Confirmation Modal */}
      {resolvingAlertId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#e0c0b2] shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl filled">task_alt</span>
            </div>
            <div className="text-center">
              <h3 className="text-base font-extrabold text-[#1e1b17]">
                {language === 'mr' ? 'मदत पूर्ण झाल्याची नोंद' : 'Complete Assistance'}
              </h3>
              <p className="text-xs text-[#584237] mt-1">
                {language === 'mr'
                  ? 'वारकऱ्याला मदत मिळाली आहे का? थोडक्यात नोंद लिहा.'
                  : 'Confirm that assistance has been provided on-ground to the pilgrim.'}
              </p>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-3">
              <textarea
                required
                rows={2}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. First aid provided, rested at Camp 4..."
                className="w-full text-xs p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl outline-none focus:border-[#006b1b]"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingAlertId(null)}
                  className="py-2.5 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237]"
                >
                  {language === 'mr' ? 'रद्द' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#006b1b] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  {language === 'mr' ? 'नोंद जतन करा' : 'Confirm Resolved'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
