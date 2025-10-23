




import React, { useState, useEffect, useCallback } from 'react';
// FIX: Added 'Resolution' to the import from './types.ts' to support the new onAddResolution handler.
import type { Page, User, GlobalSettings, SimulationMode, PlanTier, PricingPlan, Language, MarketplaceProduct, Resolution } from './types.ts';
import {
  subscribeToAuthChanges,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  sendPasswordReset,
  getGlobalSettings,
  updateUserPlan,
  getUserProfile,
  MOCK_USERS,
  getTranslations,
  // FIX: Added 'addResolution' to the import from './services/database.ts' to be used in the new handler.
  addResolution,
} from './services/database.ts';
import { isFirebaseEnabled, functions } from './services/firebase.ts';
import { httpsCallable } from "firebase/functions";

import Header from './components/Header.tsx';
import LoginModal from './components/LoginModal.tsx';
import PasswordResetModal from './components/PasswordResetModal.tsx';
import DevControlPanel from './components/DevControlPanel.tsx';
import YouTubeModal from './components/YouTubeModal.tsx';
import FullScreenLoader from './components/FullScreenLoader.tsx';
import { LanguageContext } from './context/LanguageContext.tsx';
import { allTranslations } from './i18n/index.ts';

// Dynamic Page Imports
import MarketplacePage from './pages/MarketplacePage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import WriterMyPage from './pages/WriterMyPage.tsx';
import LaboratorioPage from './pages/LaboratorioPage.tsx';
import { EnterpriseEvolutionPage } from './pages/EnterpriseEvolutionPage.tsx';
import SobrePage from './pages/SobrePage.tsx';
import AffiliatePage from './pages/AffiliatePage.tsx';
import BiioonStudioPage from './pages/BiioonStudioPage.tsx';
import WriterReforcoPage from './pages/WriterReforcoPage.tsx';
import WriterCinematicPage from './pages/WriterCinematicPage.tsx';
import WriterAudioPage from './pages/WriterAudioPage.tsx';
import MinhaContaPage from './pages/MinhaContaPage.tsx';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('marketplace');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('none');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('biioon_language') as Language) || 'pt';
  });
  
  const [translations, setTranslations] = useState(allTranslations);
  
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [planToPurchase, setPlanToPurchase] = useState<PricingPlan | MarketplaceProduct | null>(null);

  useEffect(() => {
    localStorage.setItem('biioon_language', language);
  }, [language]);

  const simulatedUser = MOCK_USERS.find(u => {
      if (simulationMode === 'visitor') return false;
      if (simulationMode === 'user') return u.role === 'user';
      if (simulationMode === 'specialist') return u.role === 'specialist';
      return false; // for 'none'
  });

  const effectiveUser = simulationMode === 'none' ? currentUser : (simulatedUser || null);

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
      const langDict = translations[language] || allTranslations[language];
      let translation = langDict[key] || allTranslations['pt'][key] || key;

      if (options) {
          Object.keys(options).forEach(optionKey => {
              const regex = new RegExp(`{${optionKey}}`, 'g');
              translation = translation.replace(regex, String(options[optionKey]));
          });
      }
      return translation;
  }, [translations, language]);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [settings, dynamicTranslations] = await Promise.all([
                getGlobalSettings(),
                getTranslations(),
            ]);
            
            if (settings) setGlobalSettings(settings);
            const mergedTranslations = {
                pt: { ...allTranslations.pt, ...(dynamicTranslations.pt || {}) },
                en: { ...allTranslations.en, ...(dynamicTranslations.en || {}) },
            };
            setTranslations(mergedTranslations);
        } catch (error) {
            console.error("Failed to fetch initial app data:", error);
        }
    };
    
    fetchInitialData();

    if (isFirebaseEnabled) {
      const unsubscribe = subscribeToAuthChanges(user => {
        setCurrentUser(user);
        setIsAuthLoading(false);
      });
      return () => unsubscribe();
    } else {
      setCurrentUser(MOCK_USERS.find(u => u.role === 'admin') || null);
      setIsAuthLoading(false);
      return () => {};
    }
  }, []);

  const handleNavigate = useCallback((page: Page) => {
     const protectedPages: Page[] = ['admin', 'lab', 'affiliate', 'enterprise-evolution', 'biioon-studio', 'writer-reforco', 'writer-cinematic', 'writer-audio', 'minha-conta'];
     if (protectedPages.includes(page) && !effectiveUser) {
        setLoginModalOpen(true);
        return;
     }

     if (page === 'admin' && effectiveUser?.role !== 'admin') {
         alert(t('alert_admin_only'));
         return;
     }
     
     if (protectedPages.includes(page) && effectiveUser?.role !== 'admin' && !effectiveUser?.isActive) {
        alert(t('alert_account_inactive'));
        return;
     }

      if (page === 'lab' && !['specialist', 'admin'].includes(effectiveUser?.role || '')) {
         alert(t('alert_specialist_only'));
         return;
     }

     const evolutionOnlyPages: Page[] = ['enterprise-evolution', 'biioon-studio', 'writer-cinematic', 'writer-audio'];
     if (evolutionOnlyPages.includes(page) && effectiveUser?.plan !== 'Enterprise Evolution' && effectiveUser?.role !== 'admin') {
         alert(t('alert_plan_evolution_only'));
         return;
     }
     
     if (page === 'writer-reforco' && !['Enterprise Evolution', 'Reforco Escolar'].includes(effectiveUser?.plan || '') && effectiveUser?.role !== 'admin') {
        alert(t('alert_plan_reforco_or_evolution_only'));
        return;
     }

    setActivePage(page);
  }, [effectiveUser, t]);
  
  // FIX: Added handlers for `onGoBack` and `canGoBack` props required by some page components.
  const handleGoBack = useCallback(() => {
    handleNavigate('marketplace');
  }, [handleNavigate]);
  const canGoBack = activePage !== 'marketplace';

  const handleLogin = (email: string, pass: string) => loginWithEmail(email, pass);
  const handleRegister = (name: string, email: string, pass: string) => registerWithEmail(name, email, pass);
  const handleLogout = () => logoutUser();
  const handlePasswordReset = (email: string) => sendPasswordReset(email);
  
  // FIX: Added handler for onAddResolution to pass down to child components that need to log AI activities.
  const handleAddResolution = async (res: Omit<Resolution, 'id' | 'isActive' | 'date' | 'order'>) => {
    if (!currentUser) return;
    try {
        const resolutionWithOrder = { ...res, order: Date.now() };
        await addResolution(currentUser.id, resolutionWithOrder);
    } catch (error) {
        console.error("Failed to add resolution:", error);
    }
  };

  const handlePurchasePlan = (plan: PricingPlan | MarketplaceProduct) => {
      if (!currentUser) {
          setLoginModalOpen(true);
          return;
      }
      setPlanToPurchase(plan);
      const videoId = 'youtubeVideoId' in plan ? plan.youtubeVideoId : 'GFQ2N8_IafE'; // Default video
      setCurrentVideoId(videoId);
      setIsYouTubeModalOpen(true);
  };
  
  const handleWatchPreview = (videoId: string) => {
    setCurrentVideoId(videoId);
    setPlanToPurchase(null);
    setIsYouTubeModalOpen(true);
  };

  const initiatePaymentForSelectedPlan = async () => {
    if (!planToPurchase || !currentUser) return;
    setIsYouTubeModalOpen(false);
    
    // In mock mode, for dynamic products we just show an alert. For plans, we update the user's plan.
    if (!isFirebaseEnabled || !functions) {
      if ('pricePeriod' in planToPurchase) { // It's a PricingPlan
        await updateUserPlan(currentUser.id, planToPurchase.name as PlanTier);
        alert(`(Modo Offline) Plano ${planToPurchase.name} atualizado com sucesso!`);
        const profile = await getUserProfile(currentUser.id);
        if (profile) setCurrentUser({ ...currentUser, ...profile });
      } else { // It's a MarketplaceProduct
         alert(`(Modo Offline) Compra de "${planToPurchase.name}" simulada com sucesso!`);
      }
      setPlanToPurchase(null);
      return;
    }

    try {
      const priceInCents = Math.round(parseFloat(planToPurchase.price.replace(/[^0-9,]/g, '').replace(',', '.')) * 100);
      const isSubscription = 'pricePeriod' in planToPurchase;

      const createStripeCheckoutSession = httpsCallable(functions, 'createStripeCheckoutSession');
      const result = await createStripeCheckoutSession({
          planName: planToPurchase.name,
          planPrice: priceInCents,
          userId: currentUser.id,
          isSubscription: isSubscription,
      });
      const checkoutUrl = (result.data as { url: string | null })?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Could not retrieve Stripe checkout URL.");
      }
    } catch (error) {
        console.error("Cloud function error:", error);
        alert("Ocorreu um erro ao iniciar o pagamento. Por favor, tente novamente.");
    } finally {
      setPlanToPurchase(null);
    }
  };

  const pageProps = {
    user: effectiveUser,
    onNavigate: handleNavigate,
    globalSettings,
    onLoginClick: () => setLoginModalOpen(true),
    onWatchPreview: handleWatchPreview,
  };

  const pageMap: Record<Page, React.ReactElement> = {
    'marketplace': <MarketplacePage {...pageProps} onPurchasePlan={handlePurchasePlan} brandingAssets={globalSettings?.brandingAssets || null} />,
    'admin': <AdminPage user={effectiveUser} onNavigate={handleNavigate} />,
    'writer': <WriterMyPage onNavigate={handleNavigate} user={effectiveUser} globalSettings={globalSettings} onLoginClick={() => setLoginModalOpen(true)} onWatchPreview={handleWatchPreview} />,
    'lab': <LaboratorioPage onNavigate={handleNavigate} user={effectiveUser} />,
    // FIX: Pass the required 'onGoBack', 'canGoBack', and 'onAddResolution' props to satisfy the 'EnterpriseEvolutionPageProps' type.
    'enterprise-evolution': <EnterpriseEvolutionPage onGoBack={handleGoBack} canGoBack={canGoBack} user={effectiveUser} onAddResolution={handleAddResolution} />,
    // FIX: Pass the required `onGoBack` and `canGoBack` props to satisfy the `BiioonStudioPageProps` type.
    'biioon-studio': <BiioonStudioPage onGoBack={handleGoBack} canGoBack={canGoBack} user={effectiveUser} onNavigate={handleNavigate} />,
    // FIX: Pass the required `onGoBack` and `canGoBack` props to satisfy the `WriterReforcoPageProps` type.
    'writer-reforco': <WriterReforcoPage onGoBack={handleGoBack} canGoBack={canGoBack} user={effectiveUser} />,
    'writer-cinematic': <WriterCinematicPage onNavigate={handleNavigate} user={effectiveUser} />,
    'writer-audio': <WriterAudioPage onNavigate={handleNavigate} user={effectiveUser} />,
    'sobre': <SobrePage onNavigate={handleNavigate} />,
    'affiliate': <AffiliatePage onNavigate={handleNavigate} user={effectiveUser} />,
    // FIX: Pass the required `onGoBack`, `canGoBack`, and `currentUser` props to satisfy the `MinhaContaPageProps` type.
    'minha-conta': <MinhaContaPage onGoBack={handleGoBack} canGoBack={canGoBack} currentUser={effectiveUser} onNavigate={handleNavigate} />,
  };
  
  const renderPage = () => pageMap[activePage] || pageMap['marketplace'];
  
  const renderLoginScreen = () => (
    <div className="flex flex-col min-h-screen text-white items-center justify-center">
      <LoginModal
        isOpen={!isPasswordResetModalOpen}
        isClosable={false}
        onClose={() => {}} // Non-closable
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPasswordClick={() => setPasswordResetModalOpen(true)}
      />
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setPasswordResetModalOpen(false)}
        onPasswordReset={handlePasswordReset}
      />
    </div>
  );

  const renderAppContent = () => (
     <div className="flex flex-col min-h-screen text-white">
        <Header
          activePage={activePage}
          onNavigate={handleNavigate}
          currentUser={effectiveUser}
          onLoginClick={() => setLoginModalOpen(true)}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 flex flex-col">{renderPage()}</main>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onForgotPasswordClick={() => {
            setLoginModalOpen(false);
            setPasswordResetModalOpen(true);
          }}
        />
        <PasswordResetModal
          isOpen={isPasswordResetModalOpen}
          onClose={() => setPasswordResetModalOpen(false)}
          onPasswordReset={handlePasswordReset}
        />
        <YouTubeModal
          isOpen={isYouTubeModalOpen}
          onClose={() => {
              setIsYouTubeModalOpen(false);
              setPlanToPurchase(null);
              setCurrentVideoId(null);
          }}
          videoId={currentVideoId}
          {...(planToPurchase && { onConfirmPurchase: initiatePaymentForSelectedPlan })}
        />
        
        {currentUser?.role === 'admin' && (
          <DevControlPanel
            simulationMode={simulationMode}
            onSimulationChange={setSimulationMode}
            onNavigate={handleNavigate}
          />
        )}
      </div>
  );

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {isAuthLoading ? <FullScreenLoader /> : !effectiveUser ? renderLoginScreen() : renderAppContent()}
    </LanguageContext.Provider>
  );
};

export default App;