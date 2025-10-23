



import type { FC, SVGProps, Dispatch, SetStateAction } from 'react';

// Core Navigation
export type Page = 'marketplace' | 'admin' | 'writer' | 'lab' | 'enterprise-evolution' | 'sobre' | 'affiliate' | 'biioon-studio' | 'writer-reforco' | 'writer-cinematic' | 'minha-conta' | 'writer-audio';
export type SimulationMode = 'none' | 'visitor' | 'user' | 'specialist';
export type Language = 'pt' | 'en';
export type AdminTab = 'dashboard' | 'users' | 'branding' | 'crm' | 'devlog' | 'content' | 'support' | 'biioonBrain' | 'subscribers' | 'resolutions' | 'featuredCards' | 'database' | 'integrations' | 'architecture' | 'products' | 'domains';
export type BrainTab = 'diagnostics' | 'knowledge';

// Translations
export type TranslationsBundle = { 
    pt: { [key: string]: string };
    en: { [key: string]: string };
};

// User & Plans
export type PlanTier = 'Master' | 'Advance' | 'Enterprise' | 'Enterprise Evolution' | 'Reforco Escolar';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'specialist';
  plan: PlanTier;
  features: {
    writerMyAccess: boolean;
    documentScannerAccess: boolean;
    apiAccess: boolean;
  };
  isActive: boolean;
  credits: number;
  activeSessionId?: string;
  lastLoginTimestamp?: number;
}

// Marketplace
export type MarketplaceProductType = 'digital' | 'physical' | 'software' | 'url';

export interface MarketplaceProduct {
  id: string;
  name: string;
  description: string;
  price: string; // Stored as a string like "99,90"
  type: MarketplaceProductType;
  imageUrl: string;
  stripePriceId?: string; // Optional, for direct Stripe integration
  externalUrl?: string; // For 'url' type products
  isVisible: boolean;
}


// Payments
// Removed PaymentGateway as it is no longer used in the simplified flow.

// Chat
export enum ChatMode {
  TEXT = 'text',
  API = 'api'
}

export enum MessageContentType {
  TEXT = 'text',
  LOADING_TEXT = 'loading_text',
  IMAGE = 'image',
  LOADING_IMAGE = 'loading_image',
  GIF = 'gif',
  CAROUSEL = 'carousel',
  LOADING_CAROUSEL = 'loading_carousel',
}

interface BaseMessage {
  id: string;
  role: 'user' | 'model';
  prompt?: string;
}

export interface TextMessage extends BaseMessage {
  type: MessageContentType.TEXT | MessageContentType.LOADING_TEXT;
  content: string;
  attachment?: {
    url: string; // data URL of the image
  };
}

export interface ImageMessage extends BaseMessage {
    type: MessageContentType.IMAGE | MessageContentType.LOADING_IMAGE;
    content: string; // URL or loading message
    alt: string;
}

export interface GifMessage extends BaseMessage {
    type: MessageContentType.GIF;
    content: string; // URL
    alt: string;
}

export interface CarouselSlide {
    id: string;
    title: string;
    description: string;
    imagePrompt: string;
    imageUrl?: string;
    isLoadingImage: boolean;
}

export interface CarouselMessage extends BaseMessage {
    type: MessageContentType.CAROUSEL | MessageContentType.LOADING_CAROUSEL;
    slides: CarouselSlide[];
    content?: string; // for loading message
}

export type ChatMessage = TextMessage | ImageMessage | GifMessage | CarouselMessage;

// Content Templates
export interface ContentTemplate {
  icon?: FC<SVGProps<SVGSVGElement>>;
  title: string;
  prompt: string;
}

// Resolutions (for Admin Panel)
export interface Resolution {
    id:string;
    userId: string;
    date: string;
    type: string;
    user: string;
    prompt: string;
    parameters: {
        targetAudience: string;
        toneOfVoice: string;
        objective: string;
    };
    result: {
        type: 'text' | 'image';
        content: string;
    };
    aiAnalysis: {
        strategy: string;
        toneAnalysis: string;
        metrics: {
            generationTime: string;
            tokensUsed: number;
            confidence: number;
        };
    };
    isActive: boolean;
    order: number;
}


// Branding & Global Settings
export type ProductId = 'writerMy' | 'documentScanner' | 'apiEnterprise' | 'enterpriseEvolution' | 'biioonStudio' | 'writerReforco' | 'writerCinematic' | 'writerAudio';
export type BrandingProductId = ProductId | 'logoUrl' | 'faviconUrl' | 'featuredProducts';

export interface ProductBranding {
    url: string;
    visible: boolean;
}

export interface FeaturedProduct {
    id: string;
    iconUrl: string;
    title: string;
    description: string;
    href: string;
    visible: boolean;
}

export interface ProductLaunchConfig {
    id: ProductId;
    visible: boolean;
}

export interface GlobalSettings {
    brandingAssets: {
        logoUrl: string;
        faviconUrl: string;
        writerMy: ProductBranding;
        documentScanner: ProductBranding;
        apiEnterprise: ProductBranding;
        enterpriseEvolution: ProductBranding;
        biioonStudio: ProductBranding;
        writerReforco: ProductBranding;
        writerCinematic: ProductBranding;
        writerAudio: ProductBranding;
        featuredProducts: FeaturedProduct[];
        launchProducts: ProductLaunchConfig[];
        comingSoonProducts: ProductLaunchConfig[];
    };
    isUserBrandingEnabled: boolean;
    isAffiliateProgramEnabled: boolean;
}

// Lab & Team
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
}

export interface AIModel {
    id: string;
    name: string;
    version: string;
    description: string;
    status: 'Ativo' | 'Treinamento' | 'Descontinuado';
}

export interface HardwareComponent {
    id: string;
    name: string;
    version: string;
    status: 'Protótipo' | 'Produção' | 'Descontinuado';
}

export interface LabProject {
    id: string;
    name: string;
    description: string;
    status: 'Planejamento' | 'Em Desenvolvimento' | 'Concluído';
    budget: number;
    startDate: string;
    team: TeamMember[];
    relatedAIModels: AIModel[];
    relatedHardware?: HardwareComponent[];
    progress: number;
    technologies?: string[];
    keyFindings?: string;
    documentationFile?: {
        name: string;
        content: string;
    };
}

// DevLog
export interface DevLogEntry {
    id: string;
    date: string;
    titleKey: string;
    categoryKey: 'feature' | 'architecture' | 'bugfix';
    summaryKey: string;
    userRequestKey: string;
    resolutionKey: string;
    enhancementSuggestionsKey: string;
    devPromptKey: string;
}

// CRM
export interface Customer {
    id: string;
    name: string;
    email: string;
    company: string;
    plan: PlanTier;
    lastActivity: string;
}

export interface CampaignContent {
    subject: string;
    body: string;
    strategy: string;
}

export interface BatchCampaignResult {
    email: string;
    name: string;
    subject: string;
    body: string;
}

// Affiliates
export interface Affiliate {
    id: string;
    userId: string;
    name: string;
    email: string;
    code: string;
    commissionRate: number;
    clicks: number;
    conversions: number;
    isActive: boolean;
}

export interface PlatformIntegration {
  id: string;
  name: string;
  logoUrl: string;
  apiKey: string;
  docsUrl: string;
  category: 'tool' | 'ai' | 'payment' | 'hosting' | 'database';
  isActive: boolean; // Represents connection status
  isCore?: boolean;
}

export interface GcpIntegration {
    connected: boolean;
    projectId: string;
}

export interface BiioonProductAPI {
  id:string;
  name: string;
  apiKey: string;
  url: string;
}

export interface AIControlMessage {
  role: 'user' | 'model';
  content: string;
}

export interface MarketplacePreviewProduct {
    type: 'product';
    name: string;
    description: string;
    price: string;
}

export interface UIChangePreview {
    type: 'ui_change';
    component: string;
    property: string;
    value: string;
    description: string;
}

export type AIPredictionPreview = MarketplacePreviewProduct | UIChangePreview;

export interface UserProject {
    id: string;
    userId: string;
    name: string;
    type: 'architecture' | 'studio';
    content: any;
    createdAt: string;
    updatedAt: string;
}

export interface Domain {
    id: string;
    domainName: string;
    status: 'pending' | 'connected';
    verificationRecord: {
        type: 'TXT';
        host: string;
        value: string;
    };
    aRecords: {
        type: 'A';
        host: string;
        value: string;
    }[];
}


// Biioon Brain / Health Check
export type ServiceStatus = 'operational' | 'degraded' | 'outage';

export interface ServiceEvent {
    timestamp: string;
    message: string;
    status: ServiceStatus;
}

export interface ServiceStatusDetail {
    latency: number; // in ms
    uptime: string; // percentage string e.g., "99.98%"
    eventLog: ServiceEvent[];
}

export interface ServiceHealth {
    id: string;
    name: string;
    status: ServiceStatus;
    details: ServiceStatusDetail;
}

export interface EvolutionSuggestion {
    title: string;
    description: string;
    prompt: string;
}

export interface UIReconfigurationSuggestion {
    id: string;
    title: string;
    description: string;
    change: {
        type: 'SET_VISIBILITY';
        target: BrandingProductId;
        payload: {
            visible: boolean;
        }
    }
}

export interface SuggestionAnalysis {
    benefits: string[];
    implementationSteps: string[];
    effort: 'low' | 'medium' | 'high';
    architecturePrompt: string;
}

export type KnowledgeItemType = 'file' | 'text' | 'code' | 'api' | 'prompt';

export interface KnowledgeItem {
    id: string;
    type: KnowledgeItemType;
    createdAt: string;

    // For dynamic items added by user
    name?: string;
    content?: string;

    // For static, system-provided items
    nameKey?: string;
    contentKey?: string;
    isStatic?: boolean;

    // For upload status of dynamic items
    status: 'uploading' | 'processing' | 'learned' | 'error';
    progress?: number;
    errorMessage?: string;
    metadata?: {
        language?: string; // for code
        endpoint?: string; // for api
    };
}


export interface BiioonBrainChatMessage {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
  suggestion?: EvolutionSuggestion;
  uiSuggestion?: UIReconfigurationSuggestion;
  preview?: AIPredictionPreview;
}

// ========================================================================
// ARCHITECTURE & STUDIO TYPES
// ========================================================================

export type NodeType = 'api' | 'frontend' | 'database' | 'service' | 'library' | 'topic' | 'processor' | 'warehouse' | 'secret';

export interface ArchitectureNode {
    id: string;
    label: string;
    type: NodeType;
    position: { x: number, y: number };
    techRationale?: string;
    codeSnippet?: string;
}

export interface SoftwareArchitecture {
    nodes: ArchitectureNode[];
    edges: { id: string; from: string; to: string }[];
}

export interface CodeChange {
    file: string;
    content: string;
}

export interface ArchitectureChatMessage {
  role: 'user' | 'model';
  content: string;
  isSuggestion?: boolean;
}

export interface StudioChatMessage {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
}

// ========================================================================
// GITHUB & DEPLOYMENT TYPES
// ========================================================================

export interface GitHubUser {
  login: string;
  avatar_url: string;
  [key: string]: any;
}

export interface GitHubRepo {
  id: number;
  name: string;
  owner: {
    login: string;
  };
  [key: string]: any;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  html_url: string;
}

export interface DeployActivity {
  id: string;
  source: 'github';
  commitHash: string;
  commitMessage: string;
  status: 'completed' | 'in_progress' | 'queued' | 'failed';
  duration: string;
  timestamp: string;
  url: string;
}

export interface CloudBuildHistory {
    id: string;
    commitSha: string;
    status: 'SUCCESS' | 'FAILURE' | 'WORKING' | 'QUEUED' | 'CANCELLED';
    startTime: string;
    finishTime: string | null;
    logUrl: string;
}

// Page & Component Props
export interface LaboratorioPageProps {
  onGoBack: () => void;
  canGoBack: boolean;
  user: User | null;
  projects: LabProject[];
  models: AIModel[];
}

export interface SubscribersTabProps {
    // No props needed for now, it will fetch its own data.
}

export interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<MarketplaceProduct, 'id'>) => Promise<void>;
    product: MarketplaceProduct | null;
}


export interface WriterMyPageProps {
  onGoBack: () => void;
  canGoBack: boolean;
  user: User | null;
  brandingAssets?: GlobalSettings['brandingAssets'];
  onUpdateBrandingAsset: (id: BrandingProductId, asset: Partial<ProductBranding>) => void;
  isUserBrandingEnabled: boolean;
  onAddResolution: (res: Omit<Resolution, 'id' | 'isActive' | 'date' | 'order'>) => void;
  onLoginClick: () => void;
  onWatchPreview: (videoId: string) => void;
}

export interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, pass: string) => Promise<void>;
    onRegister: (name: string, email: string, pass: string) => Promise<void>;
    onForgotPasswordClick: () => void;
    isClosable?: boolean;
}

export interface PasswordResetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPasswordReset: (email: string) => Promise<void>;
}

export interface AffiliatePageProps {
    onGoBack: () => void;
    canGoBack: boolean;
    currentUser: User | null;
    affiliates: Affiliate[];
}

export interface MinhaContaPageProps {
    onGoBack: () => void;
    canGoBack: boolean;
    currentUser: User | null;
    onNavigate: (page: Page) => void;
}

export interface EnterpriseEvolutionPageProps {
    onGoBack: () => void;
    canGoBack: boolean;
    user: User | null;
    onAddResolution: (res: Omit<Resolution, 'id' | 'isActive' | 'date' | 'order'>) => void;
}

export interface BiioonStudioPageProps {
    onGoBack: () => void;
    canGoBack: boolean;
    user: User | null;
    onNavigate: (page: Page) => void;
}


export type ReforcoTheme = 'default' | 'encantado' | 'aventura' | 'espacial' | 'natureza' | 'superheroi';
export type AIPersona = 'friend' | 'parent' | 'teacher';
export type ReforcoTab = 'chat' | 'caderno';

export interface StudentWork {
    id: string;
    userId: string;
    title: string;
    content: string;
    prompt?: string;
    createdAt: string;
}

export interface WriterReforcoPageProps {
    onGoBack: () => void;
    canGoBack: boolean;
    user: User | null;
}

export interface WriterReforcoInstanceProps {
    user: User | null;
    onGoBack?: () => void; 
    canGoBack?: boolean;
    // State managed by parent
    messages: ChatMessage[];
    studentWork: StudentWork[];
    theme: ReforcoTheme;
    persona: AIPersona;
    activeTab: ReforcoTab;
    isLoading: boolean;
    undoableWorkId: string | null;
    // Handlers
    onThemeChange: (theme: ReforcoTheme) => void;
    onPersonaChange: (persona: AIPersona) => void;
    onTabChange: (tab: ReforcoTab) => void;
    onSendMessage: (text: string, imageBase64?: string) => Promise<void>;
    onSaveWork: (message: ChatMessage) => void;
    onDeleteWork: (workId: string) => void;
    onUndoSave: () => void;
}

export interface WriterCinematicPageProps {
    onGoBack: () => void;
    canGoBack: boolean;
    user: User | null;
    onUpdateCredits: (newTotal: number) => Promise<void>;
    onPurchaseCredits: (amount: number) => Promise<void>;
}

export interface WriterAudioPageProps {
    onGoBack: () => void;
    canGoBack: boolean;
    user: User | null;
    onUpdateCredits: (newTotal: number) => Promise<void>;
    onPurchaseCredits: (amount: number) => Promise<void>;
}


export interface BuyCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPurchase: (amount: number) => void;
}


export interface PricingPlan {
  name: PlanTier | string; // Allow product names too
  price: string;
  pricePeriod: string;
  description: string;
  features: string[];
  ctaText: string;
  isRecommended: boolean;
  icon?: FC<SVGProps<SVGSVGElement>>; // Made optional for product plans
  youtubeVideoId: string;
}

export interface PricingTiersProps {
  onPurchasePlan: (plan: PricingPlan | MarketplaceProduct) => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onWatchPreview: (videoId: string) => void;
  productIds?: ProductId[];
}

export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: PricingPlan | null;
    onProcessPayment: () => void;
    isLoading: boolean;
}

export interface YouTubeModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string | null;
    onConfirmPurchase?: () => void;
}

// FIX: Added missing AdminPageProps interface definition.
export interface AdminPageProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  resolutions: Resolution[];
  customers: Customer[];
  resolutionsLoading: boolean;
  customersLoading: boolean;
  onDeleteResolution: (id: string) => void;
  onSwapResolutionOrder: (id1: string, id2: string) => void;
  globalSettings: GlobalSettings | null;
  onUpdateBrandingAsset: (id: BrandingProductId, asset: Partial<ProductBranding | { url: string }> | FeaturedProduct[]) => Promise<void>;
  onUpdateGlobalBranding: (updates: Partial<Pick<GlobalSettings, 'isUserBrandingEnabled' | 'isAffiliateProgramEnabled'>> & { logoUrl?: string; faviconUrl?: string; }) => Promise<void>;
  onUpdateLaunchSettings: (settings: { launchProducts: ProductLaunchConfig[], comingSoonProducts: ProductLaunchConfig[] }) => Promise<void>;
  onAddResolution: (res: Omit<Resolution, 'id' | 'isActive' | 'date' | 'order'>) => void;
  siteTranslations: TranslationsBundle;
  onTranslationsUpdate: (newTranslations: TranslationsBundle) => Promise<void>;
  devLog: DevLogEntry[];
}

export interface ArchitectureGeneratorProps {
  onGoBack: () => void;
  canGoBack: boolean;
  user: User | null;
  onAddResolution: (res: Omit<Resolution, 'id' | 'isActive' | 'date' | 'order'>) => void;
}

export interface StudioInstanceProps {
    projectFiles: { path: string; content: string }[];
    onFilesChange: (files: { path: string; content: string }[]) => void;
    messages: StudioChatMessage[];
// FIX: Cannot find namespace 'React'. Corrected by removing the 'React.' namespace prefix, as 'Dispatch' and 'SetStateAction' are already imported.
    onMessagesChange: Dispatch<SetStateAction<StudioChatMessage[]>>;
    user: User | null;
}

export interface StudioDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export interface StudioGcpDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (serviceName: string) => void;
  isLoading: boolean;
}

export interface GitHubConnectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    integration: PlatformIntegration;
    onUpdate: () => void;
}