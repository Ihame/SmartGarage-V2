
import React, { useContext, useState } from 'react';
import { AppView, FAQItem, ContactInquiryData } from '../types';
import { LanguageContext, AuthContext } from '../App';
import Button from './common/Button';
import { UsersIcon, WrenchIcon, BatteryIcon, CheckCircleIcon, GlobeAltIcon as GlobeIcon, ArrowLeftIcon, MailIcon, PhoneIcon, ChevronDownIcon, ChevronUpIcon, PaperAirplaneIcon, UserIcon as UserFormIcon } from './common/Icon'; 
import { SAMPLE_FAQS, TRANSLATIONS } from '../constants';
import { supabase } from '../services/supabaseClient';

interface AboutUsPageProps {
  onNavigate: (view: AppView) => void;
}

const ValueCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="bg-slate-800 p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
    <div className="text-emerald-400 w-12 h-12 mx-auto mb-4 flex items-center justify-center flex-shrink-0">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm flex-grow">{description}</p>
  </div>
);

const FAQAccordionItem: React.FC<{ faq: FAQItem, translate: (key: string) => string }> = ({ faq, translate }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-slate-700/50 hover:bg-slate-600/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-md font-medium text-sky-300 text-left">{translate(faq.questionKey)}</span>
        {isOpen ? <ChevronUpIcon className="w-5 h-5 text-slate-400" /> : <ChevronDownIcon className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-800 text-slate-300 text-sm leading-relaxed">
          {translate(faq.answerKey)}
        </div>
      )}
    </div>
  );
};

const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  const { translate, language } = useContext(LanguageContext);
  const { currentUser } = useContext(AuthContext);

  const [contactForm, setContactForm] = useState<Partial<ContactInquiryData>>({
    name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    message: ''
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactFormError, setContactFormError] = useState<string | null>(null);
  const [contactFormSuccess, setContactFormSuccess] = useState<string | null>(null);

  const values = [
    { titleKey: 'valueInnovation', descKey: 'valueInnovationDesc', icon: <BatteryIcon className="w-8 h-8 text-emerald-400" /> },
    { titleKey: 'valueCustomerCentricity', descKey: 'valueCustomerCentricityDesc', icon: <UsersIcon className="w-8 h-8 text-emerald-400" /> },
    { titleKey: 'valueIntegrity', descKey: 'valueIntegrityDesc', icon: <CheckCircleIcon className="w-8 h-8 text-emerald-400" /> },
    { titleKey: 'valueSustainability', descKey: 'valueSustainabilityDesc', icon: <GlobeIcon className="w-8 h-8 text-emerald-400" /> },
    { titleKey: 'valueCollaboration', descKey: 'valueCollaborationDesc', icon: <UsersIcon className="w-8 h-8 text-emerald-400" /> },
  ];

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setContactFormError(null);
    setContactFormSuccess(null);
  };

  const validateContactForm = (): boolean => {
    if (!contactForm.name?.trim() || !contactForm.email?.trim() || !contactForm.message?.trim()) {
      setContactFormError(translate('fillAllFields'));
      return false;
    }
    if (contactForm.email && !/\S+@\S+\.\S+/.test(contactForm.email)) {
      setContactFormError(translate('invalidEmailFormat'));
      return false;
    }
    setContactFormError(null);
    return true;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContactForm()) return;

    setIsContactSubmitting(true);
    setContactFormError(null);
    setContactFormSuccess(null);

    const inquiryToSave = {
      name: contactForm.name!,
      email: contactForm.email!,
      message: contactForm.message!,
      status: 'new',
    };

    const { error } = await supabase
      .from('contact_inquiries') // Make sure this table exists in your Supabase project
      .insert([inquiryToSave]);

    setIsContactSubmitting(false);
    if (error) {
      console.error("Error submitting contact inquiry:", error);
      setContactFormError(translate('contactFormError') + ` (${error.message})`);
    } else {
      setContactFormSuccess(translate('contactFormSuccess'));
      setContactForm({ name: currentUser?.full_name || '', email: currentUser?.email || '', message: '' }); // Reset form
    }
  };
  
  const inputBaseClass = "w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm placeholder-slate-400";
  const inputWithIconClass = `${inputBaseClass} pl-10`;

  return (
    <div className="bg-slate-900 text-slate-200">
      {/* Back to Home Button */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
         <Button variant="ghost" size="sm" onClick={() => onNavigate(AppView.LANDING)} className="flex items-center group text-slate-400 hover:text-emerald-400">
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:text-emerald-400 transition-colors" />
            {translate('backToHome')}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-sky-900/50 to-emerald-900/30 py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-4xl mx-auto">
          <WrenchIcon className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            {translate('aboutUsTitle', 'Who We Are')}
          </h1>
          <p className="mt-6 md:mt-8 max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
            {translate('aboutUsHeroSubtext', 'SmartGarage is dedicated to providing intelligent, reliable, and accessible care for Electric and Hybrid vehicles.')}
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 md:py-24 bg-slate-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
          <div className="text-center md:text-left md:pr-8">
            <h2 className="text-3xl font-bold text-emerald-400 mb-4">{translate('ourMission', 'Our Mission')}</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              {translate('ourMissionText')}
            </p>
          </div>
          <div className="text-center md:text-right md:pl-8">
            <h2 className="text-3xl font-bold text-sky-400 mb-4">{translate('ourVision', 'Our Vision')}</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              {translate('ourVisionText')}
            </p>
          </div>
        </div>
      </section>
      
      {/* Why Focus on Batteries Section */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <BatteryIcon className="w-16 h-16 text-emerald-500 mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              {translate('whyBatteries', 'Our Focus on EV & Hybrid Batteries')}
            </h2>
          </div>
          <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl prose prose-lg prose-invert max-w-none mx-auto text-slate-300 leading-relaxed">
            <p>{translate('whyBatteriesText')}</p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-24 bg-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-16">
            {translate('ourValues', 'Our Values')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {values.map(value => (
              <ValueCard 
                key={value.titleKey}
                title={translate(value.titleKey)}
                description={translate(value.descKey)}
                icon={value.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section - Placeholder */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <UsersIcon className="w-16 h-16 text-sky-400 mx-auto mb-5" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            {translate('ourTeam', 'Our Team')}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            {translate('ourTeamText')}
          </p>
           <div className="mt-8 flex justify-center">
            <img src="https://picsum.photos/seed/smartgarageteam/800/450" alt={translate('ourTeam')} className="rounded-xl shadow-xl w-full max-w-2xl object-cover h-64 md:h-80"/>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12">
            {translate('faqTitle', 'Frequently Asked Questions')}
          </h2>
          <div className="space-y-4">
            {SAMPLE_FAQS.map((faq, index) => (
              <FAQAccordionItem key={index} faq={faq} translate={translate} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <MailIcon className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              {translate('contactUsTitle', 'Get in Touch')}
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
              {translate('contactUsInfo', 'Have questions or want to learn more? Reach out to us!')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Contact Info */}
            <div className="space-y-6 bg-slate-800 p-8 rounded-xl shadow-xl">
              <div>
                <h3 className="text-xl font-semibold text-sky-300 mb-2">{translate('ourEmail', 'Our Email')}</h3>
                <a href="mailto:info@smartgarage.rw" className="text-emerald-400 hover:text-emerald-300 transition-colors text-md">info@smartgarage.rw</a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sky-300 mb-2">{translate('ourPhone', 'Our Phone')}</h3>
                <a href="tel:+250788000000" className="text-emerald-400 hover:text-emerald-300 transition-colors text-md">+250 788 000 000 (Placeholder)</a>
              </div>
              {/* Placeholder for address or map if needed later
              <div>
                <h3 className="text-xl font-semibold text-sky-300 mb-2">Our Office</h3>
                <p className="text-slate-400 text-md">KN 3 Rd, Kigali, Rwanda (Placeholder)</p>
              </div>
              */}
            </div>

            {/* Contact Form */}
            <div className="bg-slate-800 p-8 rounded-xl shadow-xl">
              <form onSubmit={handleContactSubmit} className="space-y-5">
                {contactFormError && <p className="text-red-400 bg-red-900/30 p-3 rounded-md text-sm text-center">{contactFormError}</p>}
                {contactFormSuccess && <p className="text-green-400 bg-green-900/30 p-3 rounded-md text-sm text-center">{contactFormSuccess}</p>}
                
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-1">{translate('nameLabel')}</label>
                  <div className="relative">
                     <UserFormIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="name" id="contact-name" value={contactForm.name || ''} onChange={handleContactFormChange} required 
                            className={inputWithIconClass} placeholder={translate('namePlaceholder')}/>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-1">{translate('emailLabel')}</label>
                   <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" name="email" id="contact-email" value={contactForm.email || ''} onChange={handleContactFormChange} required 
                            className={inputWithIconClass} placeholder={translate('emailPlaceholder')}/>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-1">{translate('messagePlaceholder', 'Your message here...')}</label>
                  <textarea name="message" id="contact-message" value={contactForm.message || ''} onChange={handleContactFormChange} rows={4} required 
                            className={`${inputBaseClass} py-2`} placeholder={translate('messagePlaceholder')}></textarea>
                </div>
                <Button type="submit" variant="primary" fullWidth isLoading={isContactSubmitting} size="lg" leftIcon={<PaperAirplaneIcon className="w-5 h-5"/>}>
                  {translate('sendMessage', 'Send Message')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">{translate('learnMoreAboutServices', 'Learn More About Our Services')}</h2>
          <Button 
            variant="light" 
            size="xl" 
            onClick={() => onNavigate(AppView.LANDING)}
            className="text-emerald-700 font-bold hover:bg-white px-10 py-4 text-lg"
          >
            {translate('exploreServices', 'Explore Services')} 
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;