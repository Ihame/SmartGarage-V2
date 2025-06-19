import React, { useContext } from 'react';
import { LanguageContext } from '../App'; // For translation
import Button from './common/Button'; // If needed for a CTA like "Notify Me"
import { AppView } from '../types';

interface PlaceholderPageProps {
  title: string; // Already translated title passed as prop
  description: string; // Already translated description
  icon?: React.ReactNode; // Optional icon for the page
  // onNavigate: (view: AppView) => void; // If there's a back button or other navigation
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon }) => {
  const { translate } = useContext(LanguageContext);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-md w-full space-y-8 text-center p-8 bg-slate-800 rounded-xl shadow-2xl">
        {icon && <div className="mx-auto w-16 h-16 text-emerald-400 mb-6">{icon}</div>}
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-3">
            {title}
          </h1>
          <p className="mt-2 text-md text-slate-300">
            {description}
          </p>
        </div>
        <div className="mt-8">
            <p className="text-xl font-semibold text-sky-400 animate-pulse">
                {translate('comingSoon', 'Feature Coming Soon!')}
            </p>
        </div>
        {/* Optional: Add a "Notify Me" button or link back to home */}
        {/* 
        <div className="mt-6">
          <Button 
            onClick={() => alert("Notification feature coming soon!")}
            variant="secondary"
          >
            Notify Me When Available
          </Button>
        </div> 
        */}
      </div>
    </div>
  );
};

export default PlaceholderPage;
