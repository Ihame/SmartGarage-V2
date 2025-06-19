
import React, { useContext } from 'react';
import { ServiceCardProps, AppView, Testimonial, AuthStatus } from '../types';
import ServiceCard from './ServiceCard';
import Footer from './Footer';
import Button from './common/Button';
import { CarIcon, BatteryIcon, WrenchScrewdriverIcon, UsersIcon, ShoppingCartIcon, WrenchIcon as GarageIcon } from './common/Icon'; // PhoneArrowUpRightIcon removed
import { TESTIMONIALS_DATA } from '../constants';
import { LanguageContext, AuthContext } from '../App';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { translate } = useContext(LanguageContext);
  const { authStatus } = useContext(AuthContext);

  const services: ServiceCardProps[] = [
    {
      title: translate('navVirtualDiagnosis', "Virtual Diagnosis"),
      description: "Get a quick AI initial assessment for your EV/Hybrid. Describe the issue, provide vehicle details, and connect with an e-mechanic for a full diagnosis and service payment details.",
      price: translate('vdPriceInfo', "Full Service Involves Fee"),
      icon: <CarIcon />,
      actionText: translate('startAIDiagnosis', "Start AI Diagnosis"),
      onAction: () => onNavigate(AppView.VIRTUAL_DIAGNOSIS),
      highlight: true,
      bgColorClass: "bg-slate-800",
    },
    {
      title: translate('navBatteryPrediction', "EV & Hybrid Battery Life Prediction"),
      description: "Receive a preliminary insight into your battery's health. Provide your details, and our specialists will contact you for a more comprehensive analysis.",
      price: translate('bpPriceInfo', "Consultation Required"),
      icon: <BatteryIcon />,
      actionText: translate('learnMore', "Learn More"),
      onAction: () => onNavigate(AppView.BATTERY_PREDICTION),
      bgColorClass: "bg-slate-800",
    },
    {
      title: translate('navSparesHunter', "Spares Part Hunter"),
      description: "Need a specific EV or Hybrid part? Our Spares Part Hunter service helps you source it. Free to use!",
      price: translate('freeService', "Free Service"),
      icon: <WrenchScrewdriverIcon />,
      actionText: translate('findParts', "Find My Part"),
      onAction: () => onNavigate(AppView.SPARES_HUNTER),
      bgColorClass: "bg-slate-800",
    },
    { 
      title: translate('navCommunity', "EV Community Hub"),
      description: "View posts, car hints, and EV trends. Sign in to create posts, get news updates, maintenance reminders, and more!",
      price: translate('communityAccess', "Free to View"),
      icon: <UsersIcon />,
      actionText: authStatus === AuthStatus.AUTHENTICATED ? translate('goToCommunity', "Go to Community") : translate('loginToEngage', "Login to Engage"),
      onAction: () => {
        if (authStatus === AuthStatus.AUTHENTICATED) {
          onNavigate(AppView.COMMUNITY_HUB);
        } else {
          onNavigate(AppView.AUTH); 
        }
      },
      bgColorClass: "bg-slate-800",
    },
    // SOS Rescue Removed
    // {
    //   title: translate('navSOSRescue', "SOS Rescue"),
    //   description: "Emergency roadside assistance for your EV or Hybrid. Quick dispatch to get you back on the road safely.",
    //   price: translate('sosPriceInfo', "Service Fees Apply"),
    //   icon: <PhoneArrowUpRightIcon />,
    //   actionText: translate('learnMore', "Learn More"),
    //   onAction: () => onNavigate(AppView.SOS_RESCUE),
    //   bgColorClass: "bg-slate-800",
    // },
    {
      title: translate('navOBDShop', "OBD Info"), // Changed from OBD Shop
      description: "Learn about smart OBD-II scanners compatible with your EV/Hybrid. Request information from our team for purchasing options.",
      icon: <ShoppingCartIcon />, // Can keep or change to an InfoIcon
      actionText: translate('requestOBDInfo', "Request Info"),
      onAction: () => onNavigate(AppView.OBD_SHOP),
      bgColorClass: "bg-slate-800",
    },
    {
      title: translate('navGarageSolutions', "For Garages"),
      description: "Empower your auto shop with our Garage ERP solutions, tailored for EV & Hybrid vehicle servicing.",
      icon: <GarageIcon />,
      actionText: translate('learnMore', "Learn More"),
      onAction: () => onNavigate(AppView.GARAGE_SOLUTIONS),
      bgColorClass: "bg-slate-800",
    }
  ];

  const stats = [
    { name: translate('statEvsServiced', 'EVs Serviced in Rwanda'), value: '500+' },
    { name: translate('statHappyClients', 'Happy EV/Hybrid Owners'), value: '98%' },
    { name: translate('statPartsSourced', 'Genuine Parts Sourced'), value: '1.2K+' },
    { name: translate('statAvgResponseTime', 'Avg. Initial AI Assessment Time'), value: '<5 Mins' },
  ];

  return (
    <div className="bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900/30 to-slate-950 py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://picsum.photos/seed/evgrid/1920/1080')" }}></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="block text-white">{translate('heroHeadlinePart1', 'Your Car Speaks.')}</span>
            <span className="block text-emerald-400">{translate('heroHeadlinePart2', 'We Listen. Intelligently.')}</span>
          </h1>
          <p className="mt-6 md:mt-8 max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
            {translate('heroSubtext')}
          </p>
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              size="xl" 
              variant="primary" 
              onClick={() => onNavigate(AppView.VIRTUAL_DIAGNOSIS)}
              className="w-full sm:w-auto px-10 py-4 text-lg shadow-emerald-500/40 hover:shadow-emerald-400/60"
            >
              {translate('startAIDiagnosis')}
            </Button>
            <Button 
              size="xl" 
              variant="ghost" 
              onClick={() => onNavigate(AppView.OBD_SHOP)} // OBD_SHOP still leads to the OBD info page
              className="w-full sm:w-auto px-10 py-4 text-lg border-sky-500 text-sky-400 hover:bg-sky-500/10"
            >
              {translate('exploreOBD')} 
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-800/50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-y-10 gap-x-6 text-center md:grid-cols-4 md:gap-x-8">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col items-center">
                <dt className="order-2 mt-2 text-sm md:text-base font-medium text-slate-400">{stat.name}</dt>
                <dd className="order-1 text-4xl md:text-5xl font-extrabold text-emerald-500">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              {translate('ourServicesTitle', 'Intelligent Auto Care, Simplified')}
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              {translate('ourServicesSubtitle', 'From AI diagnostics to community support, we offer comprehensive solutions for your EV & Hybrid needs.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-slate-800/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12 md:mb-16">
            {translate('testimonialsTitle', 'Loved by EV Owners Across Rwanda')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
                <img className="w-20 h-20 rounded-full mb-4 border-2 border-emerald-500" src={testimonial.avatarUrl} alt={testimonial.name} />
                <blockquote className="text-slate-300 italic mb-4">"{testimonial.text}"</blockquote>
                <p className="font-semibold text-sky-400">{testimonial.name}</p>
                <p className="text-xs text-slate-500">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action for Garages */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">{translate('forGaragesTitle', 'Are You a Garage Owner?')}</h2>
          <p className="text-lg mb-8">
            {translate('forGaragesText', 'Partner with SmartGarage to offer cutting-edge EV services and access our advanced ERP solutions. Let\'s drive the future of auto care together.')}
          </p>
          <Button 
            variant="light" 
            size="lg" 
            onClick={() => onNavigate(AppView.GARAGE_SOLUTIONS)}
            className="text-emerald-700 font-bold hover:bg-white"
          >
            {translate('forGarages', 'Garage ERP Solutions')}
          </Button>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
