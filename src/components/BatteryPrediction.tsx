
import React, { useState, useContext, useEffect } from 'react';
import { AppView, BatteryPredictionData, Language, UserProfile } from '../types';
import { CAR_BRANDS_MODELS, CHARGING_METHODS, TRANSLATIONS } from '../constants';
import Button from './common/Button';
import { LanguageContext, AuthContext } from '../App'; // AuthContext for user ID
import { ArrowLeftIcon, CheckCircleIcon, MailIcon, PhoneIcon, BatteryIcon as PageIcon, InformationCircleIcon } from './common/Icon';
import { supabase } from '../services/supabaseClient';

interface BatteryPredictionProps {
  onNavigate: (view: AppView) => void;
}

enum PredictionStep {
  DETAILS = 'DETAILS',
  PRELIMINARY_INSIGHT = 'PRELIMINARY_INSIGHT',
  CONTACT_INFO = 'CONTACT_INFO',
  CONFIRMATION = 'CONFIRMATION',
}

const BatteryPrediction: React.FC<BatteryPredictionProps> = ({ onNavigate }) => {
  const { translate, language } = useContext(LanguageContext);
  const { currentUser } = useContext(AuthContext);

  const [step, setStep] = useState<PredictionStep>(PredictionStep.DETAILS);
  const [data, setData] = useState<BatteryPredictionData>({
    carModel_text: CAR_BRANDS_MODELS[0].models[0], 
    mileage: '',
    avgDrivingDistance: '',
    chargingMethod: CHARGING_METHODS[0],
    contactEmail: currentUser?.email || '',
    contactPhone: '',
    user_id: currentUser?.id || undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setData(prev => ({
        ...prev,
        contactEmail: prev.contactEmail || currentUser.email,
        user_id: currentUser.id
      }));
    }
  }, [currentUser]);

  const handleChange = (field: keyof BatteryPredictionData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateDetails = (): boolean => {
    if (!data.carModel_text || data.carModel_text === CAR_BRANDS_MODELS[0].models[0] || data.carModel_text.toLowerCase().includes("select")) {
      setError(translate('errorSelectModel'));
      return false;
    }
    if (!data.mileage || isNaN(parseFloat(data.mileage)) || parseFloat(data.mileage) < 0) {
      setError(translate('errorInvalidMileage'));
      return false;
    }
    if (!data.avgDrivingDistance.trim()) {
      setError(translate('errorInvalidDrivingDistance'));
      return false;
    }
    if (!data.chargingMethod || data.chargingMethod === CHARGING_METHODS[0]) {
      setError(translate('errorSelectChargingMethod'));
      return false;
    }
    setError(null);
    return true;
  };
  
  const validateContact = (): boolean => {
    if (!data.contactEmail?.trim() && !data.contactPhone?.trim()) {
      setError(translate('pleaseProvideContact'));
      return false;
    }
    if (data.contactEmail && !/\S+@\S+\.\S+/.test(data.contactEmail)) {
        setError(translate('invalidEmailFormat'));
        return false;
    }
    if (data.contactPhone && !/^07[2389]\d{7}$/.test(data.contactPhone)) {
        setError(translate('invalidPhoneFormat'));
        return false;
    }
    setError(null);
    return true;
  };

  const saveBatteryRequestToSupabase = async () => {
    setIsLoading(true);
    const requestToSave = {
      user_id: currentUser?.id || null,
      car_model_text: data.carModel_text,
      mileage: data.mileage,
      avg_driving_distance: data.avgDrivingDistance,
      charging_method: data.chargingMethod,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      status: 'pending specialist review',
    };

    const { data: dbData, error: dbError } = await supabase
      .from('battery_requests')
      .insert([requestToSave])
      .select()
      .single();

    setIsLoading(false);
    if (dbError) {
      console.error('Error saving battery request to Supabase:', dbError);
      setError(translate('errorDbSave', 'Failed to save your request. ') + dbError.message);
      return false;
    }
    console.log('Battery request saved:', dbData);
    setData(prev => ({...prev, id: dbData.id, status: dbData.status, created_at: dbData.created_at}));
    return true;
  };

  const handleNextStep = async () => {
    switch (step) {
      case PredictionStep.DETAILS:
        if (validateDetails()) {
          setIsLoading(true);
          // Simulate getting preliminary insight (can be replaced with actual API call if needed later)
          setTimeout(() => { 
            setData(prev => ({ ...prev, preliminaryInsight: translate('bpGenericInsight') }));
            setIsLoading(false);
            setStep(PredictionStep.PRELIMINARY_INSIGHT);
          }, 700); // Short delay for simulation
        }
        break;
      case PredictionStep.PRELIMINARY_INSIGHT:
        setStep(PredictionStep.CONTACT_INFO);
        break;
      case PredictionStep.CONTACT_INFO:
        if(validateContact()){
            const saved = await saveBatteryRequestToSupabase();
            if (saved) {
                setStep(PredictionStep.CONFIRMATION);
            }
            // If not saved, error is already set by saveBatteryRequestToSupabase
        }
        break;
    }
  };

  const inputBaseClass = "mt-1 block w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400";
  const inputWithIconClass = `${inputBaseClass} pl-10`;

  const renderStepContent = () => {
    switch (step) {
      case PredictionStep.DETAILS:
        return (
          <form className="space-y-5">
            <div>
              <label htmlFor="carModel_text" className="block text-sm font-medium text-slate-300 mb-1">{translate('vdSelectCarModel')}</label>
              <select id="carModel_text" value={data.carModel_text || ''} onChange={(e) => handleChange('carModel_text', e.target.value)}
                className={inputBaseClass}>
                <option value="" disabled>{translate('vdSelectCarModel')}</option>
                {/* Show a curated list of common models, not all brands and models */}
                {CAR_BRANDS_MODELS.flatMap(brand => brand.models.filter(model => !model.toLowerCase().includes("select ") && !model.toLowerCase().includes("first select"))).slice(0,20) // Example: show first 20 non-placeholder models
                 .map(model => <option key={model} value={model}>{model}</option>)}
                 <option value="Other EV/Hybrid Model">{translate('otherEVHybridModel', 'Other EV/Hybrid Model')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="mileage" className="block text-sm font-medium text-slate-300 mb-1">{translate('bpMileage')}</label>
              <input type="number" id="mileage" value={data.mileage} onChange={(e) => handleChange('mileage', e.target.value)} placeholder={TRANSLATIONS.bpMileagePlaceholder?.[language] || "e.g., 50000"}
                className={inputBaseClass} />
            </div>
            <div>
              <label htmlFor="avgDrivingDistance" className="block text-sm font-medium text-slate-300 mb-1">{translate('bpAvgDriving')}</label>
              <input type="text" id="avgDrivingDistance" value={data.avgDrivingDistance} onChange={(e) => handleChange('avgDrivingDistance', e.target.value)} placeholder={TRANSLATIONS.bpAvgDrivingPlaceholder?.[language] || "e.g., 40km per day"}
                className={inputBaseClass} />
            </div>
            <div>
              <label htmlFor="chargingMethod" className="block text-sm font-medium text-slate-300 mb-1">{translate('bpChargingMethod')}</label>
              <select id="chargingMethod" value={data.chargingMethod || ''} onChange={(e) => handleChange('chargingMethod', e.target.value)}
                className={inputBaseClass}>
                {CHARGING_METHODS.map(method => <option key={method} value={method} disabled={method === CHARGING_METHODS[0]}>{method}</option>)}
              </select>
            </div>
            <Button onClick={handleNextStep} isLoading={isLoading} fullWidth variant="primary" size="lg">{translate('bpGetPreliminaryInsight')}</Button>
          </form>
        );
      case PredictionStep.PRELIMINARY_INSIGHT:
        return (
          <div className="text-center space-y-5">
             <InformationCircleIcon className="w-12 h-12 text-sky-400 mx-auto" />
            <h3 className="text-xl font-semibold text-emerald-400">{translate('bpPreliminaryInsightTitle')}</h3>
            <p className="text-slate-300 bg-slate-700/60 p-4 rounded-lg shadow leading-relaxed">{data.preliminaryInsight}</p>
            <Button onClick={handleNextStep} fullWidth variant="primary" size="lg">{translate('next')}</Button>
          </div>
        );
      case PredictionStep.CONTACT_INFO:
        return (
          <form className="space-y-5" onSubmit={(e) => {e.preventDefault(); handleNextStep();}}>
            <h3 className="text-lg font-semibold text-white text-center">{translate('bpContactForReport')}</h3>
             <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-300 mb-1">{translate('contactEmail')}</label>
               <div className="relative mt-1">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <MailIcon className="h-5 w-5 text-slate-400" /> </div>
                <input type="email" name="contactEmail" id="contactEmail" value={data.contactEmail || ''} onChange={(e) => handleChange('contactEmail', e.target.value)} placeholder={TRANSLATIONS.emailPlaceholder[language]}
                       className={inputWithIconClass} />
              </div>
            </div>
             <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-300 mb-1">{translate('contactPhone')}</label>
              <div className="relative mt-1">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <PhoneIcon className="h-5 w-5 text-slate-400" /> </div>
                <input type="tel" name="contactPhone" id="contactPhone" value={data.contactPhone || ''} onChange={(e) => handleChange('contactPhone', e.target.value)} placeholder="078XXXXXXX"
                     className={inputWithIconClass} />
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center">{translate('contactMethodPreferenceInfo')}</p>
            <Button type="submit" isLoading={isLoading} fullWidth variant="primary" size="lg">{translate('submit')}</Button>
          </form>
        );
      case PredictionStep.CONFIRMATION:
        const contactMethod = data.contactEmail || data.contactPhone;
        return (
          <div className="text-center space-y-4 py-6">
            <CheckCircleIcon className="w-20 h-20 text-emerald-500 mx-auto" />
            <h3 className="text-2xl font-semibold text-white">{translate('thankYou')}</h3>
            <p className="text-slate-300 text-md leading-relaxed">{translate('bpReportConfirmation', "...", { contactMethod: contactMethod || 'your provided contact' })}</p>
            {data.id && <p className="text-xs text-slate-500 mt-1">Request ID: {data.id}</p>}
            <Button onClick={() => onNavigate(AppView.LANDING)} fullWidth variant="ghost" size="lg" className="mt-6">{translate('backToHome')}</Button>
          </div>
        );
    }
  };
  
  const stepPageTitles: Record<PredictionStep, string> = {
    [PredictionStep.DETAILS]: translate('bpEnterDetails'),
    [PredictionStep.PRELIMINARY_INSIGHT]: translate('bpPreliminaryInsightTitle'),
    [PredictionStep.CONTACT_INFO]: translate('vdEnterContactDetails'), // Re-using a similar translation key
    [PredictionStep.CONFIRMATION]: translate('confirmation'),
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 min-h-[calc(100vh-8rem)] flex flex-col justify-center">
       {/* Back to Home Button, not shown on final confirmation */}
       {step !== PredictionStep.CONFIRMATION && (
         <Button variant="ghost" size="sm" onClick={() => onNavigate(AppView.LANDING)} className="mb-6 self-start flex items-center group text-slate-400 hover:text-emerald-400">
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:text-emerald-400 transition-colors" />
            {translate('backToHome')}
        </Button>
       )}

      <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-10">
        <div className="text-center mb-6">
            <PageIcon className="w-12 h-12 text-emerald-400 mx-auto mb-3"/>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{translate('batteryPredictionTitle')}</h1>
            <p className="text-sm text-slate-400 mt-1">{translate('batteryPredictionDesc')}</p>
            {/* Display current step title */}
            <p className="text-md font-semibold text-sky-300 mt-4">{stepPageTitles[step]}</p>
        </div>
        

        {error && <p className="text-red-400 bg-red-900/40 p-3 rounded-lg text-sm mb-5 text-center shadow">{error}</p>}
        <div className="min-h-[200px]"> {/* Ensure consistent height for content area */}
         {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default BatteryPrediction;