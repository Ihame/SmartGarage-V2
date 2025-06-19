
import React, { useState, useCallback, useMemo, useContext, useEffect, useRef } from 'react';
import { AppView, Language, UserProfile, AuthStatus, AuthView, CommunityPost as CommunityPostType, CommunityPostWithAuthorFromDB } from './types'; // Renamed UserInfo to UserProfile
import LandingPage from './components/LandingPage';
import VirtualDiagnosis from './components/VirtualDiagnosis';
import OBDShop from './components/OBDShop';
import GarageSolutionsPage from './components/GarageSolutionsPage';
import BatteryPrediction from './components/BatteryPrediction';
import SparesHunter from './components/SparesHunter';
import CommunityHub from './components/CommunityHub';
import AuthPage from './components/AuthPage';

import { TRANSLATIONS, SAMPLE_COMMUNITY_POSTS } from './constants'; // SAMPLE_COMMUNITY_POSTS will be replaced by DB fetch
import { UserIcon, ChevronDownIcon, GlobeAltIcon, SunIcon, MoonIcon, LogInIcon, LogOutIcon } from './components/common/Icon';
import { supabase } from './services/supabaseClient'; // Import Supabase client
import { Session, User } from '@supabase/supabase-js';


export const LanguageContext = React.createContext({
  language: Language.EN,
  setLanguage: (lang: Language) => {},
  translate: (key: string, defaultText?: string, vars?: Record<string, string>) => key,
});

export const AuthContext = React.createContext<{
  authStatus: AuthStatus;
  currentUser: UserProfile | null; // Changed to UserProfile
  // login/logout methods will now be handled by Supabase, direct calls in AuthPage
  // We might keep a simple logout here for convenience from header
  supabaseUser: User | null; // Store the raw Supabase user object if needed
  signOut: () => Promise<void>;
}>({
  authStatus: AuthStatus.IDLE, // Start with IDLE
  currentUser: null,
  supabaseUser: null,
  signOut: async () => {},
});

export const CommunityContext = React.createContext<{
  posts: CommunityPostType[];
  addPost: (content: string, userId: string, authorName?: string) => Promise<CommunityPostType | null>; // Updated for DB
  fetchPosts: () => Promise<void>;
  isLoadingPosts: boolean;
}>({
  posts: [],
  addPost: async () => null,
  fetchPosts: async () => {},
  isLoadingPosts: true,
});


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const supportMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Supabase Auth State
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.IDLE);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);

  // Community State
  const [communityPosts, setCommunityPosts] = useState<CommunityPostType[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Supabase Auth Listener
  useEffect(() => {
    setAuthStatus(AuthStatus.LOADING);
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user profile from 'profiles' table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows, which is fine if profile not created yet
          console.error('Error fetching profile:', error.message, error);
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          });
        } else if (profile) {
          setCurrentUser({
            id: profile.id,
            email: profile.email || session.user.email!, // email should exist on profile or auth user
            full_name: profile.full_name || session.user.email?.split('@')[0] || 'User',
            created_at: profile.created_at,
          });
        } else {
           // Profile might not exist yet if signup just happened and profile creation is pending or part of signup logic
           // Create a default one if it's really missing
            setCurrentUser({
                id: session.user.id,
                email: session.user.email!,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            });
             console.warn("User profile not found, consider creating one on signup or check RLS on profiles table.");
        }
        setAuthStatus(AuthStatus.AUTHENTICATED);
      } else {
        setCurrentUser(null);
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
       if (session?.user) {
         // Initial fetch, similar to onAuthStateChange
         supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({data: profile, error}) => {
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching initial profile:', error.message);
            }
            if (profile) setCurrentUser({id: profile.id, email: profile.email!, full_name: profile.full_name }); // email should exist
            setAuthStatus(AuthStatus.AUTHENTICATED);
         });
      } else {
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message, error);
    // onAuthStateChange will handle setting currentUser to null and status to UNAUTHENTICATED
    navigateTo(AppView.LANDING);
    setIsUserMenuOpen(false);
  };

  const authContextValue = useMemo(() => ({
    authStatus,
    currentUser,
    supabaseUser,
    signOut: handleSignOut,
  }), [authStatus, currentUser, supabaseUser]);

  // Community Context Functions
  const fetchCommunityPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select<string, CommunityPostWithAuthorFromDB>(`
        id,
        user_id,
        content,
        created_at,
        profiles!user_id (full_name, email)
      `) 
      .order('created_at', { ascending: false })
      .limit(50); 

    if (error) {
      console.error('Error fetching posts:', error.message, error);
      setCommunityPosts([]); 
    } else if (data) {
      const formattedPosts: CommunityPostType[] = data.map((post: CommunityPostWithAuthorFromDB) => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        created_at: post.created_at,
        author_name: post.profiles?.full_name || post.profiles?.email || 'Anonymous', 
      }));
      setCommunityPosts(formattedPosts);
    }
    setIsLoadingPosts(false);
  }, []);

  useEffect(() => {
    fetchCommunityPosts(); 
  }, [fetchCommunityPosts]);


  const addCommunityPost = useCallback(async (content: string, userId: string, authorName?: string): Promise<CommunityPostType | null> => {
    if (!userId) {
      console.error("User must be logged in to post.");
      return null;
    }
    const { data, error } = await supabase
      .from('community_posts')
      .insert([{ content, user_id: userId, author_name: authorName || 'User' }]) 
      .select<string, CommunityPostWithAuthorFromDB>(`
        id,
        user_id,
        content,
        created_at,
        profiles!user_id (full_name, email)
      `)
      .single();

    if (error) {
      console.error('Error adding post:', error.message, error);
      return null;
    }
    if (data) {
      const newPost: CommunityPostType = {
        id: data.id,
        user_id: data.user_id,
        content: data.content,
        created_at: data.created_at,
        author_name: data.profiles?.full_name || data.profiles?.email || authorName || 'User',
      };
      setCommunityPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    }
    return null;
  }, []);

  const communityContextValue = useMemo(() => ({
    posts: communityPosts,
    addPost: addCommunityPost,
    fetchPosts: fetchCommunityPosts,
    isLoadingPosts: isLoadingPosts,
  }), [communityPosts, addCommunityPost, fetchCommunityPosts, isLoadingPosts]);


  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navigateTo = useCallback((view: AppView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
    setIsSupportMenuOpen(false);
    setIsUserMenuOpen(false);
  }, []);

  const translate = useCallback((key: string, defaultText?: string, vars?: Record<string, string>): string => {
    let translated = TRANSLATIONS[key]?.[language] || TRANSLATIONS[key]?.[Language.EN] || defaultText || key;
    if (vars) {
      Object.keys(vars).forEach(varKey => {
        translated = translated.replace(`{${varKey}}`, vars[varKey]);
      });
    }
    return translated;
  }, [language]);

  const languageContextValue = useMemo(() => ({
    language,
    setLanguage,
    translate
  }), [language, translate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supportMenuRef.current && !supportMenuRef.current.contains(event.target as Node)) {
        setIsSupportMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const navItems = [
    { view: AppView.VIRTUAL_DIAGNOSIS, labelKey: 'navVirtualDiagnosis' },
    { view: AppView.BATTERY_PREDICTION, labelKey: 'navBatteryPrediction' },
    { view: AppView.SPARES_HUNTER, labelKey: 'navSparesHunter' },
    { view: AppView.OBD_SHOP, labelKey: 'navOBDShop' },
    { view: AppView.GARAGE_SOLUTIONS, labelKey: 'navGarageSolutions' },
    { view: AppView.COMMUNITY_HUB, labelKey: 'navCommunity' },
  ];

  const renderView = () => {
    const pageKey = `${currentView}-${currentUser?.id || 'guest'}`; 

    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage key={pageKey} onNavigate={navigateTo} />;
      case AppView.VIRTUAL_DIAGNOSIS:
        return <VirtualDiagnosis key={pageKey} onBackToHome={() => navigateTo(AppView.LANDING)} />;
      case AppView.OBD_SHOP:
        return <OBDShop key={pageKey} />;
      case AppView.GARAGE_SOLUTIONS:
        return <GarageSolutionsPage key={pageKey} onNavigate={navigateTo} />;
      case AppView.BATTERY_PREDICTION:
        return <BatteryPrediction key={pageKey} onNavigate={navigateTo} />;
      case AppView.SPARES_HUNTER:
        return <SparesHunter key={pageKey} onNavigate={navigateTo} />;
      case AppView.COMMUNITY_HUB:
        return <CommunityHub key={pageKey} onNavigate={navigateTo} />;
      case AppView.AUTH:
         return <AuthPage key={pageKey} onAuthSuccess={() => navigateTo(AppView.COMMUNITY_HUB)} onNavigate={navigateTo} defaultView={AuthView.LOGIN} />;
      default:
        return <LandingPage key="landing-default" onNavigate={navigateTo} />;
    }
  };

  if (authStatus === AuthStatus.IDLE || authStatus === AuthStatus.LOADING) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-slate-300 text-lg">Initializing SmartGarage...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
    <LanguageContext.Provider value={languageContextValue}>
    <CommunityContext.Provider value={communityContextValue}>
      <div className={`min-h-screen bg-slate-950 text-slate-200 flex flex-col transition-colors duration-300 ${theme === 'light' ? 'bg-slate-100 text-slate-900' : ''}`}>
        <header className="bg-slate-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer group"
                onClick={() => navigateTo(AppView.LANDING)}
                aria-label="SmartGarage Home"
              >
                <svg className="h-10 w-auto text-emerald-500 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                  <path d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                </svg>
                <span className="ml-2 text-2xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Smart<span className="text-sky-400">Garage</span>
                </span>
              </div>
              <nav className="hidden md:flex space-x-1 lg:space-x-2">
                {navItems.map(item => (
                  <button
                    key={item.labelKey}
                    onClick={() => navigateTo(item.view)}
                    className={`px-2.5 py-2 rounded-md text-xs lg:text-sm font-medium transition-all duration-150 ease-in-out
                      ${currentView === item.view 
                        ? 'bg-emerald-500 text-white shadow-md' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50'}`}
                  >
                    {translate(item.labelKey)}
                  </button>
                ))}
                <div className="relative" ref={supportMenuRef}>
                  <button
                    onClick={() => setIsSupportMenuOpen(prev => !prev)}
                    className={`px-2.5 py-2 rounded-md text-xs lg:text-sm font-medium flex items-center transition-all duration-150 ease-in-out
                       text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50`}
                  >
                    {translate('navSupport')}
                    <ChevronDownIcon className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isSupportMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSupportMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                        <a onClick={() => alert("FAQ page coming soon!")} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer">FAQs</a>
                        <a onClick={() => alert("Contact Us page coming soon!")} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer">Contact Us</a>
                    </div>
                  )}
                </div>
              </nav>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="p-1.5 lg:p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  {theme === 'dark' ? <SunIcon className="w-4 h-4 lg:w-5 lg:h-5" /> : <MoonIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
                </button>
                <button
                  onClick={() => setLanguage(lang => lang === Language.EN ? Language.RW : Language.EN)}
                  className="p-1.5 lg:p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors flex items-center"
                  aria-label="Toggle language"
                >
                  <GlobeAltIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                   <span className="ml-1 text-xs font-semibold">{language === Language.EN ? 'RW' : 'EN'}</span>
                </button>
                
                {authStatus === AuthStatus.AUTHENTICATED && currentUser ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(prev => !prev)}
                      className="p-1 lg:p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors flex items-center"
                      aria-label="User menu"
                    >
                      <UserIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                      <ChevronDownIcon className={`w-3 h-3 lg:w-4 lg:h-4 ml-0.5 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                        <div className="px-4 py-3 border-b border-slate-700">
                          <p className="text-xs text-slate-400">{translate('signedInAs')}</p>
                          <p className="text-sm font-medium text-white truncate">{currentUser.full_name || currentUser.email}</p>
                        </div>
                        <a onClick={() => { alert("Profile page coming soon!"); setIsUserMenuOpen(false); }}
                           className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer">
                          {translate('navMyProfile', 'My Profile')}
                        </a>
                        <a onClick={handleSignOut}
                           className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 cursor-pointer w-full text-left">
                           <LogOutIcon className="w-4 h-4 mr-2" />{translate('navLogout', 'Logout')}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => navigateTo(AppView.AUTH)}
                    className="p-1.5 lg:p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                    aria-label={translate('navLogin', 'Login')}
                  >
                    <LogInIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                )}
              </div>
              <div className="md:hidden flex items-center">
                 <button 
                    onClick={() => alert("Mobile menu coming soon!")} 
                    className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                    aria-label="Open main menu"
                  >
                   <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                 </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-grow relative">
          <div className="page-enter page-enter-active"> 
            {renderView()}
          </div>
        </main>
      </div>
    </CommunityContext.Provider>
    </LanguageContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
