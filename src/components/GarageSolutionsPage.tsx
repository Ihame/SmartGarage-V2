
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../App';
import Button from './common/Button';
import Modal from './common/Modal';
import { AppView, GarageDemoRequestData } from '../types'; 
import { WrenchIcon, UsersIcon, CheckCircleIcon, CarIcon, BatteryIcon, WrenchScrewdriverIcon, MailIcon, PhoneIcon, UserIcon as UserFormIcon } from './common/Icon';
import { supabase } from '../services/supabaseClient';
import { TRANSLATIONS } from '../constants';


interface GarageSolutionsPageProps {
  onNavigate: (view: AppView) => void;
}

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="bg-slate-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
    <div className="text-emerald-400 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);


const GarageSolutionsPage: React.FC<GarageSolutionsPageProps> = ({ onNavigate }) => {
  const { translate, language } = useContext(LanguageContext);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState<Partial<GarageDemoRequestData>>({ user_name: '', garage_name: '', email: '', phone: '' });
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDemoForm({ ...demoForm, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const validateDemoForm = (): boolean => {
    if (!demoForm.user_name?.trim() || !demoForm.garage_name?.trim() || !demoForm.email?.trim()) {
      setFormError(translate('fillAllFields'));
      return false;
    }
    if (demoForm.email && !/\S+@\S+\.\S+/.test(demoForm.email)) {
        setFormError(translate('invalidEmailFormat'));
        return false;
    }
    // Phone is optional, but if provided, validate it (simple Rwandan format example)
    if (demoForm.phone && !/^07[2389]\d{7}$/.test(demoForm.phone)) {
        setFormError(translate('invalidPhoneFormat'));
        return false;
    }
    setFormError(null);
    return true;
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDemoForm()) return;

    setIsDemoSubmitting(true);
    const requestToSave = {
      user_name: demoForm.user_name!,
      garage_name: demoForm.garage_name!,
      email: demoForm.email!,
      phone: demoForm.phone || null,
      status: 'pending review',
    };

    const { data: dbData, error: dbError } = await supabase
      .from('garage_demo_requests')
      .insert([requestToSave])
      .select()
      .single();

    setIsDemoSubmitting(false);
    if (dbError) {
      console.error("Error submitting demo request to Supabase:", dbError);
      setFormError(translate('errorDbSave', 'Failed to submit demo request. ') + dbError.message);
    } else {
      console.log("Demo Request Submitted to Supabase:", dbData);
      setDemoForm(prev => ({...prev, id: dbData.id, created_at: dbData.created_at, status: dbData.status}));
      setIsDemoSubmitted(true); 
      setTimeout(() => {
          setIsDemoModalOpen(false);
          // Reset relevant states after modal is closed
          setTimeout(() => {
            setIsDemoSubmitted(false); 
            setDemoForm({ user_name: '', garage_name: '', email: '', phone: '' }); 
          }, 300); // Allow modal to fully close before resetting
      }, 3500);
    }
  };

  const features = [
    { titleKey: 'garageFeatureAIDiagnostics', description: translate('garageFeatureAIDiagnosticsDesc', "Integrate CarDoctor AI directly into your workflow for faster, more accurate EV/Hybrid diagnostics."), icon: <CarIcon className="w-8 h-8"/> },
    { titleKey: 'garageFeatureAppointments', description: translate('garageFeatureAppointmentsDesc', "Smart scheduling for customers, optimized for technician availability and EV charging times."), icon: <UsersIcon className="w-8 h-8"/> },
    { titleKey: 'garageFeatureInventory', description: translate('garageFeatureInventoryDesc', "Manage specialized EV and Hybrid parts inventory with predictive ordering and supplier integration."), icon: <WrenchScrewdriverIcon className="w-8 h-8"/> },
    { titleKey: 'garageFeatureCRM', description: translate('garageFeatureCRMDesc', "Build lasting customer relationships with EV-specific service history, reminders, and communication tools."), icon: <UsersIcon className="w-8 h-8"/> },
    { titleKey: 'garageFeatureWorkflow', description: translate('garageFeatureWorkflowDesc', "Optimize technician tasks, track job progress, and ensure quality control for complex EV repairs."), icon: <WrenchIcon className="w-8 h-8"/> },
    { titleKey: 'garageFeatureAnalytics', description: translate('garageFeatureAnalyticsDesc', "Gain insights into your garage's performance with detailed reports on EV services, parts usage, and customer trends."), icon: <BatteryIcon className="w-8 h-8"/> },
  ];
  
  const inputBaseClass = "w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm placeholder-slate-400";
  const inputWithIconClass = `${inputBaseClass} pl-10`;


  return (
    <div className="bg-slate-900 py-12 md:py-16">
      <section className="text-center py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-800/70">
        <div className="max-w-4xl mx-auto">
          <WrenchIcon className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            {translate('garageSolutionsTitle')}
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {translate('garageSolutionsHero')}
          </p>
          <Button 
            size="xl" 
            variant="primary" 
            onClick={() => { setIsDemoModalOpen(true); setIsDemoSubmitted(false); setFormError(null); setDemoForm({ user_name: '', garage_name: '', email: '', phone: '' });}}
            className="px-10 py-4 text-lg"
          >
            {translate('requestDemo')}
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{translate('garageFeaturesTitle', 'Key Features of Our Garage ERP')}</h2>
            <p className="mt-3 text-lg text-slate-400 max-w-xl mx-auto">
              {translate('garageFeaturesSubtitle', 'Built from the ground up for the unique needs of electric and hybrid vehicle servicing.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(feature => (
              <FeatureCard 
                key={feature.titleKey}
                title={translate(feature.titleKey)}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-slate-800">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">{translate('garageReadyTransformTitle', 'Ready to Transform Your Garage?')}</h2>
          <p className="text-lg text-slate-300 mb-8">
            {translate('garageReadyTransformDesc', "Let's discuss how SmartGarage ERP can help you stay ahead in the evolving automotive landscape.")}
          </p>
          <Button 
            size="lg" 
            variant="accent" 
             onClick={() => { setIsDemoModalOpen(true); setIsDemoSubmitted(false); setFormError(null); setDemoForm({ user_name: '', garage_name: '', email: '', phone: '' });}}
          >
            {translate('requestDemo')}
          </Button>
        </div>
      </section>

      <Modal 
        isOpen={isDemoModalOpen} 
        onClose={() => {
            setIsDemoModalOpen(false);
            // Delay resetting form to allow modal animation to complete
            setTimeout(() => {
                setIsDemoSubmitted(false); 
                setDemoForm({ user_name: '', garage_name: '', email: '', phone: '' });
                setFormError(null);
            }, 300);
        }} 
        title={translate('requestDemo')}
        size="lg"
      >
        {isDemoSubmitted ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{translate('thankYou')}</h3>
            <p className="text-slate-300">{translate('demoRequestSubmitted')}</p>
            {demoForm.id && <p className="text-xs text-slate-500 mt-1">Request ID: {demoForm.id}</p>}
          </div>
        ) : (
          <form onSubmit={handleDemoSubmit} className="space-y-5">
            {formError && <p className="text-red-400 bg-red-900/30 p-2 rounded-md text-xs text-center">{formError}</p>}
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-slate-300 mb-1">{translate('yourName')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <UserFormIcon className="h-5 w-5 text-slate-400" /> </div>
                <input type="text" name="user_name" id="user_name" value={demoForm.user_name || ''} onChange={handleInputChange} required 
                        className={inputWithIconClass} placeholder={translate('namePlaceholder')} />
              </div>
            </div>
            <div>
              <label htmlFor="garage_name" className="block text-sm font-medium text-slate-300 mb-1">{translate('garageName')}</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <WrenchIcon className="h-5 w-5 text-slate-400" /> </div>
                <input type="text" name="garage_name" id="garage_name" value={demoForm.garage_name || ''} onChange={handleInputChange} required
                        className={inputWithIconClass} placeholder={translate('garageName')} />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">{translate('emailAddress')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <MailIcon className="h-5 w-5 text-slate-400" /> </div>
                <input type="email" name="email" id="email" value={demoForm.email || ''} onChange={handleInputChange} required
                        className={inputWithIconClass}
                        placeholder={TRANSLATIONS.emailPlaceholder[language]} />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">{translate('phoneNumber')} ({translate('optional', 'Optional')})</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <PhoneIcon className="h-5 w-5 text-slate-400" /> </div>
                <input type="tel" name="phone" id="phone" value={demoForm.phone || ''} onChange={handleInputChange}
                        className={inputWithIconClass} 
                        placeholder="078XXXXXXX"/>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => {
                    setIsDemoModalOpen(false);
                    setTimeout(() => {
                        setIsDemoSubmitted(false); 
                        setDemoForm({ user_name: '', garage_name: '', email: '', phone: '' });
                        setFormError(null);
                    }, 300);
                }} disabled={isDemoSubmitting} className="w-full sm:w-auto" size="lg">
                    {translate('close')}
                </Button>
                <Button type="submit" variant="primary" isLoading={isDemoSubmitting} disabled={isDemoSubmitting} className="w-full sm:w-auto" size="lg">
                    {translate('submit')}
                </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default GarageSolutionsPage;
