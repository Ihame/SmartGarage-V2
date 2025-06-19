
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppView, SparesHunterData, Language, CarBrand, UserProfile } from '../types';
import { CAR_BRANDS, CAR_BRANDS_MODELS, TRANSLATIONS } from '../constants';
import Button from './common/Button';
import { LanguageContext, AuthContext } from '../App';
import { ArrowLeftIcon, CheckCircleIcon, UploadIcon, CameraIcon, TrashIcon, MailIcon, PhoneIcon, WrenchScrewdriverIcon as PageIcon } from './common/Icon';
import { fileToBase64 } from '../services/imageUtils';
import { supabase } from '../services/supabaseClient';

interface SparesHunterProps {
  onNavigate: (view: AppView) => void;
}

enum SparesStep {
  DETAILS = 'DETAILS',
  CONTACT_INFO = 'CONTACT_INFO',
  CONFIRMATION = 'CONFIRMATION',
}

const SparesHunter: React.FC<SparesHunterProps> = ({ onNavigate }) => {
  const { translate, language } = useContext(LanguageContext);
  const { currentUser } = useContext(AuthContext);

  const [step, setStep] = useState<SparesStep>(SparesStep.DETAILS);
  const [data, setData] = useState<SparesHunterData>({
    partDescription: '',
    carBrand: CAR_BRANDS[0], 
    carModel: '',
    partPhoto: null,
    partPhotoBase64: null,
    contactEmail: currentUser?.email || '',
    contactPhone: '',
    user_id: currentUser?.id || undefined,
  });
  const [currentModels, setCurrentModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setData(prev => ({
        ...prev,
        contactEmail: prev.contactEmail || currentUser.email,
        user_id: currentUser.id
      }));
    }
  }, [currentUser]);

  const handleChange = (field: keyof SparesHunterData, value: string | File | null) => {
    setData(prev => ({ ...prev, [field]: value }));
     if (field === 'carBrand') {
        const selectedBrand = CAR_BRANDS_MODELS.find(b => b.name === value);
        if (selectedBrand) {
            setCurrentModels(selectedBrand.models);
            setData(prevData => ({ ...prevData, carModel: selectedBrand.models[0] || '' })); 
        } else {
            setCurrentModels([]);
            setData(prevData => ({ ...prevData, carModel: '' }));
        }
    }
    setError(null);
  };
  
  useEffect(() => {
    const initialBrand = CAR_BRANDS_MODELS.find(b => b.name === data.carBrand);
    if (initialBrand) {
        setCurrentModels(initialBrand.models);
        if (!data.carModel && initialBrand.models.length > 0) {
             setData(prev => ({ ...prev, carModel: initialBrand.models[0] }));
        }
    }
  }, []);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setError(translate('photoUploadHint') + " " + translate('errorFileSize'));
        return;
      }
      setIsLoading(true); 
      setError(null);
      handleChange('partPhoto', file);
      try {
        const base64 = await fileToBase64(file);
        handleChange('partPhotoBase64', base64);
        setPhotoPreview(URL.createObjectURL(file));
      } catch (err) {
        console.error("Error processing image for spares hunter:", err);
        setError(translate('errorOccurred') + ": Failed to process image.");
        setPhotoPreview(null);
        handleChange('partPhoto', null);
        handleChange('partPhotoBase64', null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    handleChange('partPhoto', null);
    handleChange('partPhotoBase64', null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const validateDetails = (): boolean => {
    if (!data.partDescription.trim()) {
      setError(translate('errorDescribePart'));
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

  const saveSparesRequestToSupabase = async () => {
    setIsLoading(true);
    const requestToSave = {
      user_id: currentUser?.id || null,
      part_description: data.partDescription,
      car_brand: data.carBrand !== CAR_BRANDS[0] ? data.carBrand : null,
      car_model: data.carModel !== (currentModels.length > 0 ? currentModels[0] : '') && data.carModel 
                 && !(data.carModel?.toLowerCase().includes("select") || data.carModel?.toLowerCase().includes("first select")) 
                 ? data.carModel : null,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      status: 'pending search',
    };

    const { data: dbData, error: dbError } = await supabase
      .from('spare_part_requests')
      .insert([requestToSave])
      .select()
      .single();

    setIsLoading(false);
    if (dbError) {
      console.error('Error saving spares request to Supabase:', dbError);
      setError(translate('errorDbSave', 'Failed to save your request. ') + dbError.message);
      return false;
    }
    console.log('Spares request saved:', dbData);
    setData(prev => ({...prev, id: dbData.id, status: dbData.status, created_at: dbData.created_at}));
    return true;
  };

  const handleNextStep = async () => {
    switch (step) {
      case SparesStep.DETAILS:
        if (validateDetails()) {
          setStep(SparesStep.CONTACT_INFO);
        }
        break;
      case SparesStep.CONTACT_INFO:
        if (validateContact()) {
            const saved = await saveSparesRequestToSupabase();
            if (saved) {
                setStep(SparesStep.CONFIRMATION);
            }
        }
        break;
    }
  };

  const stepPageTitles: Record<SparesStep, string> = {
    [SparesStep.DETAILS]: translate('shDescribePartDetails'),
    [SparesStep.CONTACT_INFO]: translate('shEnterContact'),
    [SparesStep.CONFIRMATION]: translate('shConfirmationTitle'),
  };

  const inputBaseClass = "mt-1 block w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400";
  const inputWithIconClass = `${inputBaseClass} pl-10`;

  const renderStepContent = () => {
    switch (step) {
      case SparesStep.DETAILS:
        return (
          <form className="space-y-5">
            <div>
              <label htmlFor="partDescription" className="block text-sm font-medium text-slate-300 mb-1">{translate('shDescribePart')}</label>
              <textarea id="partDescription" value={data.partDescription} onChange={(e) => handleChange('partDescription', e.target.value)}
                rows={4} placeholder={translate('shDescribePartPlaceholder')}
                className={inputBaseClass} />
            </div>
             <div>
              <label htmlFor="carBrand" className="block text-sm font-medium text-slate-300 mb-1">{translate('vdSelectCarBrand')} ({translate('optional', 'Optional')})</label>
              <select
                id="carBrand" name="carBrand"
                value={data.carBrand || CAR_BRANDS[0]}
                onChange={(e) => handleChange('carBrand', e.target.value)}
                className={inputBaseClass}
              >
                {CAR_BRANDS.map(brand => <option key={brand} value={brand} disabled={brand === CAR_BRANDS[0]}>{brand}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="carModel" className="block text-sm font-medium text-slate-300 mb-1">{translate('shCarModelOptional')}</label>
              <select
                id="carModel" name="carModel"
                value={data.carModel || (currentModels.length > 0 ? currentModels[0] : '')}
                onChange={(e) => handleChange('carModel', e.target.value)}
                disabled={!data.carBrand || data.carBrand === CAR_BRANDS[0] || currentModels.length === 0}
                className={`${inputBaseClass} disabled:opacity-60`}
              >
                {currentModels.map(model => <option key={model} value={model} disabled={model === currentModels[0] && (currentModels[0].toLowerCase().includes("select") || currentModels[0].toLowerCase().includes("first select"))}>{model}</option>)}
                {(!currentModels || currentModels.length === 0 && data.carBrand !== CAR_BRANDS[0]) && <option value="" disabled>{translate('vdErrorSelectBrandFirst', 'Select a brand first or type model')}</option>}
                 {data.carBrand === CAR_BRANDS[0] && <option value="" disabled>{translate('vdErrorSelectBrandFirst', 'Select brand to see models')}</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{translate('shUploadPartPhoto')}</label>
              <div className="mt-1 flex items-center space-x-3">
                 <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<UploadIcon />}
                    size="md"
                    disabled={isLoading}
                >
                    {translate('chooseFile')}
                </Button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                {photoPreview && (
                  <div className="relative group">
                    <img src={photoPreview} alt="Part preview" className="h-16 w-auto rounded-md object-cover border border-slate-600" />
                    <button onClick={removePhoto} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={translate('removePhoto')}>
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {isLoading && <p className="text-xs text-sky-400 mt-1">{translate('uploading')}</p>}
               <p className="mt-2 text-xs text-slate-400">{translate('photoUploadHint')}</p>
            </div>
            <Button onClick={handleNextStep} fullWidth variant="primary" size="lg">{translate('next')}</Button>
          </form>
        );
      case SparesStep.CONTACT_INFO:
        return (
          <form className="space-y-5" onSubmit={(e) => {e.preventDefault(); handleNextStep();}}>
            <p className="text-slate-300 text-sm text-center">{translate('shContactForSearch')}</p>
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
            <Button type="submit" isLoading={isLoading} fullWidth variant="primary" size="lg">{translate('shFindMyPart')}</Button>
          </form>
        );
      case SparesStep.CONFIRMATION:
        const contactMethod = data.contactEmail || data.contactPhone;
        return (
          <div className="text-center space-y-4 py-6">
            <CheckCircleIcon className="w-20 h-20 text-emerald-500 mx-auto" />
            <h3 className="text-2xl font-semibold text-white">{translate('thankYou')}</h3>
            <p className="text-slate-300 text-md leading-relaxed">{translate('shSearchConfirmation', "...", { contactMethod: contactMethod || 'your provided contact' })}</p>
            {data.id && <p className="text-xs text-slate-500 mt-1">Request ID: {data.id}</p>}
            <Button onClick={() => onNavigate(AppView.LANDING)} fullWidth variant="ghost" size="lg" className="mt-6">{translate('backToHome')}</Button>
          </div>
        );
      default:
        return null; // Should not happen
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 min-h-[calc(100vh-8rem)] flex flex-col justify-center">
      {step !== SparesStep.CONFIRMATION && (
        <Button variant="ghost" size="sm" onClick={() => onNavigate(AppView.LANDING)} className="mb-6 self-start flex items-center group text-slate-400 hover:text-emerald-400">
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:text-emerald-400 transition-colors" />
            {translate('backToHome')}
        </Button>
      )}
      <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-10">
        <div className="text-center mb-6">
            <PageIcon className="w-12 h-12 text-emerald-400 mx-auto mb-3"/>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{translate('sparesHunterTitle')}</h1>
            <p className="text-sm text-slate-400 mt-1">{translate('sparesHunterDesc')}</p>
            <p className="text-xs text-emerald-400 font-semibold mt-1">{translate('freeService')}</p>
            <p className="text-md font-semibold text-sky-300 mt-4">{stepPageTitles[step]}</p>
        </div>
        
        {error && <p className="text-red-400 bg-red-900/40 p-3 rounded-lg text-sm mb-5 text-center shadow">{error}</p>}
        <div className="min-h-[200px]">
            {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default SparesHunter;
