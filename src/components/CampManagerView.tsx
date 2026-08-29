import React, { useState } from 'react';
import { CampData, AppLanguage, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface CampManagerViewProps {
  campData: CampData;
  onUpdateCampData: (updated: CampData) => void;
  language: AppLanguage;
  user: UserProfile;
}

export const CampManagerView: React.FC<CampManagerViewProps> = ({
  campData,
  onUpdateCampData,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [status, setStatus] = useState<'available' | 'busy' | 'closed'>(campData.status);
  const [openingTime, setOpeningTime] = useState(campData.openingTime);
  const [closingTime, setClosingTime] = useState(campData.closingTime);
  const [offerings, setOfferings] = useState(campData.offerings);
  const [crowdLevel, setCrowdLevel] = useState<'low' | 'moderate' | 'high'>(campData.crowdLevel);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [newOfferingTitle, setNewOfferingTitle] = useState('');
  const [newOfferingSubtitle, setNewOfferingSubtitle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleOffering = (id: string) => {
    const updated = offerings.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    setOfferings(updated);
    onUpdateCampData({
      ...campData,
      status,
      openingTime,
      closingTime,
      offerings: updated,
      crowdLevel,
    });
  };

  const handleStatusChange = (newStatus: 'available' | 'busy' | 'closed') => {
    setStatus(newStatus);
    onUpdateCampData({
      ...campData,
      status: newStatus,
      openingTime,
      closingTime,
      offerings,
      crowdLevel,
    });
    triggerToast();
  };

  const handleCrowdChange = (newCrowd: 'low' | 'moderate' | 'high') => {
    setCrowdLevel(newCrowd);
    onUpdateCampData({
      ...campData,
      status,
      openingTime,
      closingTime,
      offerings,
      crowdLevel: newCrowd,
    });
    triggerToast();
  };

  const handleSaveAll = () => {
    onUpdateCampData({
      ...campData,
      status,
      openingTime,
      closingTime,
      offerings,
      crowdLevel,
    });
    triggerToast();
  };

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleAddOffering = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferingTitle.trim()) return;
    const newOffer = {
      id: `custom-${Date.now()}`,
      title: newOfferingTitle.trim(),
      subtitle: newOfferingSubtitle.trim() || 'Available now for pilgrims',
      icon: 'stars',
      enabled: true,
    };
    const updated = [...offerings, newOffer];
    setOfferings(updated);
    onUpdateCampData({
      ...campData,
      offerings: updated,
    });
    setNewOfferingTitle('');
    setNewOfferingSubtitle('');
    setShowAddModal(false);
    triggerToast();
  };

  return (
    <div className="w-full min-h-screen bg-[#f5ede4] text-[#1e1b17] pb-32 pt-2 px-3 md:px-6 max-w-xl mx-auto space-y-4">
      {/* Toast feedback */}
      {showSavedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1e1b17] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce border border-[#9c3f00]">
          <span className="material-symbols-outlined text-base text-[#84e380]">check_circle</span>
          <span>Camp Status & Offerings Live Updated!</span>
        </div>
      )}

      {/* 1. Top Card: Camp Profile & Status Selector (Matches Screenshot 1) */}
      <div className="bg-[#fffcf9] rounded-[24px] p-5 shadow-[0px_4px_16px_rgba(26,35,126,0.06)] border border-[#e8d5c4]/80 space-y-4">
        {/* Camp Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-full bg-[#9c3f00] text-white flex items-center justify-center p-3 shadow-md shrink-0">
            <span className="material-symbols-outlined text-2xl filled">restaurant</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1e1b17] leading-tight tracking-tight">
              {campData.name}
            </h2>
            <div className="flex items-center gap-1 text-xs font-bold text-[#9c3f00] mt-0.5">
              <span className="material-symbols-outlined text-sm filled text-[#9c3f00]">location_on</span>
              <span>{campData.locationName}</span>
            </div>
          </div>
        </div>

        {/* Camp Status Section */}
        <div>
          <label className="block text-xs font-bold text-[#584237] mb-2">Camp Status</label>
          <div className="grid grid-cols-3 gap-2 bg-[#f4ede5] p-1.5 rounded-2xl border border-[#e0c0b2]/50">
            {/* Available */}
            <button
              type="button"
              onClick={() => handleStatusChange('available')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                status === 'available'
                  ? 'bg-[#15803d] text-white shadow-md'
                  : 'text-[#584237] hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-sm filled">
                {status === 'available' ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span>Available</span>
            </button>

            {/* Busy */}
            <button
              type="button"
              onClick={() => handleStatusChange('busy')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                status === 'busy'
                  ? 'bg-[#9c3f00] text-white shadow-md'
                  : 'text-[#584237] hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-sm">hourglass_empty</span>
              <span>Busy</span>
            </button>

            {/* Closed */}
            <button
              type="button"
              onClick={() => handleStatusChange('closed')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                status === 'closed'
                  ? 'bg-[#ba1a1a] text-white shadow-md'
                  : 'text-[#584237] hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-sm">block</span>
              <span>Closed</span>
            </button>
          </div>
        </div>

        {/* Timings */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-[#584237] mb-1.5">Opening Time</label>
            <div className="relative flex items-center bg-[#fff8f1] rounded-xl border border-[#e0c0b2] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#9c3f00]">
              <span className="material-symbols-outlined text-[#584237] text-lg mr-2">schedule</span>
              <input
                type="text"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                placeholder="06:00 AM"
                className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#1e1b17]"
              />
              <span className="material-symbols-outlined text-[#584237]/60 text-lg">query_builder</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#584237] mb-1.5">Closing Time</label>
            <div className="relative flex items-center bg-[#fff8f1] rounded-xl border border-[#e0c0b2] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#9c3f00]">
              <span className="material-symbols-outlined text-[#584237] text-lg mr-2">schedule</span>
              <input
                type="text"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                placeholder="10:00 PM"
                className="w-full bg-transparent border-none outline-none text-sm font-bold text-[#1e1b17]"
              />
              <span className="material-symbols-outlined text-[#584237]/60 text-lg">query_builder</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Card: Current Offerings with Working Toggle Switches (Matches Screenshot 1) */}
      <div className="bg-[#fffcf9] rounded-[24px] p-5 shadow-[0px_4px_16px_rgba(26,35,126,0.06)] border border-[#e8d5c4]/80 space-y-3.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9c3f00] text-xl filled">restaurant_menu</span>
            <h3 className="text-base font-extrabold text-[#1e1b17]">Current Offerings</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold text-[#9c3f00] hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Offering</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {offerings.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleOffering(item.id)}
              className={`p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                item.enabled
                  ? 'bg-[#fbf4eb] border-[#e0c0b2]/80 shadow-sm'
                  : 'bg-[#f4ede5]/60 border-[#e0c0b2]/30 opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    item.enabled ? 'bg-[#ffdbcb] text-[#9c3f00]' : 'bg-[#dfd9d1] text-[#584237]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl filled">{item.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1e1b17] leading-tight">{item.title}</h4>
                  <p className="text-xs text-[#584237] mt-0.5">{item.subtitle}</p>
                </div>
              </div>

              {/* Working Toggle Switch */}
              <div
                className={`w-12 h-6.5 rounded-full p-0.5 flex items-center transition-colors duration-200 ${
                  item.enabled ? 'bg-[#9c3f00]' : 'bg-[#c9bfb5]'
                }`}
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center ${
                    item.enabled ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                >
                  {item.enabled && (
                    <span className="material-symbols-outlined text-xs text-[#9c3f00] font-bold">
                      check
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Card: Crowd Density Reporting (Matches Screenshot 1) */}
      <div className="bg-[#fffcf9] rounded-[24px] p-5 shadow-[0px_4px_16px_rgba(26,35,126,0.06)] border border-[#e8d5c4]/80 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#9c3f00] text-xl filled">groups</span>
          <h3 className="text-base font-extrabold text-[#1e1b17]">Crowd Density Reporting</h3>
        </div>

        <p className="text-xs text-[#584237] leading-relaxed">
          Update the current crowd level to help guide pilgrims effectively.
        </p>

        <div className="space-y-2.5">
          {/* Low */}
          <button
            type="button"
            onClick={() => handleCrowdChange('low')}
            className={`w-full p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center active:scale-[0.99] ${
              crowdLevel === 'low'
                ? 'bg-[#15803d] text-white border-[#15803d] shadow-md'
                : 'bg-[#fff8f1] hover:bg-[#f4ede5] border-[#e0c0b2]/60 text-[#1e1b17]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl mb-1 ${
                crowdLevel === 'low' ? 'text-white filled' : 'text-[#15803d] filled'
              }`}
            >
              person
            </span>
            <span className="text-sm font-extrabold">Low</span>
            <span
              className={`text-xs mt-0.5 ${
                crowdLevel === 'low' ? 'text-white/85' : 'text-[#584237]'
              }`}
            >
              &lt; 50 People
            </span>
          </button>

          {/* Moderate */}
          <button
            type="button"
            onClick={() => handleCrowdChange('moderate')}
            className={`w-full p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center active:scale-[0.99] ${
              crowdLevel === 'moderate'
                ? 'bg-[#9c3f00] text-white border-[#9c3f00] shadow-md'
                : 'bg-[#fff8f1] hover:bg-[#f4ede5] border-[#e0c0b2]/60 text-[#1e1b17]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl mb-1 ${
                crowdLevel === 'moderate' ? 'text-white filled' : 'text-[#c35100] filled'
              }`}
            >
              group
            </span>
            <span className="text-sm font-extrabold">Moderate</span>
            <span
              className={`text-xs mt-0.5 ${
                crowdLevel === 'moderate' ? 'text-white/85' : 'text-[#584237]'
              }`}
            >
              50 - 200 People
            </span>
          </button>

          {/* High */}
          <button
            type="button"
            onClick={() => handleCrowdChange('high')}
            className={`w-full p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center active:scale-[0.99] ${
              crowdLevel === 'high'
                ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-md'
                : 'bg-[#fff8f1] hover:bg-[#f4ede5] border-[#e0c0b2]/60 text-[#1e1b17]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl mb-1 ${
                crowdLevel === 'high' ? 'text-white filled' : 'text-[#ba1a1a] filled'
              }`}
            >
              groups
            </span>
            <span className="text-sm font-extrabold">High</span>
            <span
              className={`text-xs mt-0.5 ${
                crowdLevel === 'high' ? 'text-white/85' : 'text-[#584237]'
              }`}
            >
              200+ People
            </span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSaveAll}
          className="w-full bg-[#9c3f00] hover:bg-[#7a3000] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#9c3f00]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-sm"
        >
          <span className="material-symbols-outlined text-xl">cloud_sync</span>
          <span>Broadcast & Save Live Updates</span>
        </button>
      </div>

      {/* Add Custom Offering Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#e0c0b2] shadow-2xl">
            <h3 className="text-lg font-bold text-[#1e1b17] mb-3">Add Camp Offering</h3>
            <form onSubmit={handleAddOffering} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#584237] block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Foot Massage / ORS"
                  value={newOfferingTitle}
                  onChange={(e) => setNewOfferingTitle(e.target.value)}
                  className="w-full bg-[#f9f3eb] border border-[#e0c0b2] rounded-xl p-2.5 text-xs text-[#1e1b17] outline-none font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#584237] block mb-1">Details / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Available 2 PM - 6 PM"
                  value={newOfferingSubtitle}
                  onChange={(e) => setNewOfferingSubtitle(e.target.value)}
                  className="w-full bg-[#f9f3eb] border border-[#e0c0b2] rounded-xl p-2.5 text-xs text-[#1e1b17] outline-none font-medium"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#9c3f00] text-white text-xs font-bold shadow-md"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
