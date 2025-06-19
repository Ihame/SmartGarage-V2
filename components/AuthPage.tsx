
import React, { useState, useContext, useEffect } from 'react';
import { AppView, AuthView, UserProfile, AuthStatus } from '../types';
import Button from './common/Button';
import { AuthContext, LanguageContext } from '../App';
import { ArrowLeftIcon, LogInIcon, UserIcon as UserPlusIcon } from './common/Icon';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthPageProps {
  defaultView?: AuthView;
  onAuthSuccess: (user: UserProfile) => void; // Keeps the existing prop for navigation after success
  onNavigate: (view: AppView) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ defaultView = AuthView.LOGIN, onAuthSuccess, onNavigate }) => {
  const { translate } = useContext(LanguageContext);
  const { authStatus, currentUser: appCurrentUser } = useContext(AuthContext); // Use appCurrentUser to check if already logged in

  const [currentAuthView, setCurrentAuthView] = useState<AuthView>(defaultView);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If user is already authenticated, redirect them (e.g., to community or dashboard)
  useEffect(() => {
    if (authStatus === AuthStatus.AUTHENTICATED && appCurrentUser) {
      onAuthSuccess(appCurrentUser); // This typically navigates away
    }
  }, [authStatus, appCurrentUser, onAuthSuccess]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!email || !password) {
      setError(translate('fillAllFields'));
      return;
    }
    setIsLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setIsLoading(false);
    if (signInError) {
      console.error('Login error:', signInError.message);
      setError(signInError.message || translate('authError'));
    } else if (data.user) {
      // AuthContext listener in App.tsx will pick up the new session
      // and update currentUser, triggering onAuthSuccess via useEffect.
      setSuccessMessage(translate('loginSuccess'));
      // No need to call onAuthSuccess directly here if App.tsx handles it
    } else {
      setError(translate('authError'));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!name || !email || !password || !confirmPassword) {
      setError(translate('fillAllFields'));
      return;
    }
    if (password !== confirmPassword) {
      setError(translate('passwordMismatch'));
      return;
    }
    setIsLoading(true);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { // This data goes to auth.users.user_metadata
          full_name: name,
        }
      }
    });

    if (signUpError) {
      setIsLoading(false);
      console.error('Signup error:', signUpError.message);
      setError(signUpError.message || translate('authError'));
      return;
    }
    
    if (signUpData.user) {
      // User signed up, now create a profile in 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
            id: signUpData.user.id, 
            email: signUpData.user.email,
            full_name: name 
        });

      setIsLoading(false);
      if (profileError) {
        console.error("Error creating profile:", profileError.message);
        // User is signed up but profile creation failed. Handle this case.
        setError(translate('authError') + " (Profile creation failed. Details: " + profileError.message + ")");
        await supabase.auth.signOut(); // Attempt to sign out the user if profile creation failed critically
      } else {
        setSuccessMessage(translate('registrationSuccess') + " " + translate('loginPromptAfterRegister', "Please check your email to confirm and then login."));
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setCurrentAuthView(AuthView.LOGIN); // Switch to login view after successful registration message
      }
    } else {
      setIsLoading(false);
      setError(translate('authError', "Registration failed. User data not returned."));
    }
  };

  const commonInputClass = "mt-1 block w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm placeholder-slate-400";

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-md w-full">
         <Button variant="ghost" size="sm" onClick={() => onNavigate(AppView.LANDING)} className="mb-6 flex items-center group text-slate-400 hover:text-emerald-400 mx-auto sm:mx-0">
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:text-emerald-400 transition-colors" />
            {translate('backToHome')}
        </Button>
        <div className="bg-slate-800 p-8 shadow-2xl rounded-xl">
          <div className="text-center mb-8">
            {currentAuthView === AuthView.LOGIN ? (
              <LogInIcon className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            ) : (
              <UserPlusIcon className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            )}
            <h2 className="text-3xl font-bold text-white">
              {currentAuthView === AuthView.LOGIN ? translate('loginTitle') : translate('registerTitle')}
            </h2>
          </div>

          {error && <p className="text-red-400 bg-red-900/40 p-3 rounded-md text-sm mb-4 text-center">{error}</p>}
          {successMessage && <p className="text-green-400 bg-green-900/40 p-3 rounded-md text-sm mb-4 text-center">{successMessage}</p>}

          <form onSubmit={currentAuthView === AuthView.LOGIN ? handleLogin : handleRegister} className="space-y-5">
            {currentAuthView === AuthView.REGISTER && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">{translate('nameLabel')}</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required={currentAuthView === AuthView.REGISTER} 
                       className={commonInputClass} placeholder={translate('namePlaceholder')}/>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">{translate('emailLabel')}</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                     className={commonInputClass} placeholder={translate('emailPlaceholder')}/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">{translate('passwordLabel')}</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                     className={commonInputClass} placeholder={translate('passwordPlaceholder')}/>
            </div>
            {currentAuthView === AuthView.REGISTER && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">{translate('confirmPasswordLabel')}</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={currentAuthView === AuthView.REGISTER} 
                       className={commonInputClass} placeholder={translate('confirmPasswordPlaceholder')}/>
              </div>
            )}
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading} size="lg">
              {currentAuthView === AuthView.LOGIN ? translate('loginButton') : translate('registerButton')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setCurrentAuthView(currentAuthView === AuthView.LOGIN ? AuthView.REGISTER : AuthView.LOGIN);
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-sm text-sky-400 hover:text-sky-300 hover:underline focus:outline-none"
            >
              {currentAuthView === AuthView.LOGIN ? translate('dontHaveAccount') + " " + translate('registerButton') : translate('alreadyHaveAccount') + " " + translate('loginButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
