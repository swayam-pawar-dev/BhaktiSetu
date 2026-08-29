import React, { useState } from 'react';
import { DindiPost, VerifiedVolunteer, AppLanguage } from '../types';
import { DINDI_COMMUNITY_POSTS, VERIFIED_VOLUNTEERS, TRANSLATIONS } from '../data/mockData';

interface ConnectViewProps {
  language: AppLanguage;
}

export const ConnectView: React.FC<ConnectViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'volunteers' | 'community'>('volunteers');
  const [volunteers] = useState<VerifiedVolunteer[]>(VERIFIED_VOLUNTEERS);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VerifiedVolunteer | null>(volunteers[0]);
  const [volunteerCategory, setVolunteerCategory] = useState<'all' | 'medical' | 'water_food' | 'lost_found' | 'route_guide' | 'mobility'>('all');
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [posts, setPosts] = useState<DindiPost[]>(DINDI_COMMUNITY_POSTS);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [taskNotice, setTaskNotice] = useState<string | null>(null);

  const handleRequestVolunteer = (volunteer: VerifiedVolunteer) => {
    const volName =
      language === 'mr' && volunteer.marathiName
        ? volunteer.marathiName
        : language === 'hi' && volunteer.hindiName
        ? volunteer.hindiName
        : volunteer.name;

    setTaskNotice(
      `${t.requestAssistanceSuccess || 'Assistance request and live GPS location sent to'} ${volName}!`
    );
    setTimeout(() => setTaskNotice(null), 4000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: DindiPost = {
      id: `post-${Date.now()}`,
      author: 'Swayam Pawar',
      dindiNumber: 'Dindi #24 (Pune)',
      timeAgo: 'Just now',
      content: newPostText.trim(),
      tag: 'Volunteer Seva',
      likes: 1,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setShowNewPostModal(false);
  };

  const filteredVolunteers = volunteers.filter((vol) => {
    const matchesCategory =
      volunteerCategory === 'all' || vol.category === volunteerCategory;
    const q = volunteerSearch.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      vol.name.toLowerCase().includes(q) ||
      (vol.marathiName && vol.marathiName.toLowerCase().includes(q)) ||
      (vol.hindiName && vol.hindiName.toLowerCase().includes(q)) ||
      vol.roleTitle.toLowerCase().includes(q) ||
      vol.volunteerId.toLowerCase().includes(q) ||
      vol.locationText.toLowerCase().includes(q) ||
      vol.currentSector.toLowerCase().includes(q) ||
      vol.specialties.some((s) => s.toLowerCase().includes(q)) ||
      vol.languages.some((l) => l.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fff8f1] px-3 sm:px-4 md:px-8 py-5 pb-28 max-w-5xl mx-auto space-y-5 w-full overflow-x-hidden box-border">
      {/* Toast feedback notice */}
      {taskNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#006b1b] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce border border-white max-w-[90vw] text-center">
          <span className="material-symbols-outlined text-sm shrink-0">verified</span>
          <span className="truncate">{taskNotice}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#9c3f00] tracking-tight truncate">
            {t.communityTitle || 'Community & Volunteer Network'}
          </h1>
          <p className="text-xs md:text-sm text-[#584237] mt-1 line-clamp-2">
            {t.communitySubtitle || 'Connect directly with verified on-route volunteers and share Dindi updates.'}
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="bg-[#9c3f00] hover:bg-[#7a3000] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95 transition-all shrink-0 self-end sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">edit</span>
          <span>{t.postUpdate || 'Post Update'}</span>
        </button>
      </div>

      {/* View Switcher Tabs: 2 Sections: Verified Volunteers | Dindi Feed */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#f4ede5] p-1 border border-[#e0c0b2]/50 w-full max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center ${
            activeTab === 'volunteers'
              ? 'bg-[#9c3f00] text-white shadow-xs'
              : 'text-[#584237] hover:text-[#9c3f00]'
          }`}
        >
          <span className="material-symbols-outlined text-base sm:text-lg leading-none shrink-0">verified_user</span>
          <span className="text-xs sm:text-sm font-bold leading-tight truncate">
            {t.connectVolunteers || 'Verified Volunteers'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center ${
            activeTab === 'community'
              ? 'bg-[#9c3f00] text-white shadow-xs'
              : 'text-[#584237] hover:text-[#9c3f00]'
          }`}
        >
          <span className="material-symbols-outlined text-base sm:text-lg leading-none shrink-0">forum</span>
          <span className="text-xs sm:text-sm font-bold leading-tight truncate">
            {t.dindiFeed || 'Dindi Group Feed'}
          </span>
        </button>
      </div>

      {/* TAB 1: CONNECT TO VERIFIED VOLUNTEERS */}
      {activeTab === 'volunteers' && (
        <div className="space-y-4">
          {/* Volunteer Search & Category Filter Controls */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e0c0b2]/60 shadow-xs space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7166] text-lg">
                search
              </span>
              <input
                type="text"
                value={volunteerSearch}
                onChange={(e) => setVolunteerSearch(e.target.value)}
                placeholder={t.searchVolunteers || 'Search by name, role, sector, language...'}
                className="w-full pl-9 pr-8 py-2 bg-[#fff8f1] border border-[#e0c0b2] rounded-xl text-xs sm:text-sm text-[#1e1b17] placeholder:text-[#8c7166] focus:outline-none focus:border-[#9c3f00]"
              />
              {volunteerSearch && (
                <button
                  onClick={() => setVolunteerSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c7166] hover:text-[#1e1b17] p-0.5"
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {[
                { id: 'all', label: t.allVolunteers || 'All', icon: 'groups' },
                { id: 'medical', label: t.filterMedical || 'Medical', icon: 'medical_services' },
                { id: 'water_food', label: t.filterFoodWater || 'Food & Water', icon: 'restaurant' },
                { id: 'lost_found', label: t.filterLostFound || 'Lost & Found', icon: 'person_search' },
                { id: 'route_guide', label: t.filterRouteGuide || 'Route & Safety', icon: 'alt_route' },
                { id: 'mobility', label: t.filterMobility || 'Elderly Mobility', icon: 'accessible' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setVolunteerCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all text-xs shrink-0 ${
                    volunteerCategory === cat.id
                      ? 'bg-[#9c3f00] text-white shadow-xs'
                      : 'bg-[#f4ede5] text-[#584237] hover:bg-[#e0c0b2]/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Layout: Volunteer List + Selected Volunteer Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Volunteer Directory List */}
            <div className="lg:col-span-5 space-y-3 min-w-0">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-[#584237] uppercase tracking-wider">
                  {t.verifiedVolunteersTitle || 'Verified Volunteer Network'}
                </h3>
                <span className="text-[11px] font-semibold text-[#8c7166]">
                  {filteredVolunteers.length} {language === 'mr' ? 'उपलब्ध' : language === 'hi' ? 'उपलब्ध' : 'Available'}
                </span>
              </div>

              {filteredVolunteers.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-[#584237] border border-[#e0c0b2]">
                  <span className="material-symbols-outlined text-3xl text-[#8c7166] mb-1">person_off</span>
                  <p className="text-xs font-semibold">{t.noNotifications || 'No volunteers match this filter.'}</p>
                  <button
                    onClick={() => {
                      setVolunteerCategory('all');
                      setVolunteerSearch('');
                    }}
                    className="mt-2 text-xs text-[#9c3f00] font-bold underline"
                  >
                    {t.allVolunteers || 'Show All Volunteers'}
                  </button>
                </div>
              ) : (
                filteredVolunteers.map((volunteer) => {
                  const isSelected = selectedVolunteer?.id === volunteer.id;
                  const displayName =
                    language === 'mr' && volunteer.marathiName
                      ? volunteer.marathiName
                      : language === 'hi' && volunteer.hindiName
                      ? volunteer.hindiName
                      : volunteer.name;

                  const displayRole =
                    language === 'mr' && volunteer.roleTitleMr
                      ? volunteer.roleTitleMr
                      : language === 'hi' && volunteer.roleTitleHi
                      ? volunteer.roleTitleHi
                      : volunteer.roleTitle;

                  return (
                    <div
                      key={volunteer.id}
                      onClick={() => setSelectedVolunteer(volunteer)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#9c3f00] bg-white shadow-md ring-2 ring-[#9c3f00]/20'
                          : 'border-[#e0c0b2]/60 bg-white hover:bg-[#f9f3eb]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={volunteer.avatarUrl}
                            alt={displayName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#ffdbcb]"
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#006b1b] border-2 border-white rounded-full"></span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className="text-xs sm:text-sm font-bold text-[#1e1b17] truncate flex items-center gap-1">
                              <span>{displayName}</span>
                              <span className="material-symbols-outlined text-xs text-[#006b1b] filled shrink-0">
                                verified
                              </span>
                            </h4>
                            <span className="text-[10px] font-bold text-[#9c3f00] bg-[#ffdbcb]/60 px-1.5 py-0.5 rounded-md shrink-0">
                              {volunteer.volunteerId}
                            </span>
                          </div>

                          <p className="text-[11px] font-semibold text-[#7c3000] truncate">
                            {displayRole}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#584237]">
                            <span className="material-symbols-outlined text-xs text-[#9c3f00]">near_me</span>
                            <span className="font-semibold truncate">{volunteer.currentSector}</span>
                            <span className="text-[#8c7166] shrink-0">({volunteer.distanceText})</span>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#eee7df] text-[11px]">
                            <span className="text-[#006b1b] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#006b1b]"></span>
                              {volunteer.status === 'available'
                                ? t.availableStatus || 'Available on Duty'
                                : t.onDutyStatus || 'Active on Route'}
                            </span>

                            <span className="text-[#9c3f00] font-bold flex items-center gap-0.5">
                              <span>{t.tapToRead || 'View Profile'}</span>
                              <span className="material-symbols-outlined text-xs">chevron_right</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Selected Volunteer Detailed Profile Card */}
            <div className="lg:col-span-7 min-w-0">
              {selectedVolunteer ? (
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0px_4px_16px_rgba(26,35,126,0.08)] border border-[#e0c0b2]/60 space-y-4 animate-fadeIn">
                  {/* Volunteer Profile Header */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={selectedVolunteer.avatarUrl}
                        alt={selectedVolunteer.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-3 border-[#ffdbcb] shadow-sm"
                      />
                      <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#006b1b] border-2 border-white rounded-full"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-bold text-[#1e1b17] truncate">
                          {language === 'mr' && selectedVolunteer.marathiName
                            ? selectedVolunteer.marathiName
                            : language === 'hi' && selectedVolunteer.hindiName
                            ? selectedVolunteer.hindiName
                            : selectedVolunteer.name}
                        </h2>
                        <span className="bg-[#94f990]/40 text-[#006b1b] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                          <span className="material-symbols-outlined text-xs filled">verified</span>
                          {t.volunteerBadge || 'Verified Volunteer'}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-[#9c3f00] mt-0.5">
                        {language === 'mr' && selectedVolunteer.roleTitleMr
                          ? selectedVolunteer.roleTitleMr
                          : language === 'hi' && selectedVolunteer.roleTitleHi
                          ? selectedVolunteer.roleTitleHi
                          : selectedVolunteer.roleTitle}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs">
                        <span className="bg-[#f4ede5] text-[#584237] text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#e0c0b2]/50">
                          {t.volunteerIdLabel || 'ID'}: {selectedVolunteer.volunteerId}
                        </span>
                        <span className="text-[#006b1b] font-bold flex items-center gap-1 text-[11px]">
                          ⭐ {selectedVolunteer.rating} • {selectedVolunteer.pilgrimsHelped}+ {t.pilgrimsHelpedCount || 'Helped'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Direct Call & Contact Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <a
                      href={`tel:${selectedVolunteer.phone}`}
                      className="bg-[#9c3f00] hover:bg-[#7a3000] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-xs sm:text-sm text-center"
                    >
                      <span className="material-symbols-outlined text-lg filled">call</span>
                      <span className="truncate">{t.callVolunteer || 'Call Verified Volunteer'}</span>
                    </a>

                    <button
                      onClick={() => handleRequestVolunteer(selectedVolunteer)}
                      className="bg-[#006b1b] hover:bg-[#1e862d] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-xs sm:text-sm text-center"
                    >
                      <span className="material-symbols-outlined text-lg">share_location</span>
                      <span className="truncate">{t.requestAssistanceBtn || 'Send GPS / Request Seva'}</span>
                    </button>
                  </div>

                  {/* Duty Station & Distance Box */}
                  <div className="bg-[#fff8f1] rounded-2xl p-3.5 sm:p-4 border border-[#e0c0b2]/60 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#9c3f00] uppercase tracking-wider">
                        {t.dutyLocation || 'Current Duty Location'}
                      </span>
                      <span className="text-xs font-bold text-[#006b1b] bg-[#94f990]/30 px-2 py-0.5 rounded-full">
                        {selectedVolunteer.distanceText}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-[#1e1b17] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#9c3f00] text-sm">location_on</span>
                      <span>{selectedVolunteer.locationText}</span>
                    </p>

                    {selectedVolunteer.dindiAffiliation && (
                      <p className="text-xs text-[#584237]">
                        <span className="font-semibold text-[#8c7166]">{t.dindiAffiliation || 'Affiliation'}: </span>
                        {selectedVolunteer.dindiAffiliation}
                      </p>
                    )}
                  </div>

                  {/* Seva Bio / Description */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#584237] uppercase tracking-wider">
                      {language === 'mr' ? 'सेवा परिचय' : language === 'hi' ? 'सेवा परिचय' : 'About Seva'}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#1e1b17] leading-relaxed">
                      {language === 'mr' && selectedVolunteer.aboutMr
                        ? selectedVolunteer.aboutMr
                        : language === 'hi' && selectedVolunteer.aboutHi
                        ? selectedVolunteer.aboutHi
                        : selectedVolunteer.about}
                    </p>
                  </div>

                  {/* Specialties & Services Offered */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#584237] uppercase tracking-wider">
                      {t.specialtiesLabel || 'Specialties & Services'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {selectedVolunteer.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-[#f4ede5] text-[#584237] text-xs font-semibold px-2.5 py-1 rounded-xl border border-[#e0c0b2]/50 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs text-[#006b1b] filled">check</span>
                          <span>{spec}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages Spoken */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#584237] uppercase tracking-wider">
                      {t.languagesLabel || 'Languages Spoken'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVolunteer.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="bg-[#fff8f1] text-[#9c3f00] text-xs font-bold px-2.5 py-0.5 rounded-lg border border-[#ffdbcb]"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Map Snapshot of Volunteer Station */}
                  <div className="space-y-1.5">
                    <div className="rounded-2xl overflow-hidden border border-[#e0c0b2] bg-[#f9f3eb] relative">
                      <img
                        src={selectedVolunteer.mapImage}
                        alt="Volunteer Duty Map"
                        className="w-full h-28 sm:h-32 object-cover opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <div className="text-white text-xs flex justify-between items-center w-full">
                          <p className="font-bold flex items-center gap-1 truncate">
                            <span className="material-symbols-outlined text-sm text-[#ffb693]">pin_drop</span>
                            <span>{selectedVolunteer.currentSector}</span>
                          </p>
                          <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            GPS Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center text-[#584237] border border-[#e0c0b2]/60">
                  <span className="material-symbols-outlined text-4xl text-[#8c7166] mb-2">
                    verified_user
                  </span>
                  <p className="text-xs sm:text-sm font-semibold">
                    {t.tapToRead || 'Select a verified volunteer to view full profile & call'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY DINDI FEED */}
      {activeTab === 'community' && (
        <div className="space-y-3.5 max-w-2xl mx-auto min-w-0">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e0c0b2]/50 shadow-xs space-y-2.5 min-w-0"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ffdbcb] text-[#9c3f00] flex items-center justify-center font-bold text-sm shrink-0">
                    {post.author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1e1b17] truncate">{post.author}</h4>
                    <p className="text-[10px] sm:text-[11px] text-[#584237] truncate">
                      {post.dindiNumber} • {post.timeAgo}
                    </p>
                  </div>
                </div>

                {post.tag && (
                  <span className="text-[10px] font-bold bg-[#f4ede5] text-[#9c3f00] px-2.5 py-0.5 rounded-full border border-[#e0c0b2]/40 shrink-0">
                    {post.tag}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#1e1b17] leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#eee7df] text-xs text-[#584237]">
                <button
                  onClick={() => {
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                      )
                    );
                  }}
                  className="flex items-center gap-1.5 text-[#9c3f00] font-semibold hover:bg-[#ffdbcb]/30 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm filled">favorite</span>
                  <span>{post.likes} {t.jaiHari || 'Jai Hari'}</span>
                </button>

                <button
                  onClick={() => {
                    setTaskNotice(t.copiedToClipboard || 'Response shared!');
                    setTimeout(() => setTaskNotice(null), 2500);
                  }}
                  className="flex items-center gap-1 text-[#584237] hover:text-[#9c3f00] font-medium px-2 py-1 rounded-lg hover:bg-[#f4ede5]"
                >
                  <span className="material-symbols-outlined text-sm">reply</span>
                  <span>{t.share || 'Respond'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-[#e0c0b2] space-y-4">
            <div className="flex justify-between items-center border-b border-[#eee7df] pb-3">
              <h3 className="text-sm sm:text-base font-bold text-[#9c3f00]">{t.postModalTitle || 'Share with Dindi & Volunteers'}</h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-1 rounded-full bg-[#eee7df] text-[#584237]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                required
                rows={4}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={t.postMessagePlaceholder || 'Share food seva updates, water tanker locations, road advice, or ask for help...'}
                className="w-full p-3 bg-[#fff8f1] border border-[#e0c0b2] rounded-2xl text-xs sm:text-sm outline-none focus:border-[#9c3f00]"
              />

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e0c0b2] text-xs font-bold text-[#584237]"
                >
                  {t.cancel || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#9c3f00] hover:bg-[#7a3000] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {t.submitPost || 'Post Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
