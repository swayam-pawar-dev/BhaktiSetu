import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { getArticlesByLanguage, TRANSLATIONS } from '../data/mockData';
import { spiritualAudio } from '../utils/audioSynth';

interface GuideViewProps {
  language: AppLanguage;
  selectedArticleId: string | null;
  onSelectArticle: (id: string | null) => void;
}

export const GuideView: React.FC<GuideViewProps> = ({
  language,
  selectedArticleId,
  onSelectArticle,
}) => {
  const t = TRANSLATIONS[language];
  const articles = getArticlesByLanguage(language);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['padukas-significance']);

  const categoriesByLang: Record<AppLanguage, string[]> = {
    mr: ['सर्व', 'परंपरा', 'संत परंपरा', 'सजग चालणे', 'इतिहास', 'वारकरी अनुभव'],
    hi: ['सभी', 'परंपराएं', 'संत परंपरा', 'सजग पदयात्रा', 'इतिहास', 'यात्री अनुभव'],
    en: ['All', 'Traditions', 'Spiritual Masters', 'Mindful Walking', 'History', 'Pilgrim Stories', 'Saints']
  };

  const categories = categoriesByLang[language] || categoriesByLang.en;
  const activeCategory = categories[activeCategoryIndex] || categories[0];

  const filteredArticles = articles.filter((art) => {
    const isAll = activeCategoryIndex === 0;
    const matchesCategory = isAll || art.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentArticle = selectedArticleId
    ? articles.find((a) => a.id === selectedArticleId) || articles[0]
    : null;

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      spiritualAudio.stop();
      setIsPlayingAudio(false);
    } else {
      spiritualAudio.playPasayadanTone(() => setIsPlayingAudio(false));
      setIsPlayingAudio(true);
    }
  };

  // -------------------------------------------------------------
  // Full Article Reader View (Screenshots 2, 4, 6, 8, 10, 12, etc.)
  // -------------------------------------------------------------
  if (currentArticle) {
    const isBookmarked = bookmarkedIds.includes(currentArticle.id);

    return (
      <article className="min-h-screen bg-[#fff8f1] pb-28">
        {/* Hero Image Section with back & bookmark overlays */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-[#e8e1da]">
          <img
            src={currentArticle.heroImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <button
              onClick={() => {
                spiritualAudio.stop();
                setIsPlayingAudio(false);
                onSelectArticle(null);
              }}
              aria-label={t.backToGuide || "Back to guide"}
              className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 backdrop-blur-sm transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => toggleBookmark(currentArticle.id)}
                aria-label="Bookmark"
                className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 backdrop-blur-sm transition-transform active:scale-90"
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  bookmark
                </span>
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: currentArticle.title,
                      text: currentArticle.summary,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    alert(t.copiedToClipboard || 'Article link copied to clipboard!');
                  }
                }}
                aria-label={t.share || "Share article"}
                className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 backdrop-blur-sm transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
            </div>
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#9c3f00] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {currentArticle.category}
              </span>
              <span className="text-xs text-[#ffdbcb] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {currentArticle.readTime}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold leading-tight drop-shadow-md">
              {currentArticle.title}
            </h1>
          </div>
        </div>

        {/* Article Body Content */}
        <main className="max-w-2xl mx-auto px-5 py-6 space-y-6">
          {/* Subtitle / intro */}
          {currentArticle.subtitle && (
            <p className="text-base md:text-lg font-medium text-[#9c3f00] italic border-l-4 border-[#9c3f00] pl-3 py-0.5">
              {currentArticle.subtitle}
            </p>
          )}

          {/* Audio Chanting Card (Screenshots 2 & 4 - Pasayadan Audio) */}
          {currentArticle.audio && (
            <div className="bg-[#ffdbcb]/60 border border-[#9c3f00]/30 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  aria-label="Play audio"
                  className="w-12 h-12 rounded-full bg-[#9c3f00] hover:bg-[#7a3000] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
                >
                  <span className="material-symbols-outlined text-2xl filled">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div>
                  <h4 className="text-sm font-bold text-[#1e1b17]">{currentArticle.audio.title}</h4>
                  <p className="text-xs text-[#584237]">
                    {isPlayingAudio ? (t.playingDrone || 'Playing meditative drone...') : currentArticle.audio.duration}
                  </p>
                </div>
              </div>

              {/* Animated sound wave bars when playing */}
              <div className="flex items-center gap-1 h-6 pr-2">
                <span
                  className={`w-1 bg-[#9c3f00] rounded-full transition-all duration-300 ${
                    isPlayingAudio ? 'h-5 animate-pulse' : 'h-2'
                  }`}
                />
                <span
                  className={`w-1 bg-[#9c3f00] rounded-full transition-all duration-300 ${
                    isPlayingAudio ? 'h-3 animate-pulse delay-75' : 'h-3'
                  }`}
                />
                <span
                  className={`w-1 bg-[#9c3f00] rounded-full transition-all duration-300 ${
                    isPlayingAudio ? 'h-6 animate-pulse delay-150' : 'h-1.5'
                  }`}
                />
                <span
                  className={`w-1 bg-[#9c3f00] rounded-full transition-all duration-300 ${
                    isPlayingAudio ? 'h-4 animate-pulse' : 'h-2'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Structured Paragraph Sections */}
          {currentArticle.content.map((section, idx) => (
            <div key={idx} className="space-y-4">
              {section.heading && (
                <h2 className="text-xl font-bold text-[#1e1b17] tracking-tight pt-2">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm md:text-base text-[#1e1b17] leading-relaxed">
                  {p}
                </p>
              ))}

              {/* Quote callout box */}
              {section.quote && (
                <div className="bg-[#f9f3eb] border-l-4 border-[#9c3f00] p-4 rounded-r-xl my-4">
                  <p className="italic text-sm md:text-base font-serif text-[#1e1b17]">
                    {section.quote.text}
                  </p>
                  <p className="text-xs font-bold text-[#9c3f00] mt-2">
                    — {section.quote.source}
                  </p>
                </div>
              )}

              {/* Info Box */}
              {section.infoBox && (
                <div className="bg-[#f4ede5] p-4 rounded-2xl border border-[#e0c0b2]/60 my-4 space-y-1.5">
                  <h4 className="text-sm font-bold text-[#9c3f00] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base filled">info</span>
                    {section.infoBox.title}
                  </h4>
                  <p className="text-xs md:text-sm text-[#584237] leading-relaxed whitespace-pre-line">
                    {section.infoBox.text}
                  </p>
                </div>
              )}

              {/* Bullet Points with Icons (e.g. Abhishekam, Aarti, Darshan) */}
              {section.bulletPoints && (
                <div className="space-y-3 my-4">
                  {section.bulletPoints.items.map((item, bIdx) => (
                    <div
                      key={bIdx}
                      className="bg-white p-4 rounded-2xl border border-[#e0c0b2]/40 shadow-sm flex items-start gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#ffdbcb] text-[#9c3f00] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-xl filled">
                          {item.icon || 'star'}
                        </span>
                      </div>
                      <div>
                        {item.title && (
                          <h4 className="text-sm font-bold text-[#1e1b17] mb-1">
                            {item.title}
                          </h4>
                        )}
                        <p className="text-xs md:text-sm text-[#584237] leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Secondary Image if available */}
          {currentArticle.secondaryImage && (
            <div className="rounded-2xl overflow-hidden shadow-md my-4 border border-[#e0c0b2]">
              <img
                src={currentArticle.secondaryImage}
                alt="Wari Tradition"
                className="w-full h-48 md:h-64 object-cover"
              />
            </div>
          )}

          {/* Samadhi Location Card (Screenshot 4 - Alandi Samadhi Sanjeevan) */}
          {currentArticle.samadhiLocation && (
            <div className="bg-white rounded-2xl border border-[#e0c0b2] overflow-hidden shadow-md mt-6">
              <div className="h-40 w-full relative">
                <img
                  src={currentArticle.samadhiLocation.image}
                  alt={currentArticle.samadhiLocation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-[#9c3f00] px-2 py-0.5 rounded-full">
                    {t.samadhiShrine || 'Sacred Shrine'}
                  </span>
                  <h4 className="text-base font-bold mt-1">
                    {currentArticle.samadhiLocation.title}
                  </h4>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <p className="text-xs text-[#584237] leading-relaxed">
                  {currentArticle.samadhiLocation.description}
                </p>
                <button
                  onClick={() => alert('Opening location on the map...')}
                  className="bg-[#9c3f00] text-white p-2.5 rounded-xl flex items-center justify-center shrink-0 hover:bg-[#7a3000] active:scale-95 transition-transform"
                  title={t.viewOnMap || "View on Map"}
                >
                  <span className="material-symbols-outlined text-lg">map</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Complete Reading Action */}
          <div className="pt-6 border-t border-[#e0c0b2]/40 text-center">
            <button
              onClick={() => {
                spiritualAudio.stop();
                setIsPlayingAudio(false);
                onSelectArticle(null);
              }}
              className="px-6 py-3 bg-[#f4ede5] hover:bg-[#eee7df] text-[#9c3f00] font-bold text-sm rounded-full transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>{t.backToGuide || 'Back to Spiritual Guide'}</span>
            </button>
          </div>
        </main>
      </article>
    );
  }

  // -------------------------------------------------------------
  // Guide Hub Screen (Screenshots 20 & 22)
  // -------------------------------------------------------------
  const featuredStory = articles[0]; // Padukas / Timeless Rhythm

  return (
    <div className="min-h-screen bg-[#fff8f1] px-4 md:px-8 py-6 pb-28 max-w-5xl mx-auto space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#9c3f00] tracking-tight">
          {t.spiritualGuide}
        </h1>
        <p className="text-xs md:text-sm text-[#584237] mt-1">
          {t.guideSubtitle}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e0c0b2] flex items-center px-4 py-3">
        <span className="material-symbols-outlined text-[#584237] mr-3">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchGuidesPlaceholder}
          className="w-full bg-transparent border-none outline-none text-sm text-[#1e1b17] placeholder-[#584237]/60"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-[#584237]">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryIndex(idx)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategoryIndex === idx
                ? 'bg-[#9c3f00] text-white shadow-sm'
                : 'bg-white text-[#584237] border border-[#e0c0b2] hover:bg-[#f9f3eb]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Story Card (Screenshot 20) */}
      {activeCategoryIndex === 0 && !searchQuery && featuredStory && (
        <div
          onClick={() => onSelectArticle(featuredStory.id)}
          className="relative rounded-3xl overflow-hidden shadow-[0px_4px_16px_rgba(26,35,126,0.1)] border border-[#e0c0b2]/60 cursor-pointer group transition-transform active:scale-[0.99] bg-[#e8e1da]"
        >
          <div className="h-56 md:h-72 w-full">
            <img
              src={featuredStory.heroImage}
              alt={featuredStory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <span className="bg-[#c35100] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              {t.featuredStory}
            </span>
            <h2 className="text-xl md:text-2xl font-bold leading-tight mb-1">
              {featuredStory.title}
            </h2>
            <p className="text-xs text-[#f4ede5] line-clamp-2 mb-3">
              {featuredStory.summary}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-[#ffdbcb]">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{featuredStory.readTime}</span>
              <span>•</span>
              <span className="underline font-bold">{t.tapToRead}</span>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1e1b17] flex items-center justify-between">
          <span>{t.allGuidesTitle} ({filteredArticles.length})</span>
          <span className="text-xs font-normal text-[#584237]">{t.offlineAvailable}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);

            return (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article.id)}
                className="bg-white rounded-2xl p-4 border border-[#e0c0b2]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-center group"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#eee7df] shrink-0 relative">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {article.audio && (
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white rounded-full p-1">
                      <span className="material-symbols-outlined text-xs filled">volume_up</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-[#9c3f00] uppercase tracking-wider truncate">
                      {article.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(article.id);
                      }}
                      className="text-[#8c7166] hover:text-[#9c3f00] p-0.5"
                    >
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        bookmark
                      </span>
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-[#1e1b17] leading-snug line-clamp-2 group-hover:text-[#9c3f00] transition-colors">
                    {article.title}
                  </h4>

                  <p className="text-xs text-[#584237] line-clamp-1 mt-1">
                    {article.summary}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#8c7166] mt-2 font-medium">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
