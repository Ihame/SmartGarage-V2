
import React, { useContext } from 'react';
import { FooterSection, FooterLink, AppView } from '../types';
import { LanguageContext } from '../App';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { translate } = useContext(LanguageContext);

  const footerData: FooterSection[] = [
    {
      title: "Company",
      links: [
        { name: "About Us", action: () => alert("About Us page coming soon!") },
        { name: "Careers", action: () => alert("Careers page coming soon!") },
        { name: "Press", action: () => alert("Press page coming soon!") },
      ],
    },
    {
      title: "Services",
      links: [
        { name: translate('navVirtualDiagnosis', "Virtual Diagnosis"), appView: AppView.VIRTUAL_DIAGNOSIS },
        { name: translate('navBatteryPrediction', "Battery Prediction"), appView: AppView.BATTERY_PREDICTION },
        { name: translate('navSparesHunter', "Spares Part Hunter"), appView: AppView.SPARES_HUNTER },
        { name: translate('navOBDShop', "OBD Info"), appView: AppView.OBD_SHOP },
      ],
    },
     {
      title: "For Garages",
      links: [
        { name: translate('navGarageSolutions', "Garage ERP"), appView: AppView.GARAGE_SOLUTIONS },
        { name: "Partner Program", action: () => alert("Partner Program details coming soon!") },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "FAQs", action: () => alert("FAQs page coming soon!") },
        // { name: translate('navSOSRescue', "SOS Rescue"), appView: AppView.SOS_RESCUE }, // Removed
        { name: "Contact Us", action: () => alert("Contact Us page coming soon!") },
        { name: "Privacy Policy", action: () => alert("Privacy Policy page coming soon!") },
        { name: "Terms of Service", action: () => alert("Terms of Service page coming soon!") },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {footerData.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul role="list" className="mt-4 space-y-3">
                {section.links.map((link: FooterLink) => (
                  <li key={link.name}>
                    <button
                      onClick={() => link.appView ? onNavigate(link.appView) : (link.action ? link.action() : undefined)}
                      className="text-base text-slate-400 hover:text-emerald-400 transition-colors duration-150 text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-slate-700 pt-8 text-center">
          <p className="text-base text-slate-400">
            &copy; {new Date().getFullYear()} SmartGarage. All rights reserved. {/* Updated V2 to general name */}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Pioneering Intelligent Automotive Solutions in Africa.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
