export type UserRole = 'pilgrim' | 'volunteer' | 'ngo' | 'medical' | 'camp_manager';
export type AppLanguage = 'mr' | 'hi' | 'en';
export type NavigationTab = 'map' | 'connect' | 'sos' | 'guide' | 'profile' | 'seva' | 'camp' | 'sos_monitor';
export type OnboardingStep = 'login' | 'setup' | 'completed';

export interface UserProfile {
  uid?: string;
  fullName: string;
  email?: string;
  age: number | string;
  role: UserRole; // primary active role
  roles: UserRole[]; // all selected roles (multiple selection)
  language: AppLanguage;
  bloodGroup: string;
  emergencyName: string;
  emergencyMobile: string;
  isRegistered: boolean;
  isLoggedIn: boolean;
  avatarUrl: string;
  documentUploaded?: string;
  offlineMapDownloaded: boolean;
  dindiNumber?: string;
  volunteerBadgeId?: string;
}

export interface CampOffering {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  enabled: boolean;
}

export interface CampData {
  id: string;
  name: string;
  locationName: string;
  sector: string;
  status: 'available' | 'busy' | 'closed';
  openingTime: string;
  closingTime: string;
  offerings: CampOffering[];
  crowdLevel: 'low' | 'moderate' | 'high';
  pilgrimsHelpedToday: number;
  activeVolunteers: number;
  mealsServed: number;
  medicalPatients: number;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  type: 'medical' | 'shelter' | 'water' | 'lost_person' | 'general';
  icon: string;
  urgency: 'high' | 'moderate' | 'standard';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'unassigned' | 'resolved';
  distanceText: string;
  locationText: string;
  timeAgo: string;
  mapImage?: string;
  userName: string;
  userId?: string;
  userPhone: string;
  description: string;
  latitude?: number;
  longitude?: number;
  assignedVolunteer?: string;
  acceptedByVolunteerId?: string;
  acceptedByVolunteerName?: string;
  acceptedByVolunteerPhone?: string;
  acceptedAt?: string;
  completedAt?: string;
  createdAt?: string;
  resolutionNotes?: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  readTime: string;
  heroImage: string;
  secondaryImage?: string;
  summary: string;
  content: {
    heading?: string;
    paragraphs: string[];
    quote?: {
      text: string;
      source: string;
    };
    infoBox?: {
      title: string;
      text: string;
    };
    bulletPoints?: {
      title?: string;
      items: { title?: string; text: string; icon?: string }[];
    };
  }[];
  audio?: {
    title: string;
    duration: string;
    audioUrl?: string;
  };
  samadhiLocation?: {
    title: string;
    description: string;
    image: string;
  };
}

export interface MapService {
  id: string;
  name: string;
  type: 'food' | 'medical' | 'shelter' | 'halt' | 'water';
  categoryLabel: string;
  distance: string;
  walkTime: string;
  hours: string;
  isVerified: boolean;
  crowdDensity: number; // 0 - 100
  crowdLabel: 'Low Crowding' | 'Moderate Crowding' | 'High Crowding';
  phone: string;
  features: string[];
  description: string;
  lat: number;
  lng: number;
}

export interface RouteHalt {
  id: string;
  name: string;
  marathiName: string;
  distanceFromStartKm: number;
  remainingKm: number;
  dayNumber: number;
  dateStr: string;
  palkhiArrival: string;
  palkhiDeparture: string;
  description: string;
  keyTemples: string[];
}

export interface VolunteerTask {
  id: string;
  pilgrimName: string;
  pilgrimId: string;
  priority: 'High Priority' | 'Standard';
  avatarUrl: string;
  primaryNeed: string;
  description: string;
  tags: string[];
  locationText: string;
  distanceText: string;
  mapImage: string;
  phone: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface DindiPost {
  id: string;
  author: string;
  dindiNumber: string;
  timeAgo: string;
  content: string;
  tag?: string;
  likes: number;
}

export interface VerifiedVolunteer {
  id: string;
  name: string;
  marathiName?: string;
  hindiName?: string;
  volunteerId: string;
  roleTitle: string;
  roleTitleMr?: string;
  roleTitleHi?: string;
  category: 'medical' | 'water_food' | 'lost_found' | 'route_guide' | 'mobility';
  categoryLabel: string;
  avatarUrl: string;
  phone: string;
  isVerified: boolean;
  status: 'available' | 'on_duty' | 'busy';
  statusLabel: string;
  distanceText: string;
  locationText: string;
  currentSector: string;
  haltName: string;
  specialties: string[];
  languages: string[];
  pilgrimsHelped: number;
  rating: number;
  about: string;
  aboutMr?: string;
  aboutHi?: string;
  dindiAffiliation?: string;
  badgeLevel: string;
  mapImage: string;
}

export interface CrowdZone {
  id: string;
  name: string;
  marathiName?: string;
  hindiName?: string;
  sector: string;
  sectorMr?: string;
  sectorHi?: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  level: 'orange' | 'yellow';
  color: string;
  crowdCount: string;
  densityPercentage: number;
  statusText: string;
  statusTextMr?: string;
  statusTextHi?: string;
  speedText: string;
  recommendation: string;
  recommendationMr?: string;
  recommendationHi?: string;
  reportedTime: string;
  activeVolunteers: number;
}

