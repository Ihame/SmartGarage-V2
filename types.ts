
export enum AppView {
  LANDING = 'LANDING',
  VIRTUAL_DIAGNOSIS = 'VIRTUAL_DIAGNOSIS', 
  OBD_SHOP = 'OBD_SHOP',
  GARAGE_SOLUTIONS = 'GARAGE_SOLUTIONS',
  BATTERY_PREDICTION = 'BATTERY_PREDICTION', 
  SPARES_HUNTER = 'SPARES_HUNTER', 
  COMMUNITY_HUB = 'COMMUNITY_HUB',
  AUTH = 'AUTH', 
}

export enum VirtualDiagnosisStep {
  SELECT_MODEL_BRAND_VIN = 'SELECT_MODEL_BRAND_VIN', 
  DESCRIBE_ISSUE = 'DESCRIBE_ISSUE',
  SUBMITTING_DIAGNOSIS = 'SUBMITTING_DIAGNOSIS',
  VIEW_AI_REPORT = 'VIEW_AI_REPORT',
  EMECHANIC_CONSULTATION_PAYMENT_INFO = 'EMECHANIC_CONSULTATION_PAYMENT_INFO', 
  CONTACT_FOR_EMECHANIC = 'CONTACT_FOR_EMECHANIC',
  FINAL_CONFIRMATION_PAYMENT_CODE = 'FINAL_CONFIRMATION_PAYMENT_CODE', 
}

export interface PotentialProblem {
  problem: string;
  confidence: 'High' | 'Medium' | 'Low' | string;
  details: string;
}

export interface ImmediateCheck {
  check: string;
  instructions: string;
  toolsNeeded?: string;
}

export interface ProfessionalRecommendation {
  action: string;
  reasoning: string;
}

export interface StructuredDiagnosisReport {
  potentialProblems: PotentialProblem[];
  immediateChecks: ImmediateCheck[];
  professionalRecommendations: ProfessionalRecommendation[];
  estimatedUrgency: string;
  summary: string;
  imageAnalysisNotes?: string;
  disclaimer?: string;
}

export interface DiagnosisData {
  // Supabase fields
  id?: number; // DB ID
  user_id?: string | null; // Supabase auth user ID
  status?: string; // e.g., 'pending', 'e-mechanic contacted'
  created_at?: string;

  // Form fields
  carBrand: string | null; 
  carModel: string | null;
  vin?: string; 
  issueDescription: string;
  dashboardPhoto?: File | null;
  dashboardPhotoBase64?: string | null; // For display, actual file upload to Supabase storage is separate
  diagnosisReport?: StructuredDiagnosisReport | string | null; // AI report (JSONB or text)
  contactEmail?: string;
  contactPhone?: string;
}

export interface BatteryPredictionData {
  // Supabase fields
  id?: number;
  user_id?: string | null;
  status?: string;
  created_at?: string;

  // Form fields
  carModel_text: string | null; // Storing as text
  mileage: string;
  avgDrivingDistance: string;
  chargingMethod: string | null;
  preliminaryInsight?: string | null; // Not stored in DB directly, just UI
  contactEmail?: string;
  contactPhone?: string;
}

export interface SparesHunterData {
  // Supabase fields
  id?: number;
  user_id?: string | null;
  status?: string;
  created_at?: string;

  // Form fields
  partDescription: string;
  carBrand?: string | null;
  carModel?: string | null; 
  partPhoto?: File | null;
  partPhotoBase64?: string | null; // For display
  contactEmail?: string;
  contactPhone?: string;
}


export interface ServiceCardProps {
  title: string;
  description: string;
  price?: string;
  icon: React.ReactNode;
  actionText: string;
  onAction: () => void;
  bgColorClass?: string;
  textColorClass?: string;
  highlight?: boolean;
  navigateTo?: AppView;
  isFree?: boolean;
}

export interface FooterLink {
  name: string;
  href?: string;
  action?: () => void;
  appView?: AppView;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  avatarUrl: string;
}

export enum Language {
  EN = 'en',
  RW = 'rw',
}

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export interface OBDProduct {
  id: string; // Internal ID, not DB primary key unless products are also in DB
  name: string;
  description: string;
  price: number; 
  imageUrl: string;
  features: string[];
  compatibility: string;
}

export interface OBDInquiryData {
  // Supabase fields
  id?: number; // DB id
  user_id?: string | null;
  status?: string;
  created_at?: string;

  // Form fields
  productId: string; // from OBDProduct.id
  productName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message?: string;
}


export interface StepConfig {
  id: VirtualDiagnosisStep;
  titleKey: string;
  fields?: (keyof DiagnosisData)[];
}

// Auth related types
export interface UserProfile { // Renamed from UserInfo to avoid conflict with Supabase User
  id: string; // Supabase auth.users.id (UUID)
  full_name?: string;
  email: string; // Usually from auth.user.email
  // Add any other profile fields you want to store in your 'profiles' table
  created_at?: string;
}

export enum AuthStatus {
  IDLE = 'IDLE', // Initial state before checking auth
  LOADING = 'LOADING', // Actively checking auth state (e.g. on page load)
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}

export enum AuthView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

// Community Hub types
export interface CommunityPost {
  id?: number; // DB id
  user_id: string; // Supabase auth.users.id
  author_name?: string; // From UserProfile or auth.user.user_metadata.full_name
  content: string;
  created_at?: Date | string; // Supabase returns string, can be Date object in app
}

export interface CommunityPostWithAuthorFromDB {
  id: number;
  user_id: string;
  content: string;
  created_at: string; // Supabase typically returns ISO string
  profiles: { // This structure matches the Supabase join `profiles (full_name, email)`
    full_name: string | null;
    email: string | null; // Email might be available on profile if you store it there
  } | null; // profiles can be null if join fails or no profile
}


export interface CarBrand {
  name: string;
  models: string[];
}

// Garage Solutions Demo Request
export interface GarageDemoRequestData {
  id?: number;
  user_name: string;
  garage_name: string;
  email: string;
  phone?: string;
  status?: string;
  created_at?: string;
}