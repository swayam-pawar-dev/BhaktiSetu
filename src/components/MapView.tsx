import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { MapService, RouteHalt, AppLanguage, CrowdZone } from '../types';
import { MAP_SERVICES, ROUTE_HALTS, TRANSLATIONS, CROWD_ZONES } from '../data/mockData';

// Accurate GPS Coordinates for all 13 Halts along Sant Dnyaneshwar Palkhi Marg
export const HALT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  alandi: { lat: 18.6775, lng: 73.8967 },
  pune: { lat: 18.5204, lng: 73.8567 },
  saswad: { lat: 18.3444, lng: 74.0305 },
  jejuri: { lat: 18.2764, lng: 74.1593 },
  lonand: { lat: 18.0461, lng: 74.1927 },
  taradgaon: { lat: 17.9754, lng: 74.3168 },
  phaltan: { lat: 17.9867, lng: 74.4328 },
  barad: { lat: 17.9402, lng: 74.6548 },
  natepute: { lat: 17.9004, lng: 74.7709 },
  malshiras: { lat: 17.8471, lng: 74.9084 },
  velapur: { lat: 17.7550, lng: 75.0506 },
  wakhari: { lat: 17.7011, lng: 75.2501 },
  pandharpur: { lat: 17.6778, lng: 75.3283 },
};

// Sant Dnyaneshwar Maharaj Sacred Palkhi Polyline (Alandi to Pandharpur)
const DNYANESHWAR_ROUTE_COORDS: [number, number][] = [
  [18.6775, 73.8967], // Alandi
  [18.6300, 73.8750], // Dighi
  [18.5700, 73.8600], // Vishrantwadi
  [18.5204, 73.8567], // Pune City (Bhavani Peth)
  [18.4900, 73.8900], // Hadapsar
  [18.4400, 73.9600], // Dive Ghat Base
  [18.4000, 73.9900], // Dive Ghat Pass (Scenic)
  [18.3444, 74.0305], // Saswad
  [18.3050, 74.0900], // Sakurdi
  [18.2764, 74.1593], // Jejuri (Khandoba)
  [18.1500, 74.1750], // Valhe
  [18.0900, 74.1850], // Nira River Bridge
  [18.0461, 74.1927], // Lonand (Live Palkhi camp)
  [17.9754, 74.3168], // Taradgaon
  [17.9867, 74.4328], // Phaltan
  [17.9402, 74.6548], // Barad
  [17.9004, 74.7709], // Natepute
  [17.8471, 74.9084], // Malshiras
  [17.7550, 75.0506], // Velapur
  [17.7011, 75.2501], // Wakhari (Maha Sangam)
  [17.6778, 75.3283], // Pandharpur (Shree Vitthal Temple)
];

// Sant Tukaram Maharaj Sacred Palkhi Polyline (Dehu to Pandharpur via Baramati)
const TUKARAM_ROUTE_COORDS: [number, number][] = [
  [18.7180, 73.7690], // Dehu
  [18.6400, 73.7850], // Akurdi
  [18.5204, 73.8567], // Pune
  [18.4850, 74.0150], // Loni Kalbhor
  [18.4400, 74.1800], // Yawat
  [18.3900, 74.3100], // Varvand
  [18.1500, 74.5800], // Baramati
  [18.2300, 75.0300], // Indapur
  [17.9800, 75.1200], // Akluj
  [17.7011, 75.2501], // Wakhari
  [17.6778, 75.3283], // Pandharpur
];

// Service Accurate Coordinates Spread Along the 250km Wari Route
const SERVICE_COORDS: Record<string, { lat: number; lng: number }> = {
  'ram-seva-ngo': { lat: 18.0580, lng: 74.2080 },
  'warkari-med-camp': { lat: 18.0380, lng: 74.1780 },
  'saswad-emergency-med': { lat: 18.3520, lng: 74.0210 },
  'jejuri-annadaan-sevadal': { lat: 18.2810, lng: 74.1650 },
  'vitthal-jal-seva': { lat: 17.9710, lng: 74.3050 },
  'ram-annachhatra': { lat: 17.9920, lng: 74.4150 },
  'dnyaneshwar-shelter': { lat: 17.9450, lng: 74.6620 },
  'natepute-ringan-med': { lat: 17.9060, lng: 74.7820 },
  'malshiras-jal-kendra': { lat: 17.8520, lng: 74.9180 },
  'velapur-sanjeevani-med': { lat: 17.7600, lng: 75.0580 },
  'wakhari-maha-annachhatra': { lat: 17.7080, lng: 75.2420 },
  'pandharpur-redcross-hospital': { lat: 17.6740, lng: 75.3350 },
};

// Helper for feature tag accents: Green for Food, Blue for Water, Red for Medical Camp items (First Aid, Resting Beds, etc.)
const getFeatureTagStyle = (feature: string, serviceType?: string) => {
  const f = feature.toLowerCase();

  // 1. Free Food, Mahaprasad, Meals, Snacks -> Green Accent
  if (
    f.includes('food') ||
    f.includes('mahaprasad') ||
    f.includes('meal') ||
    f.includes('khichdi') ||
    f.includes('chikki') ||
    f.includes('breakfast') ||
    f.includes('snacks') ||
    f.includes('tea') ||
    f.includes('biscuit') ||
    f.includes('laddoo') ||
    (serviceType === 'food' && (f.includes('annachhatra') || f.includes('kitchen') || f.includes('dining')))
  ) {
    return {
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs',
      iconClass: 'text-emerald-600',
      icon: 'restaurant'
    };
  }

  // 2. Drinking Water, RO, Hydration -> Blue Accent
  if (
    f.includes('water') ||
    f.includes('jal') ||
    f.includes('ro ') ||
    f.includes('taak') ||
    f.includes('drink') ||
    f.includes('electrolyte') ||
    f.includes('ors') ||
    f.includes('glucose') ||
    f.includes('refill')
  ) {
    return {
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 shadow-2xs',
      iconClass: 'text-sky-600',
      icon: 'water_drop'
    };
  }

  // 3. Medical Camp Features (First Aid, Resting Beds, Blister Dressing, Oxygen, Medicines, etc.) -> Red Accent
  if (
    f.includes('first aid') ||
    f.includes('resting bed') ||
    f.includes('bed') ||
    f.includes('blister') ||
    f.includes('medicine') ||
    f.includes('oxygen') ||
    f.includes('cardiac') ||
    f.includes('ambulance') ||
    f.includes('icu') ||
    f.includes('saline') ||
    f.includes('physiotherapy') ||
    f.includes('heatstroke') ||
    f.includes('massage') ||
    (serviceType === 'medical' && (f.includes('aid') || f.includes('check') || f.includes('clinic') || f.includes('care')))
  ) {
    return {
      badgeClass: 'bg-red-50 text-red-700 border-red-200 shadow-2xs',
      iconClass: 'text-red-600',
      icon: f.includes('bed') ? 'single_bed' : 'local_hospital'
    };
  }

  // 4. Shelters / Resting Mats / Charging / Sanitation -> Warm Amber Accent
  if (f.includes('mat') || f.includes('shed') || f.includes('charging') || f.includes('sanitation') || f.includes('storage') || f.includes('seating')) {
    return {
      badgeClass: 'bg-[#fff8f1] text-[#7a3000] border-[#e0c0b2]/80',
      iconClass: 'text-[#9c3f00]',
      icon: f.includes('charging') ? 'bolt' : f.includes('mat') ? 'hotel' : f.includes('seating') ? 'airline_seat_recline_normal' : 'home'
    };
  }

  // Fallback default
  return {
    badgeClass: 'bg-[#f9f3eb] text-[#584237] border-[#e0c0b2]/60',
    iconClass: 'text-[#9c3f00]',
    icon: 'check'
  };
};

interface MapViewProps {
  language: AppLanguage;
  onOpenArticle?: (articleId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ language, onOpenArticle }) => {
  const t = TRANSLATIONS[language];
  const [activeFilter, setActiveFilter] = useState<'all' | 'halt' | 'food' | 'medical' | 'shelter' | 'water' | 'crowd'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<MapService | null>(null);
  const [selectedCrowdZone, setSelectedCrowdZone] = useState<CrowdZone | null>(null);
  const [showCrowdLayer, setShowCrowdLayer] = useState<boolean>(true);
  const [showCrowdLegend, setShowCrowdLegend] = useState<boolean>(true);
  const [showTraditionOverlay, setShowTraditionOverlay] = useState<boolean>(false);
  const [selectedHalt, setSelectedHalt] = useState<RouteHalt>(ROUTE_HALTS[4]); // Lonand default
  const [showHaltsDrawer, setShowHaltsDrawer] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const crowdLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Filter services dynamically
  const filteredServices = MAP_SERVICES.filter((service) => {
    const matchesFilter =
      activeFilter === 'all' ||
      service.type === activeFilter ||
      (activeFilter === 'food' && (service.type === 'food' || service.type === 'water'));
    const matchesSearch =
      searchQuery === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Calculate counts for chips
  const foodCount = MAP_SERVICES.filter((s) => s.type === 'food').length;
  const medicalCount = MAP_SERVICES.filter((s) => s.type === 'medical').length;
  const shelterCount = MAP_SERVICES.filter((s) => s.type === 'shelter').length;
  const waterCount = MAP_SERVICES.filter((s) => s.type === 'water').length;
  const crowdCount = CROWD_ZONES.length;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center near Lonand / Middle of Wari Route
    const map = L.map(mapContainerRef.current, {
      center: [18.0461, 74.1927],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
    });

    // CARTO Basemaps API Key (removes watermark)
    const CARTO_API_KEY = 'cb1_2iat_1_731b2153f33791a81bf7688b';

    // Google Maps Styled / Modern Clean Road Tiles
    const initialTile = L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    tileLayerRef.current = initialTile;

    const routeGroup = L.layerGroup().addTo(map);
    const crowdGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);
    routeLayerRef.current = routeGroup;
    crowdLayerRef.current = crowdGroup;
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    // Handle container resize
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Map Layer (Streets / Satellite / Terrain)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const CARTO_API_KEY = 'cb1_2iat_1_731b2153f33791a81bf7688b';
    let url = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;
    let attribution = '&copy; OpenStreetMap contributors, CARTO';
    let maxZoom = 19;

    if (mapLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics';
      maxZoom = 18;
    } else if (mapLayer === 'terrain') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
      maxZoom = 18;
    }

    const newTile = L.tileLayer(url, { maxZoom, attribution }).addTo(map);
    tileLayerRef.current = newTile;
  }, [mapLayer]);

  // Render Route Polylines and Route Corridors
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeGroup = routeLayerRef.current;
    if (!map || !routeGroup) return;

    routeGroup.clearLayers();

    // Sant Tukaram Maharaj Route (Secondary line - Gold/Yellow)
    L.polyline(TUKARAM_ROUTE_COORDS, {
      color: '#e65100',
      weight: 3.5,
      opacity: 0.7,
      dashArray: '6, 6',
    }).addTo(routeGroup);

    // Sant Dnyaneshwar Maharaj Route Outer Glow (Google Maps Route Style)
    L.polyline(DNYANESHWAR_ROUTE_COORDS, {
      color: '#ffffff',
      weight: 8,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(routeGroup);

    // Sant Dnyaneshwar Maharaj Route Core Highway Line
    L.polyline(DNYANESHWAR_ROUTE_COORDS, {
      color: '#c35100',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(routeGroup);

    // Covered Journey Highlight Line (Alandi to Lonand)
    const coveredCoords = DNYANESHWAR_ROUTE_COORDS.slice(0, 13);
    L.polyline(coveredCoords, {
      color: '#008428',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
    }).addTo(routeGroup);
  }, []);

  // Render Interactive Markers (Live Palkhi, Halts, Seva points)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Live Palkhi Marker (Refined Golden Saffron Pin)
    const palkhiCoord = HALT_COORDINATES.lonand;
    const palkhiIconHtml = `
      <div class="relative flex flex-col items-center cursor-pointer group">
        <div class="relative w-8 h-8 rounded-full bg-[#9c3f00] text-white shadow-xl border-2 border-white flex items-center justify-center transition-transform hover:scale-110">
          <span class="material-symbols-outlined text-base filled">temple_hindu</span>
        </div>
        <div class="bg-white/95 text-[#9c3f00] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md mt-1 border border-[#e0c0b2] flex items-center gap-1 whitespace-nowrap">
          <span class="w-2 h-2 rounded-full bg-[#008428]"></span>
          <span>Live Palkhi</span>
        </div>
      </div>
    `;

    const palkhiIcon = L.divIcon({
      className: 'custom-palkhi-pin',
      html: palkhiIconHtml,
      iconSize: [80, 50],
      iconAnchor: [40, 16],
    });

    const palkhiMarker = L.marker([palkhiCoord.lat, palkhiCoord.lng], { icon: palkhiIcon, zIndexOffset: 1000 }).addTo(markersGroup);
    palkhiMarker.on('click', () => {
      setShowTraditionOverlay(true);
    });

    // 2. Official Route Halts (Day numbered Google Maps Style waypoints)
    ROUTE_HALTS.forEach((halt) => {
      const coord = HALT_COORDINATES[halt.id];
      if (!coord) return;

      const isCurrentHalt = halt.id === 'lonand';
      const isPast = halt.dayNumber < 7;
      const isSelected = selectedHalt.id === halt.id;

      const badgeColor = isCurrentHalt ? 'bg-[#9c3f00] text-white' : isPast ? 'bg-[#006b1b] text-white' : 'bg-white text-[#584237]';
      const borderColor = isCurrentHalt ? 'border-white' : isPast ? 'border-white' : 'border-[#8c7166]';

      const haltIconHtml = `
        <div class="flex flex-col items-center cursor-pointer group transition-transform ${isSelected ? 'scale-115' : 'hover:scale-105'}">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md border-2 ${badgeColor} ${borderColor}">
            ${halt.dayNumber}
          </div>
          <span class="bg-white/90 text-[#1e1b17] text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs mt-0.5 whitespace-nowrap border border-[#e0c0b2]/80">
            ${halt.name}
          </span>
        </div>
      `;

      const haltIcon = L.divIcon({
        className: 'custom-halt-pin',
        html: haltIconHtml,
        iconSize: [60, 36],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([coord.lat, coord.lng], { icon: haltIcon, zIndexOffset: isSelected ? 500 : 200 }).addTo(markersGroup);
      marker.on('click', () => {
        setSelectedHalt(halt);
        setSelectedService(null);
        map.flyTo([coord.lat, coord.lng], 13, { duration: 0.8 });
      });
    });

    // 3. Dynamic Seva & NGO Service Markers (Google Maps Point of Interest Pins)
    filteredServices.forEach((srv) => {
      const coord = SERVICE_COORDS[srv.id] || { lat: srv.lat, lng: srv.lng };
      const isSelected = selectedService?.id === srv.id;

      const iconName =
        srv.type === 'food'
          ? 'restaurant'
          : srv.type === 'medical'
          ? 'local_hospital'
          : srv.type === 'water'
          ? 'water_drop'
          : 'home';

      const badgeBg =
        srv.type === 'food'
          ? 'bg-[#15803d]'
          : srv.type === 'medical'
          ? 'bg-[#ba1a1a]'
          : srv.type === 'water'
          ? 'bg-[#0284c7]'
          : 'bg-[#4c56af]';

      const serviceIconHtml = `
        <div class="flex flex-col items-center cursor-pointer group transition-all ${isSelected ? 'scale-120' : 'hover:scale-110'}">
          <div class="w-7 h-7 rounded-full shadow-md border-2 border-white text-white flex items-center justify-center ${badgeBg}">
            <span class="material-symbols-outlined text-sm filled">${iconName}</span>
          </div>
          <span class="bg-white/95 text-[#1e1b17] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm mt-0.5 whitespace-nowrap border border-[#e0c0b2]/80 flex items-center gap-0.5">
            <span>${srv.name}</span>
          </span>
        </div>
      `;

      const serviceIcon = L.divIcon({
        className: 'custom-service-pin',
        html: serviceIconHtml,
        iconSize: [90, 42],
        iconAnchor: [45, 14],
      });

      const marker = L.marker([coord.lat, coord.lng], { icon: serviceIcon, zIndexOffset: isSelected ? 800 : 300 }).addTo(markersGroup);
      marker.on('click', () => {
        setSelectedService(srv);
        map.flyTo([coord.lat, coord.lng], 15, { duration: 0.8 });
      });
    });
  }, [filteredServices, selectedHalt, selectedService]);

  // 3. Render Crowd Density Circles (Orange & Yellow Zones)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const crowdGroup = crowdLayerRef.current;
    if (!map || !crowdGroup) return;

    crowdGroup.clearLayers();

    if (!showCrowdLayer && activeFilter !== 'crowd') {
      return;
    }

    const visibleZones = CROWD_ZONES.filter((zone) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          zone.name.toLowerCase().includes(q) ||
          zone.sector.toLowerCase().includes(q) ||
          zone.statusText.toLowerCase().includes(q) ||
          (zone.marathiName && zone.marathiName.toLowerCase().includes(q))
        );
      }
      return true;
    });

    visibleZones.forEach((zone) => {
      const isOrange = zone.level === 'orange';
      const isSelected = selectedCrowdZone?.id === zone.id;

      // 1. Draw Orange or Yellow Circular Density Zone (Translucent, Non-blinking)
      const borderColor = isOrange ? '#ea580c' : '#ca8a04';
      const fillColor = isOrange ? '#f97316' : '#facc15';
      const fillOpacity = isSelected ? 0.25 : isOrange ? 0.16 : 0.14;
      const borderOpacity = isSelected ? 0.85 : 0.6;
      const weight = isSelected ? 2.5 : 1.75;

      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radiusMeters,
        color: borderColor,
        opacity: borderOpacity,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        weight: weight,
      }).addTo(crowdGroup);

      // Tooltip for circle hover
      const zoneTitle = language === 'mr' ? zone.marathiName || zone.name : language === 'hi' ? zone.hindiName || zone.name : zone.name;
      circle.bindTooltip(
        `<div class="font-sans text-xs font-bold p-1">
          <div class="flex items-center gap-1.5 ${isOrange ? 'text-[#c2410c]' : 'text-[#854d0e]'}">
            <span class="inline-block w-2 h-2 rounded-full ${isOrange ? 'bg-[#ea580c]' : 'bg-[#ca8a04]'}"></span>
            <span>${zoneTitle}</span>
          </div>
          <div class="text-[10px] text-gray-700 font-medium mt-0.5">${zone.crowdCount} • ${zone.statusText}</div>
        </div>`,
        { permanent: false, direction: 'top', className: 'custom-crowd-tooltip' }
      );

      circle.on('click', () => {
        setSelectedCrowdZone(zone);
        setSelectedService(null);
        map.flyTo([zone.lat, zone.lng], 14, { duration: 0.8 });
      });

      // 2. Add Center Hotspot Pill Marker (Clean, Translucent Tint, No Blinking)
      const badgeBg = isOrange ? 'bg-[#ea580c]/90' : 'bg-[#ca8a04]/90';
      const textColor = isOrange ? 'text-[#9a3412]' : 'text-[#854d0e]';
      const borderAccent = isOrange ? 'border-[#ea580c]/40' : 'border-[#ca8a04]/40';

      const crowdMarkerHtml = `
        <div class="flex flex-col items-center cursor-pointer group transition-all ${isSelected ? 'scale-115' : 'hover:scale-105'}">
          <div class="relative px-2 py-0.5 rounded-full ${badgeBg} backdrop-blur-xs text-white text-[10px] font-extrabold shadow-sm border border-white/90 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-white/90"></span>
            <span class="material-symbols-outlined text-[13px] filled">groups</span>
            <span>${zone.crowdCount}</span>
          </div>
          <span class="bg-white/90 backdrop-blur-xs ${textColor} text-[9px] font-extrabold px-1.5 py-0.2 rounded-md shadow-xs mt-0.5 whitespace-nowrap border ${borderAccent} flex items-center gap-0.5">
            <span>${zoneTitle.split(' ')[0]}</span>
          </span>
        </div>
      `;

      const crowdIcon = L.divIcon({
        className: 'custom-crowd-pin',
        html: crowdMarkerHtml,
        iconSize: [110, 42],
        iconAnchor: [55, 14],
      });

      const marker = L.marker([zone.lat, zone.lng], {
        icon: crowdIcon,
        zIndexOffset: isSelected ? 900 : isOrange ? 600 : 400,
      }).addTo(crowdGroup);

      marker.on('click', () => {
        setSelectedCrowdZone(zone);
        setSelectedService(null);
        map.flyTo([zone.lat, zone.lng], 14, { duration: 0.8 });
      });
    });
  }, [showCrowdLayer, activeFilter, searchQuery, selectedCrowdZone, language]);

  const handleShareLocation = (serviceName: string) => {
    setShareNotice(`Location for ${serviceName} copied to clipboard!`);
    setTimeout(() => setShareNotice(null), 3000);
  };

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([18.0461, 74.1927], 14, { duration: 1 });
  };

  const handleFitEntireRoute = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds(DNYANESHWAR_ROUTE_COORDS);
    map.fitBounds(bounds, { padding: [40, 40] });
  };

  const handleFilterClick = (filter: 'all' | 'halt' | 'food' | 'medical' | 'shelter' | 'water' | 'crowd') => {
    setActiveFilter(filter);
    if (filter === 'halt') {
      setShowHaltsDrawer(true);
    } else if (filter === 'crowd') {
      setShowCrowdLayer(true);
      if (mapInstanceRef.current) {
        const lonandZone = CROWD_ZONES.find((z) => z.id === 'cz-lonand') || CROWD_ZONES[0];
        setSelectedCrowdZone(lonandZone);
        mapInstanceRef.current.flyTo([lonandZone.lat, lonandZone.lng], 14, { duration: 1 });
      }
    } else if (filter !== 'all') {
      const match = MAP_SERVICES.find((s) => s.type === filter);
      if (match && mapInstanceRef.current) {
        const coord = SERVICE_COORDS[match.id] || { lat: match.lat, lng: match.lng };
        mapInstanceRef.current.flyTo([coord.lat, coord.lng], 15, { duration: 1 });
      }
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden bg-[#e5e3df] select-none">
      {/* Real Interactive Leaflet / Google Maps Styled Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Search & Filter Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 md:left-8 md:right-auto md:w-[460px] z-30 space-y-2 pointer-events-auto">
        {/* Search Input Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0px_6px_20px_rgba(26,35,126,0.12)] border border-[#e0c0b2] flex items-center px-4 py-2.5">
          <span className="material-symbols-outlined text-[#9c3f00] mr-2.5 text-xl filled">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Annachhatra, Medical, Water, Shelters..."
            className="w-full bg-transparent border-none outline-none text-sm text-[#1e1b17] placeholder-[#584237]/60 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#584237] p-1 hover:bg-[#f4ede5] rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
          <button
            onClick={() => handleFilterClick('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 border shadow-xs ${
              activeFilter === 'all'
                ? 'bg-[#9c3f00] text-white border-[#9c3f00]'
                : 'bg-white/90 backdrop-blur-sm text-[#584237] border-[#e0c0b2] hover:bg-white'
            }`}
          >
            <span>{t.all}</span>
          </button>

          <button
            onClick={() => handleFilterClick('food')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border shadow-xs ${
              activeFilter === 'food'
                ? 'bg-[#15803d] text-white border-[#15803d]'
                : 'bg-white/90 backdrop-blur-sm text-[#584237] border-[#e0c0b2] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm filled text-[#15803d]">restaurant</span>
            <span>{t.annachhatra} ({foodCount})</span>
          </button>

          <button
            onClick={() => handleFilterClick('medical')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border shadow-xs ${
              activeFilter === 'medical'
                ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
                : 'bg-white/90 backdrop-blur-sm text-[#584237] border-[#e0c0b2] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm filled text-[#ba1a1a]">local_hospital</span>
            <span>{t.medical} ({medicalCount})</span>
          </button>

          <button
            onClick={() => handleFilterClick('water')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border shadow-xs ${
              activeFilter === 'water'
                ? 'bg-[#1565c0] text-white border-[#1565c0]'
                : 'bg-white/90 backdrop-blur-sm text-[#584237] border-[#e0c0b2] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm filled text-[#1565c0]">water_drop</span>
            <span>{t.water} ({waterCount})</span>
          </button>

          <button
            onClick={() => handleFilterClick('shelter')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border shadow-xs ${
              activeFilter === 'shelter'
                ? 'bg-[#4c56af] text-white border-[#4c56af]'
                : 'bg-white/90 backdrop-blur-sm text-[#584237] border-[#e0c0b2] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm filled text-[#4c56af]">home</span>
            <span>{t.shelter} ({shelterCount})</span>
          </button>

          {/* Crowd Management Filter Chip */}
          <button
            onClick={() => handleFilterClick('crowd')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border shadow-xs ${
              activeFilter === 'crowd'
                ? 'bg-[#ea580c] text-white border-[#ea580c]'
                : showCrowdLayer
                ? 'bg-[#fff4ed] text-[#c2410c] border-[#ea580c]/50 hover:bg-[#ffe8dc]'
                : 'bg-white/90 backdrop-blur-sm text-[#584237] border-[#e0c0b2] hover:bg-white'
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]/80 border border-[#ea580c]"></span>
              <span className="w-2 h-2 rounded-full bg-[#ca8a04]/80 border border-[#ca8a04]"></span>
            </span>
            <span>{language === 'mr' ? 'गर्दी व्यवस्थापन' : language === 'hi' ? 'भीड़ प्रबंधन' : 'Crowd Zones'} ({crowdCount})</span>
          </button>

          <button
            onClick={() => handleFilterClick('halt')}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-[#584237] border border-[#e0c0b2] hover:bg-white transition-all shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-sm text-[#9c3f00]">pin_drop</span>
            <span>{t.halts} ({ROUTE_HALTS.length})</span>
          </button>
        </div>
      </div>

      {/* Floating Crowd Management Legend & Hotspots Quick Switcher */}
      {showCrowdLayer && (
        <div className="absolute top-28 md:top-24 left-3 md:left-8 z-30 pointer-events-auto max-w-[290px] md:max-w-[320px]">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#e0c0b2] p-3 text-xs">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#f4ede5]">
              <div className="flex items-center gap-1.5 font-bold text-[#1e1b17]">
                <span className="material-symbols-outlined text-[#ea580c] text-base filled">groups</span>
                <span>{language === 'mr' ? 'थेट गर्दी निर्देशांक' : language === 'hi' ? 'लाइव भीड़ सूचकांक' : 'Live Crowd Status'}</span>
              </div>
              <button
                onClick={() => setShowCrowdLegend(!showCrowdLegend)}
                className="text-[#584237] hover:text-[#1e1b17] p-0.5 rounded transition-colors"
                title={showCrowdLegend ? 'Collapse' : 'Expand'}
              >
                <span className="material-symbols-outlined text-sm">
                  {showCrowdLegend ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            {showCrowdLegend && (
              <div className="pt-2 space-y-2">
                <div className="flex items-start gap-2 text-[11px] text-[#1e1b17]">
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#f97316]/25 border border-[#ea580c] shrink-0 mt-0.5"></span>
                  <div>
                    <span className="font-extrabold text-[#c2410c]">
                      {language === 'mr' ? 'केशरी वर्तुळ (अति गर्दी / 200+)' : language === 'hi' ? 'नारंगी घेरा (भारी भीड़ / 200+)' : 'Orange Circles: Heavy Density (200+)'}
                    </span>
                    <p className="text-[10px] text-[#584237]">
                      {language === 'mr' ? 'पालखी तंबू, घाट मार्ग व प्रमुख रांगा' : language === 'hi' ? 'पालकी मैदान, घाट मार्ग व कतार' : 'Palkhi camps, ghat bottlenecks & queues'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-[11px] text-[#1e1b17]">
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#facc15]/25 border border-[#ca8a04] shrink-0 mt-0.5"></span>
                  <div>
                    <span className="font-extrabold text-[#a16207]">
                      {language === 'mr' ? 'पिवळे वर्तुळ (मध्यम गर्दी / 50-200)' : language === 'hi' ? 'पीला घेरा (मध्यम भीड़ / 50-200)' : 'Yellow Circles: Moderate Density (50-200)'}
                    </span>
                    <p className="text-[10px] text-[#584237]">
                      {language === 'mr' ? 'अन्नछत्र, विश्रांती शेड व पाणी केंद्र' : language === 'hi' ? 'अन्नछत्र, विश्राम शेड व जल केंद्र' : 'Annachhatras, shelters & water refill'}
                    </p>
                  </div>
                </div>

                {/* Hotspots Quick Switcher */}
                <div className="pt-1.5 border-t border-[#f4ede5]">
                  <span className="text-[10px] font-bold text-[#584237] block mb-1">
                    {language === 'mr' ? 'प्रमुख गर्दी क्षेत्रे:' : language === 'hi' ? 'प्रमुख भीड़ क्षेत्र:' : 'Jump to Crowd Hotspot:'}
                  </span>
                  <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
                    {CROWD_ZONES.slice(0, 5).map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => {
                          setSelectedCrowdZone(zone);
                          setSelectedService(null);
                          mapInstanceRef.current?.flyTo([zone.lat, zone.lng], 14, { duration: 0.8 });
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap border transition-all active:scale-95 ${
                          zone.level === 'orange'
                            ? 'bg-[#fff4ed] text-[#c2410c] border-[#ea580c]/40 hover:bg-[#ffdbcb]'
                            : 'bg-[#fefce8] text-[#854d0e] border-[#ca8a04]/40 hover:bg-[#fef08a]'
                        }`}
                      >
                        {language === 'mr' ? (zone.marathiName?.split(' ')[0] || zone.name) : zone.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Google Maps Navigation Controls & Layer Switcher */}
      <div className="absolute right-3 top-24 md:top-20 z-30 flex flex-col gap-2 pointer-events-auto">
        {/* Crowd Zones Layer Toggle */}
        <button
          onClick={() => setShowCrowdLayer(!showCrowdLayer)}
          aria-label="Toggle crowd zones"
          className={`backdrop-blur-md shadow-lg rounded-2xl w-11 h-11 flex items-center justify-center border transition-all active:scale-95 ${
            showCrowdLayer
              ? 'bg-[#ea580c] text-white border-white shadow-[#ea580c]/30'
              : 'bg-white/95 text-[#584237] border-[#e0c0b2] hover:bg-white'
          }`}
          title={showCrowdLayer ? 'Hide Orange & Yellow Crowd Circles' : 'Show Orange & Yellow Crowd Circles'}
        >
          <span className="material-symbols-outlined text-xl filled">groups</span>
        </button>

        {/* Layer Switcher Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            aria-label="Map layers"
            className="bg-white/95 backdrop-blur-md text-[#1e1b17] shadow-lg rounded-2xl w-11 h-11 flex items-center justify-center border border-[#e0c0b2] hover:bg-white active:scale-95 transition-all"
            title="Switch Map Layers (Streets, Satellite, Terrain)"
          >
            <span className="material-symbols-outlined text-xl text-[#9c3f00] filled">layers</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-13 top-0 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-[#e0c0b2] flex flex-col gap-1.5 w-36 animate-fadeIn">
              <button
                onClick={() => {
                  setMapLayer('streets');
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                  mapLayer === 'streets' ? 'bg-[#ffdbcb] text-[#9c3f00]' : 'text-[#1e1b17] hover:bg-[#f4ede5]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">map</span>
                <span>Streets</span>
              </button>
              <button
                onClick={() => {
                  setMapLayer('satellite');
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                  mapLayer === 'satellite' ? 'bg-[#ffdbcb] text-[#9c3f00]' : 'text-[#1e1b17] hover:bg-[#f4ede5]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">satellite_alt</span>
                <span>Satellite</span>
              </button>
              <button
                onClick={() => {
                  setMapLayer('terrain');
                  setShowLayerMenu(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                  mapLayer === 'terrain' ? 'bg-[#ffdbcb] text-[#9c3f00]' : 'text-[#1e1b17] hover:bg-[#f4ede5]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">terrain</span>
                <span>Terrain</span>
              </button>
            </div>
          )}
        </div>

        {/* Zoom In */}
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          aria-label="Zoom in"
          className="bg-white/95 backdrop-blur-md text-[#1e1b17] shadow-lg rounded-2xl w-11 h-11 flex items-center justify-center border border-[#e0c0b2] hover:bg-white active:scale-95 transition-all"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-xl">add</span>
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          aria-label="Zoom out"
          className="bg-white/95 backdrop-blur-md text-[#1e1b17] shadow-lg rounded-2xl w-11 h-11 flex items-center justify-center border border-[#e0c0b2] hover:bg-white active:scale-95 transition-all"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-xl">remove</span>
        </button>

        {/* Full Route Fit Bounds */}
        <button
          onClick={handleFitEntireRoute}
          aria-label="Overview entire 250km route"
          className="bg-white/95 backdrop-blur-md text-[#1e1b17] shadow-lg rounded-2xl w-11 h-11 flex items-center justify-center border border-[#e0c0b2] hover:bg-white active:scale-95 transition-all"
          title="Fit Full 250 km Pilgrimage Corridor"
        >
          <span className="material-symbols-outlined text-xl text-[#006b1b]">route</span>
        </button>

        {/* Tradition Info */}
        <button
          onClick={() => setShowTraditionOverlay(true)}
          aria-label="Wari Info"
          className="bg-[#ffdbcb] text-[#9c3f00] shadow-lg rounded-2xl w-11 h-11 flex items-center justify-center border border-[#9c3f00]/40 hover:bg-[#ffb693] active:scale-95 transition-all"
          title="Sacred Tradition of Wari"
        >
          <span className="material-symbols-outlined text-xl filled">info</span>
        </button>

        {/* Recenter to Live Palkhi */}
        <button
          onClick={handleRecenter}
          aria-label="My location / Recenter"
          className="bg-[#9c3f00] text-white shadow-lg rounded-2xl w-11 h-11 flex items-center justify-center border-2 border-white hover:bg-[#7a3000] active:scale-95 transition-all mt-1"
          title="Recenter Live Palkhi (Lonand)"
        >
          <span className="material-symbols-outlined text-xl filled">my_location</span>
        </button>
      </div>

      {/* Share location toast */}
      {shareNotice && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-[#1e1b17] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm text-[#94f990]">check_circle</span>
          <span>{shareNotice}</span>
        </div>
      )}

      {/* Floating Bottom Card: NEXT HALT Banner */}
      {!selectedService && (
        <div className="absolute bottom-20 left-3 right-3 md:left-8 md:w-96 z-20 space-y-2 pointer-events-auto">
          <div className="bg-[#fff8f1]/95 backdrop-blur-md rounded-2xl shadow-[0px_6px_24px_rgba(26,35,126,0.18)] border border-[#e0c0b2] p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#c35100] text-white rounded-xl p-3 flex-shrink-0 flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-2xl filled">directions_walk</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#584237] tracking-wider uppercase">
                  {t.nextHalt} (Day {selectedHalt.dayNumber})
                </p>
                <h3 className="text-lg font-bold text-[#1e1b17] leading-tight">
                  {selectedHalt.name} <span className="text-xs font-normal text-[#584237]">({selectedHalt.marathiName})</span>
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#006b1b] font-medium">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>{t.eta}: 2 hrs • 8 km left</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHaltsDrawer(true)}
              className="bg-[#9c3f00] hover:bg-[#7a3000] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0"
              title="View full halts schedule"
            >
              <span className="material-symbols-outlined text-xl">navigation</span>
            </button>
          </div>

          {/* Filtered Services Quick Carousel Tray */}
          {filteredServices.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
              {filteredServices.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => {
                    setSelectedService(srv);
                    const coord = SERVICE_COORDS[srv.id] || { lat: srv.lat, lng: srv.lng };
                    mapInstanceRef.current?.flyTo([coord.lat, coord.lng], 15, { duration: 0.8 });
                  }}
                  className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-[#e0c0b2]/60 shadow-sm flex items-center gap-2 hover:bg-white text-left text-xs whitespace-nowrap shrink-0 active:scale-95 transition-all"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 ${
                      srv.type === 'food'
                        ? 'bg-[#15803d]'
                        : srv.type === 'medical'
                        ? 'bg-[#ba1a1a]'
                        : srv.type === 'water'
                        ? 'bg-[#0284c7]'
                        : 'bg-[#4c56af]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm filled">
                      {srv.type === 'food'
                        ? 'restaurant'
                        : srv.type === 'medical'
                        ? 'local_hospital'
                        : srv.type === 'water'
                        ? 'water_drop'
                        : 'home'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1e1b17]">{srv.name}</p>
                    <p className="text-[10px] text-[#584237]">{srv.distance} • {srv.hours}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Screen: Selected Service Detailed Bottom Sheet */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 flex items-end justify-center transition-all p-0 md:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-[32px] md:rounded-[32px] shadow-2xl p-6 pb-28 md:pb-6 animate-slideUp max-h-[85vh] overflow-y-auto border-t md:border border-[#e0c0b2]">
            {/* Grabber Bar */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-1.5 bg-[#dfd9d1] rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h2 className="text-xl font-bold text-[#1e1b17]">{selectedService.name}</h2>
                  {selectedService.isVerified && (
                    <span className="material-symbols-outlined text-[#4c56af] text-lg filled" title="Verified Service">
                      verified
                    </span>
                  )}
                </div>
                <p className="text-[#9c3f00] font-semibold text-sm">{selectedService.categoryLabel}</p>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="bg-[#eee7df] hover:bg-[#dfd9d1] p-2 rounded-full text-[#584237] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Distance & Walking Time */}
            <div className="flex items-center gap-4 text-xs text-[#584237] mb-5 font-medium">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#9c3f00]">near_me</span>
                <span>{selectedService.distance}</span>
              </div>
              <span className="w-1 h-1 bg-[#8c7166] rounded-full" />
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#9c3f00]">directions_walk</span>
                <span>{selectedService.walkTime}</span>
              </div>
            </div>

            {/* Primary Action: Get Directions in Google Maps style */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedService.lat},${selectedService.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#9c3f00] hover:bg-[#7a3000] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#9c3f00]/20 mb-5 active:scale-[0.98] transition-all text-base"
            >
              <span className="material-symbols-outlined text-xl">directions</span>
              <span>{t.getDirections}</span>
            </a>

            {/* Tags / Features Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedService.features.map((feature, idx) => {
                const tagStyle = getFeatureTagStyle(feature, selectedService.type);
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${tagStyle.badgeClass}`}
                  >
                    <span className={`material-symbols-outlined text-sm filled ${tagStyle.iconClass}`}>
                      {tagStyle.icon}
                    </span>
                    <span>{feature}</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5 bg-[#f4ede5] text-[#584237] px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#e0c0b2]/60">
                <span className="material-symbols-outlined text-sm text-[#9c3f00]">schedule</span>
                <span>{selectedService.hours}</span>
              </div>
            </div>

            {/* Crowd Density Meter */}
            {(() => {
              const isHigh =
                selectedService.crowdDensity >= 65 ||
                selectedService.crowdLabel?.toLowerCase().includes('high') ||
                selectedService.crowdLabel?.includes('अधिक') ||
                selectedService.crowdLabel?.includes('जास्त');
              const isLow =
                selectedService.crowdDensity <= 35 ||
                selectedService.crowdLabel?.toLowerCase().includes('low') ||
                selectedService.crowdLabel?.includes('कमी') ||
                selectedService.crowdLabel?.includes('कम');

              const crowdTextColor = isHigh
                ? 'text-[#ba1a1a]'
                : isLow
                ? 'text-[#15803d]'
                : 'text-[#c35100]';

              const crowdBarColor = isHigh
                ? 'bg-[#ba1a1a]'
                : isLow
                ? 'bg-[#15803d]'
                : 'bg-[#c35100]';

              const displayCrowdLabel =
                isHigh
                  ? (language === 'mr' ? 'अति गर्दी (High)' : language === 'hi' ? 'अधिक भीड़ (High)' : 'High Crowding')
                  : isLow
                  ? (language === 'mr' ? 'कमी गर्दी (Low)' : language === 'hi' ? 'कम भीड़ (Low)' : 'Low Crowding')
                  : (language === 'mr' ? 'मध्यम गर्दी (Moderate)' : language === 'hi' ? 'मध्यम भीड़ (Moderate)' : 'Moderate Crowding');

              return (
                <div className="bg-[#fff8f1] p-4 rounded-2xl mb-5 border border-[#e0c0b2]/60">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#1e1b17]">{t.crowdDensity}</span>
                    <span className={`text-xs font-bold ${crowdTextColor}`}>
                      {displayCrowdLabel}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#eee7df] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${crowdBarColor}`}
                      style={{ width: `${selectedService.crowdDensity}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Description */}
            <p className="text-xs text-[#584237] leading-relaxed mb-5 bg-[#f9f3eb] p-3 rounded-xl border border-[#e0c0b2]/40">
              {selectedService.description}
            </p>

            {/* Action Buttons: Call Organizer & Share Location */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${selectedService.phone}`}
                className="flex flex-col items-center justify-center p-3 bg-[#f9f3eb] hover:bg-[#eee7df] rounded-2xl transition-all border border-[#e0c0b2] text-[#1e1b17] active:scale-95"
              >
                <span className="material-symbols-outlined text-[#9c3f00] mb-1 text-xl">call</span>
                <span className="text-xs font-bold">{t.callOrganizer}</span>
              </a>

              <button
                onClick={() => handleShareLocation(selectedService.name)}
                className="flex flex-col items-center justify-center p-3 bg-[#f9f3eb] hover:bg-[#eee7df] rounded-2xl transition-all border border-[#e0c0b2] text-[#1e1b17] active:scale-95"
              >
                <span className="material-symbols-outlined text-[#9c3f00] mb-1 text-xl">share</span>
                <span className="text-xs font-bold">{t.shareLocation}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen: Selected Crowd Zone Detailed Bottom Sheet */}
      {selectedCrowdZone && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-end justify-center transition-all p-0 md:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-[32px] md:rounded-[32px] shadow-2xl p-6 pb-28 md:pb-6 animate-slideUp max-h-[88vh] overflow-y-auto border-t md:border border-[#e0c0b2]">
            {/* Grabber Bar */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-1.5 bg-[#dfd9d1] rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full text-white shadow-xs ${
                      selectedCrowdZone.level === 'orange' ? 'bg-[#ea580c]' : 'bg-[#ca8a04]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90"></span>
                    <span>
                      {selectedCrowdZone.level === 'orange'
                        ? (language === 'mr' ? 'अति गर्दी क्षेत्र' : language === 'hi' ? 'भारी भीड़ क्षेत्र' : 'High Density Zone')
                        : (language === 'mr' ? 'मध्यम गर्दी क्षेत्र' : language === 'hi' ? 'मध्यम भीड़ क्षेत्र' : 'Moderate Density Zone')}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#584237] font-semibold">{selectedCrowdZone.sector}</span>
                </div>
                <h2 className="text-xl font-bold text-[#1e1b17]">
                  {language === 'mr' ? selectedCrowdZone.marathiName || selectedCrowdZone.name : language === 'hi' ? selectedCrowdZone.hindiName || selectedCrowdZone.name : selectedCrowdZone.name}
                </h2>
                <p className="text-xs text-[#584237] mt-0.5">{selectedCrowdZone.statusText}</p>
              </div>

              <button
                onClick={() => setSelectedCrowdZone(null)}
                className="bg-[#eee7df] hover:bg-[#dfd9d1] p-2 rounded-full text-[#584237] active:scale-95 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Real-time Headcount & Density Bar */}
            <div className={`p-4 rounded-2xl mb-4 border ${
              selectedCrowdZone.level === 'orange'
                ? 'bg-[#fff4ed] border-[#ea580c]/30'
                : 'bg-[#fefce8] border-[#ca8a04]/30'
            }`}>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-[11px] font-bold text-[#584237] uppercase tracking-wider block">
                    {language === 'mr' ? 'अंदाजे वारकरी संख्या' : language === 'hi' ? 'अनुमानित वारकरी संख्या' : 'Live Headcount'}
                  </span>
                  <span className={`text-2xl font-extrabold ${
                    selectedCrowdZone.level === 'orange' ? 'text-[#c2410c]' : 'text-[#854d0e]'
                  }`}>
                    {selectedCrowdZone.crowdCount}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#1e1b17]">{selectedCrowdZone.densityPercentage}%</span>
                  <span className="text-[10px] text-[#584237] block">{language === 'mr' ? 'क्षमता व्यापली' : language === 'hi' ? 'क्षमता भरी' : 'Capacity Occupied'}</span>
                </div>
              </div>

              <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    selectedCrowdZone.level === 'orange' ? 'bg-[#ea580c]' : 'bg-[#ca8a04]'
                  }`}
                  style={{ width: `${selectedCrowdZone.densityPercentage}%` }}
                />
              </div>

              {/* Movement Speed and Volunteers stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#9c3f00]">speed</span>
                  <div>
                    <p className="text-[10px] text-[#584237]">{language === 'mr' ? 'हालचाल गती' : language === 'hi' ? 'गति' : 'Movement Pace'}</p>
                    <p className="font-bold text-[#1e1b17]">{selectedCrowdZone.speed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#006b1b]">volunteer_activism</span>
                  <div>
                    <p className="text-[10px] text-[#584237]">{language === 'mr' ? 'कार्यरत स्वयंसेवक' : language === 'hi' ? 'सक्रिय स्वयंसेवक' : 'Volunteers on Duty'}</p>
                    <p className="font-bold text-[#1e1b17]">{selectedCrowdZone.volunteersOnDuty} {language === 'mr' ? 'सेवक' : language === 'hi' ? 'सेवक' : 'Sevekaris'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Crowd Guidance Recommendation Card */}
            <div className="bg-[#fff8f1] rounded-2xl p-4 mb-4 border border-[#e0c0b2]">
              <div className="flex items-center gap-2 mb-1.5 text-[#9c3f00] font-bold text-xs">
                <span className="material-symbols-outlined text-base filled">info</span>
                <span>{language === 'mr' ? 'गर्दी नियंत्रण सल्ला व मार्ग' : language === 'hi' ? 'भीड़ नियंत्रण सलाह व मार्ग' : 'Crowd Guidance & Advisory'}</span>
              </div>
              <p className="text-xs text-[#1e1b17] leading-relaxed">
                {language === 'mr' ? selectedCrowdZone.marathiRecommendation || selectedCrowdZone.recommendation : selectedCrowdZone.recommendation}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCrowdZone.lat},${selectedCrowdZone.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#9c3f00] hover:bg-[#7a3000] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#9c3f00]/20 active:scale-[0.98] transition-all text-sm"
              >
                <span className="material-symbols-outlined text-xl">directions</span>
                <span>{t.getDirections}</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleShareLocation(selectedCrowdZone.name);
                  }}
                  className="flex items-center justify-center gap-1.5 p-3 bg-[#f9f3eb] hover:bg-[#eee7df] rounded-xl text-xs font-bold text-[#1e1b17] border border-[#e0c0b2] transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-[#9c3f00]">share</span>
                  <span>{t.shareLocation}</span>
                </button>

                <a
                  href="tel:108"
                  className="flex items-center justify-center gap-1.5 p-3 bg-[#f9f3eb] hover:bg-[#eee7df] rounded-xl text-xs font-bold text-[#ba1a1a] border border-[#ba1a1a]/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-[#ba1a1a]">emergency</span>
                  <span>{language === 'mr' ? 'आपत्कालीन हेल्पलाईन' : language === 'hi' ? 'आपातकालीन हेल्पलाइन' : 'Help Desk / 108'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen: Sacred Tradition of Wari Educational Overlay Modal */}
      {showTraditionOverlay && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pb-24 md:pb-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#fff8f1] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e0c0b2] max-h-[82vh] flex flex-col">
            {/* Header Image Accent */}
            <div className="h-32 bg-[#c35100] relative w-full overflow-hidden shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-TWJuND5dwmB7TgsfBz5yRM5RkKdU4VVE-aqTEdaUGxpMm9YocyQHmYQqB28oG73kRwKEUC1OyDaPsHrdIUSxETCxRz2VQhUCWQXsXs33kmOwSM7LnM_wEKCFEhEWnVKPW4SrmZcnMdKsyj0wpa9yk7Xb98lzp5lay2r93aPMmRS8dN6lYwbK70rGUdhSkbdsG8X8_OgyVzq2CT8vE7QrGokadtKS1ROlgZwi_vicV0PNA-wEYRkE"
                alt="Sacred Palkhi"
                className="w-full h-full object-cover opacity-85 mix-blend-multiply"
              />
              <button
                onClick={() => setShowTraditionOverlay(false)}
                className="absolute top-3 right-3 text-white bg-black/50 rounded-full p-1.5 hover:bg-black/70 transition-colors shadow-md"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-5 overflow-y-auto space-y-4 pb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1e1b17]">
                  {language === 'mr' ? 'वारीची पवित्र परंपरा' : language === 'hi' ? 'वारी की पावन परंपरा' : 'The Sacred Tradition of Wari'}
                </h2>
                <p className="text-sm font-semibold text-[#9c3f00]">
                  {language === 'mr' ? '८०० वर्षांची समतेची व भक्तीची तीर्थयात्रा' : language === 'hi' ? '८०० वर्षों की समता और भक्ति की पावन यात्रा' : 'An 800-Year Pilgrimage of Equality'}
                </p>
              </div>

              <div className="bg-[#f9f3eb] rounded-2xl p-4 border border-[#e0c0b2]/40">
                <p className="text-xs md:text-sm text-[#1e1b17] leading-relaxed">
                  {language === 'mr'
                    ? 'पंढरपूर वारी ही श्रद्धेचा अलौकिक सोहळा आहे. शेकडो किलोमीटर चालत पंढरपूरच्या विठोबा मंदिरात जाणारे वारकरी संपूर्ण समतेचा संदेश देतात.'
                    : language === 'hi'
                    ? 'पंढरपुर वारी श्रद्धा और भक्ति का पावन उत्सव है। सैकड़ों किलोमीटर पैदल चलकर पंढरपुर जाने वाले वारकरी समता और बंधुभाव का संदेश देते हैं।'
                    : 'The Pandharpur Wari is a magnificent journey of faith, walking hundreds of kilometers to the Vithoba temple. It is unique for its principle of absolute equality—everyone walks together as one community, leaving behind social hierarchies.'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#9c3f00] flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm filled">lightbulb</span>
                  {language === 'mr' ? 'तुम्हाला माहीत आहे का?' : language === 'hi' ? 'क्या आप जानते हैं?' : 'Did You Know?'}
                </h3>
                <ul className="flex flex-col gap-2 text-xs text-[#1e1b17]">
                  <li className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#e0c0b2]/30 shadow-sm">
                    <span className="material-symbols-outlined text-[#9c3f00] text-lg filled shrink-0">
                      directions_walk
                    </span>
                    <span>
                      {language === 'mr'
                        ? 'या परंपरेमध्ये संतांच्या पादुका सजवलेल्या पालखीतून भक्तिभावाने नेल्या जातात.'
                        : language === 'hi'
                        ? 'इस परंपरा में संतों की पादुकाएं सुसज्जित पालकी में श्रद्धापूर्वक ले जाई जाती हैं।'
                        : 'The tradition involves carrying the paduka (footprints) of saints in a decorated Palkhi.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#e0c0b2]/30 shadow-sm">
                    <span className="material-symbols-outlined text-[#9c3f00] text-lg filled shrink-0">
                      groups
                    </span>
                    <span>
                      {language === 'mr'
                        ? 'वारकरी दिंड्यांमध्ये विभागलेले असतात आणि वाटेत विठ्ठल नामाचा गजर करत चालतात.'
                        : language === 'hi'
                        ? 'वारकरी दिंडियों में संगठित होकर अभंग गाते हुए आगे बढ़ते हैं।'
                        : 'Pilgrims are organized in sub-groups called Dindis, singing abhangas along the way.'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Call to Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setShowTraditionOverlay(false);
                    if (onOpenArticle) {
                      onOpenArticle('padukas-significance');
                    }
                  }}
                  className="w-full bg-[#ffdbcb] hover:bg-[#ffb693] text-[#7a3000] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm filled">auto_stories</span>
                  <span>{language === 'mr' ? 'संपूर्ण लेख वाचा: पवित्र पादुका' : language === 'hi' ? 'पूरा लेख पढ़ें: पवित्र पादुका' : 'Read Full Article: Sacred Padukas'}</span>
                </button>

                <button
                  onClick={() => setShowTraditionOverlay(false)}
                  className="w-full h-12 bg-[#9c3f00] hover:bg-[#7a3000] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
                >
                  <span>{language === 'mr' ? 'पुढे सुरू ठेवा' : language === 'hi' ? 'आगे बढ़ें' : 'Continue Exploring'}</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Halts Itinerary Drawer */}
      {showHaltsDrawer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-6 pb-20 md:pb-6">
          <div className="w-full max-w-xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border border-[#e0c0b2]">
            <div className="flex justify-between items-center mb-4 border-b border-[#eee7df] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#9c3f00]">
                  {language === 'mr' ? 'अधिकृत वारी मुक्काम वेळापत्रक' : language === 'hi' ? 'आधिकारिक वारी पड़ाव समय सारणी' : 'Official Wari Halting Schedule'}
                </h3>
                <p className="text-xs text-[#584237]">
                  {language === 'mr' ? 'आळंदी ते पंढरपूर (२५० किमी पवित्र मार्ग)' : language === 'hi' ? 'आळंदी से पंढरपुर (२५० किमी पावन मार्ग)' : 'Alandi to Pandharpur (250 km sacred route)'}
                </p>
              </div>
              <button
                onClick={() => setShowHaltsDrawer(false)}
                className="p-1.5 rounded-full bg-[#eee7df] text-[#584237] hover:bg-[#dfd9d1]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {ROUTE_HALTS.map((halt) => {
                const isSelected = selectedHalt.id === halt.id;
                const coord = HALT_COORDINATES[halt.id];
                return (
                  <div
                    key={halt.id}
                    onClick={() => {
                      setSelectedHalt(halt);
                      setShowHaltsDrawer(false);
                      if (coord && mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([coord.lat, coord.lng], 13, { duration: 1 });
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#9c3f00] bg-[#ffdbcb]/40 shadow-sm'
                        : 'border-[#e0c0b2]/40 bg-[#fff8f1] hover:bg-[#f4ede5]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase bg-[#c35100] text-white px-2 py-0.5 rounded-full">
                          {language === 'mr' ? `दिवस ${halt.dayNumber}` : language === 'hi' ? `दिन ${halt.dayNumber}` : `Day ${halt.dayNumber}`}
                        </span>
                        <h4 className="text-base font-bold text-[#1e1b17] mt-1">
                          {halt.name} <span className="text-xs text-[#584237]">({halt.marathiName})</span>
                        </h4>
                        <p className="text-xs text-[#584237] mt-0.5">{halt.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#9c3f00] block">{halt.distanceFromStartKm} km</span>
                        <span className="text-[10px] text-[#584237]">{halt.remainingKm} km left</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
