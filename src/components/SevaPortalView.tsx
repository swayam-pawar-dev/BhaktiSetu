import React, { useState } from 'react';
import { CampData, EmergencyAlert, AppLanguage, UserProfile, NavigationTab } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface SevaPortalViewProps {
  campData: CampData;
  onUpdateCampData: (updated: CampData) => void;
  alerts: EmergencyAlert[];
  onNavigateTab: (tab: NavigationTab) => void;
  language: AppLanguage;
  user: UserProfile;
}

export const SevaPortalView: React.FC<SevaPortalViewProps> = ({
  campData,
  onUpdateCampData,
  alerts,
  onNavigateTab,
  language,
  user,
}) => {
  const t = TRANSLATIONS[language];
  const [helpedCount, setHelpedCount] = useState(campData.pilgrimsHelpedToday);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastList, setBroadcastList] = useState<string[]>([
    'Fresh hot Khichdi and Lemon Sarbat ready at Sector 4 Annachhatra.',
    'Medical Camp has restocked ORS packets and foot blister bandages.',
  ]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const activeAlerts = alerts.filter((a) => a.status === 'unassigned');
  const inProgressAlerts = alerts.filter((a) => a.status === 'in_progress');

  const handleIncrementHelped = (amount: number) => {
    const updated = helpedCount + amount;
    setHelpedCount(updated);
    onUpdateCampData({
      ...campData,
      pilgrimsHelpedToday: updated,
    });
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastList([broadcastMessage.trim(), ...broadcastList]);
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5ede4] text-[#1e1b17] pb-32 pt-2 px-3 md:px-6 max-w-xl mx-auto space-y-4">
      {/* 1. Top Seva Officer Profile Header */}
      <div className="bg-[#fffcf9] rounded-[24px] p-5 shadow-[0px_4px_16px_rgba(26,35,126,0.06)] border border-[#e8d5c4]/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#9c3f00] shadow-md shrink-0">
              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-[#1e1b17]">{user.fullName || 'Seva Officer'}</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#ffdbcb] text-[#9c3f00] border border-[#9c3f00]/30">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#584237] mt-0.5">{campData.name} • {campData.locationName}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="p-2 rounded-full bg-[#f4ede5] text-[#9c3f00] hover:bg-[#ffdbcb] transition-colors"
            title="Switch Role or Profile"
          >
            <span className="material-symbols-outlined text-lg">swap_horiz</span>
          </button>
        </div>
      </div>

      {/* 2. Primary KPI: Pilgrims Helped Today (Interactive Counter) */}
      <div className="bg-gradient-to-br from-[#9c3f00] to-[#7a3000] text-white rounded-[28px] p-6 shadow-xl relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
          <span className="material-symbols-outlined text-[140px]">volunteer_activism</span>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                {t.pilgrimsHelpedToday}
              </p>
              <h3 className="text-4xl md:text-5xl font-black mt-1 tracking-tight">
                {helpedCount.toLocaleString()}
              </h3>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#84e380] animate-pulse" />
              <span>Live Seva</span>
            </div>
          </div>

          <p className="text-xs text-white/85">
            Logging meals, clean water distribution, first aid care, and guidance along the wari corridor.
          </p>

          {/* Quick Increment Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleIncrementHelped(1)}
              className="flex-1 py-2 bg-white text-[#9c3f00] rounded-xl text-xs font-extrabold shadow-md hover:bg-[#fff8f1] active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>+1 Pilgrim</span>
            </button>
            <button
              onClick={() => handleIncrementHelped(10)}
              className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-extrabold border border-white/40 active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">group_add</span>
              <span>+10 Batch</span>
            </button>
            <button
              onClick={() => handleIncrementHelped(50)}
              className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-extrabold border border-white/40 active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">diversity_1</span>
              <span>+50 Dindi</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Quick Portal Links: Camp Operations & SOS Monitor */}
      <div className="grid grid-cols-2 gap-3">
        {/* Camp Operations Card */}
        <div
          onClick={() => onNavigateTab('camp')}
          className="bg-[#fffcf9] rounded-[24px] p-4.5 border border-[#e8d5c4] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#ffdbcb] text-[#9c3f00] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-xl filled">tune</span>
            </div>
            <h3 className="text-sm font-extrabold text-[#1e1b17]">Camp Operations</h3>
            <p className="text-[11px] text-[#584237] mt-0.5">
              Status: <span className="font-bold text-[#9c3f00] uppercase">{campData.status}</span>
            </p>
            <p className="text-[11px] text-[#584237]">
              Crowd: <span className="font-bold">{campData.crowdLevel}</span>
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-[#e0c0b2]/40 flex items-center justify-between text-xs font-bold text-[#9c3f00]">
            <span>Edit Offerings</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </div>

        {/* SOS Live Monitor Card */}
        <div
          onClick={() => onNavigateTab('sos_monitor')}
          className="bg-[#fffcf9] rounded-[24px] p-4.5 border border-[#ffb4ab] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-3 relative">
              <span className="material-symbols-outlined text-xl filled">emergency</span>
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {activeAlerts.length}
                </span>
              )}
            </div>
            <h3 className="text-sm font-extrabold text-[#1e1b17]">SOS Monitor</h3>
            <p className="text-[11px] text-[#ba1a1a] font-bold mt-0.5">
              {activeAlerts.length} Unassigned SOS
            </p>
            <p className="text-[11px] text-[#584237]">
              {inProgressAlerts.length} In Progress
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-[#ffb4ab]/40 flex items-center justify-between text-xs font-bold text-[#ba1a1a]">
            <span>Monitor Queue</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* 4. Active Emergency Triage Brief Widget */}
      {activeAlerts.length > 0 && (
        <div className="bg-[#fffcf9] rounded-[24px] p-5 border border-[#ffb4ab] shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-xl filled">notification_important</span>
              <h3 className="text-sm font-extrabold text-[#1e1b17]">Urgent Pilgrim Alert</h3>
            </div>
            <button
              onClick={() => onNavigateTab('sos_monitor')}
              className="text-xs font-bold text-[#ba1a1a] hover:underline"
            >
              View All ({activeAlerts.length})
            </button>
          </div>

          <div className="bg-[#ffdad6]/40 p-3.5 rounded-2xl border border-[#ffb4ab]/60 space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-bold text-[#93000a]">{activeAlerts[0].title}</h4>
              <span className="text-[10px] font-bold text-[#584237]">{activeAlerts[0].timeAgo}</span>
            </div>
            <p className="text-xs text-[#584237]">{activeAlerts[0].description}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-bold text-[#1e1b17] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#9c3f00] filled">location_on</span>
                <span>{activeAlerts[0].distanceText}</span>
              </span>
              <button
                onClick={() => onNavigateTab('sos_monitor')}
                className="px-3 py-1 bg-[#9c3f00] hover:bg-[#7a3000] text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Respond
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Seva Broadcast Announcements Widget */}
      <div className="bg-[#fffcf9] rounded-[24px] p-5 border border-[#e8d5c4] shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9c3f00] text-xl filled">campaign</span>
            <h3 className="text-sm font-extrabold text-[#1e1b17]">Camp Announcements</h3>
          </div>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="text-xs font-bold text-[#9c3f00] hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Broadcast</span>
          </button>
        </div>

        <div className="space-y-2">
          {broadcastList.map((msg, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#fbf4eb] rounded-xl border border-[#e0c0b2]/50 text-xs text-[#1e1b17] flex items-start gap-2.5"
            >
              <span className="material-symbols-outlined text-base text-[#9c3f00] shrink-0 mt-0.5">
                record_voice_over
              </span>
              <p className="leading-relaxed">{msg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#e0c0b2] shadow-2xl">
            <h3 className="text-lg font-bold text-[#1e1b17] mb-2">Send Camp Broadcast</h3>
            <p className="text-xs text-[#584237] mb-3">
              Announce fresh food batches, water availability, or medical slots to nearby pilgrims.
            </p>
            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <textarea
                required
                rows={3}
                placeholder="e.g. Fresh Mahaprasad being served at Camp 4..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full bg-[#f9f3eb] border border-[#e0c0b2] rounded-xl p-3 text-xs text-[#1e1b17] outline-none font-medium resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#9c3f00] text-white text-xs font-bold shadow-md"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
