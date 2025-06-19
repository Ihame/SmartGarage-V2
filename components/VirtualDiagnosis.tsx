
import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { VirtualDiagnosisStep, DiagnosisData, Language, StructuredDiagnosisReport, StepConfig, AppView, CarBrand, UserProfile } from '../types';
import { CAR_BRANDS, CAR_BRANDS_MODELS, VIRTUAL_DIAGNOSIS_STEPS_CONFIG, TRANSLATIONS } from '../constants';
import { getVirtualDiagnosis } from '../services/geminiService';
import { fileToBase64 } from '../services/imageUtils';
import Button from './common/Button';
import { 
  CheckCircleIcon, RpmSpinnerIcon, UploadIcon, CarIcon, CheckSquareIcon, XSquareIcon,
  InformationCircleIcon, CameraIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon, MailIcon, PhoneIcon
} from './common/Icon';
import { LanguageContext, AuthContext } from '../App'; // AuthContext for user ID
import { marked } from 'marked';
import { supabase } from '../services/supabaseClient'; // Import Supabase client

interface VirtualDiagnosisProps {
  onBackToHome: () => void;
}

const ProgressBar: React.FC<{ currentStepId: VirtualDiagnosisStep, stepsConfig: StepConfig[], translate: (key: string) => string }> = ({ currentStepId, stepsConfig, translate }) => {
  const currentStepIndex = stepsConfig.findIndex(s => s.id === currentStepId);
  const visibleSteps = stepsConfig.filter(s => s.id !== VirtualDiagnosisStep.SUBMITTING_DIAGNOSIS);
  
  let visibleCurrentStepIndex = visibleSteps.findIndex(s => s.id === currentStepId);
  if (currentStepId === VirtualDiagnosisStep.SUBMITTING_DIAGNOSIS) {
    visibleCurrentStepIndex = visibleSteps.findIndex(s => s.id === VirtualDiagnosisStep.DESCRIBE_ISSUE);
  }

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center space-x-1 sm:space-x-2">
        {visibleSteps.map((step, stepIdx) => (
          <li key={step.titleKey} className="flex-1">
            {stepIdx <= visibleCurrentStepIndex ? (
              <div className={`group flex flex-col items-center w-full border-l-4 py-1.5 pl-2 sm:py-2 sm:pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-3 ${stepIdx === visibleCurrentStepIndex ? 'border-emerald-500' : 'border-emerald-600'}`}>
                <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${stepIdx === visibleCurrentStepIndex ? 'text-emerald-400' : 'text-emerald-500'}`}>
                  {translate(step.titleKey)}
                </span>
              </div>
            ) : (
              <div className="group flex flex-col items-center w-full border-l-4 border-slate-600 py-1.5 pl-2 sm:py-2 sm:pl-4 transition-colors hover:border-slate-400 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-3">
                 <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500 group-hover:text-slate-400">
                   {translate(step.titleKey)}
                 </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};


const VirtualDiagnosis: React.FC<VirtualDiagnosisProps> = ({ onBackToHome }) => {
  const { language, translate } = useContext(LanguageContext);
  const { currentUser } = useContext(AuthContext); // Get current user for user_id

  const [activeStepId, setActiveStepId] = useState<VirtualDiagnosisStep>(VirtualDiagnosisStep.SELECT_MODEL_BRAND_VIN);
  
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>({
    carBrand: CAR_BRANDS[0], 
    carModel: '', 
    vin: '',
    issueDescription: '',
    dashboardPhoto: null,
    dashboardPhotoBase64: null,
    diagnosisReport: null,
    contactEmail: currentUser?.email || '', // Pre-fill if user is logged in
    contactPhone: '',
    user_id: currentUser?.id || undefined, // Set user_id if logged in
  });

  const [currentModels, setCurrentModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Pre-fill email and user_id if currentUser changes (e.g., logs in on another tab)
    if (currentUser) {
      setDiagnosisData(prev => ({
        ...prev,
        contactEmail: prev.contactEmail || currentUser.email, // Only prefill if not already entered
        user_id: currentUser.id
      }));
    }
  }, [currentUser]);

  const updateDiagnosisData = useCallback((field: keyof DiagnosisData, value: any) => {
    setDiagnosisData(prev => ({ ...prev, [field]: value }));
    if (field === 'carBrand') {
        const selectedBrand = CAR_BRANDS_MODELS.find(b => b.name === value);
        if (selectedBrand) {
            setCurrentModels(selectedBrand.models);
            setDiagnosisData(prev => ({ ...prev, carModel: selectedBrand.models[0] || '' })); 
        } else {
            setCurrentModels([]);
            setDiagnosisData(prev => ({ ...prev, carModel: '' }));
        }
    }
    setError(null); 
  }, []);

  useEffect(() => {
    const initialBrand = CAR_BRANDS_MODELS.find(b => b.name === diagnosisData.carBrand);
    if (initialBrand) {
        setCurrentModels(initialBrand.models);
    }
  }, []); 

  const handlePhotoChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setError(translate('photoUploadHint') + " " + translate('errorFileSize'));
        return;
      }
      setIsLoading(true); 
      setError(null);
      updateDiagnosisData('dashboardPhoto', file);
      try {
        const base64 = await fileToBase64(file);
        updateDiagnosisData('dashboardPhotoBase64', base64);
        setPhotoPreview(URL.createObjectURL(file));
      } catch (err) {
        setError(translate('errorOccurred') + ": Failed to process image.");
        setPhotoPreview(null);
        updateDiagnosisData('dashboardPhoto', null);
        updateDiagnosisData('dashboardPhotoBase64', null);
      } finally {
        setIsLoading(false);
      }
    }
  }, [updateDiagnosisData, translate]);

  const removePhoto = () => {
    setPhotoPreview(null);
    updateDiagnosisData('dashboardPhoto', null);
    updateDiagnosisData('dashboardPhotoBase64', null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const validateStep = (stepId: VirtualDiagnosisStep): boolean => {
    if (stepId === VirtualDiagnosisStep.SELECT_MODEL_BRAND_VIN) {
      if (!diagnosisData.carBrand || diagnosisData.carBrand === CAR_BRANDS[0]) {
        setError(translate('vdErrorSelectBrand'));
        return false;
      }
      if (!diagnosisData.carModel || (currentModels.length > 0 && diagnosisData.carModel === currentModels[0])) {
        setError(translate('vdErrorSelectModel'));
        return false;
      }
    }
    if (stepId === VirtualDiagnosisStep.DESCRIBE_ISSUE && !diagnosisData.issueDescription.trim()) {
      setError(translate('vdErrorDescribeIssue'));
      return false;
    }
    if (stepId === VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC) {
        if (!diagnosisData.contactEmail?.trim() && !diagnosisData.contactPhone?.trim()) {
          setError(translate('pleaseProvideContact'));
          return false;
        }
        if (diagnosisData.contactEmail && !/\S+@\S+\.\S+/.test(diagnosisData.contactEmail)) {
            setError(translate('invalidEmailFormat'));
            return false;
        }
        if (diagnosisData.contactPhone && !/^07[2389]\d{7}$/.test(diagnosisData.contactPhone)) {
            setError(translate('invalidPhoneFormat'));
            return false;
        }
    }
    setError(null);
    return true;
  };

  const saveDiagnosisRequestToSupabase = async () => {
    setIsLoading(true);
    const requestToSave = {
      user_id: currentUser?.id || null, // Can be null if not logged in
      car_brand: diagnosisData.carBrand,
      car_model: diagnosisData.carModel,
      vin: diagnosisData.vin || null,
      issue_description: diagnosisData.issueDescription,
      // dashboard_photo_base64: diagnosisData.dashboardPhotoBase64, // Storing base64, consider Supabase Storage
      // ai_report: diagnosisData.diagnosisReport as any, // Cast to any if Supabase expects JSONB from string/object
      ai_report: typeof diagnosisData.diagnosisReport === 'string' ? { error_message: diagnosisData.diagnosisReport } : diagnosisData.diagnosisReport,
      contact_email: diagnosisData.contactEmail,
      contact_phone: diagnosisData.contactPhone,
      status: 'pending e-mechanic review', // Initial status
    };

    const { data: dbData, error: dbError } = await supabase
      .from('diagnosis_requests')
      .insert([requestToSave])
      .select()
      .single(); // Assuming you want the inserted row back

    setIsLoading(false);
    if (dbError) {
      console.error('Error saving diagnosis request to Supabase:', dbError);
      setError(translate('errorDbSave', 'Failed to save your request. Please try again. ') + dbError.message);
      return false; // Indicate failure
    }
    
    console.log('Diagnosis request saved:', dbData);
    setDiagnosisData(prev => ({...prev, id: dbData.id, status: dbData.status, created_at: dbData.created_at})); // Update state with DB ID etc.
    return true; // Indicate success
  };


  const handleNext = async () => {
    if (!validateStep(activeStepId)) return;

    switch (activeStepId) {
      case VirtualDiagnosisStep.SELECT_MODEL_BRAND_VIN:
        setActiveStepId(VirtualDiagnosisStep.DESCRIBE_ISSUE);
        break;
      case VirtualDiagnosisStep.DESCRIBE_ISSUE:
        await handleSubmitAIDiagnosis(); 
        break;
      case VirtualDiagnosisStep.VIEW_AI_REPORT:
        setActiveStepId(VirtualDiagnosisStep.EMECHANIC_CONSULTATION_PAYMENT_INFO);
        break;
      case VirtualDiagnosisStep.EMECHANIC_CONSULTATION_PAYMENT_INFO:
        setActiveStepId(VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC);
        break;
      case VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC:
        const saved = await saveDiagnosisRequestToSupabase();
        if (saved) {
          setActiveStepId(VirtualDiagnosisStep.FINAL_CONFIRMATION_PAYMENT_CODE);
        }
        // If not saved, error is already set, user stays on current step
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    setError(null); 
    switch (activeStepId) {
      case VirtualDiagnosisStep.DESCRIBE_ISSUE:
        setActiveStepId(VirtualDiagnosisStep.SELECT_MODEL_BRAND_VIN);
        break;
      case VirtualDiagnosisStep.VIEW_AI_REPORT: 
        setActiveStepId(VirtualDiagnosisStep.DESCRIBE_ISSUE); 
        updateDiagnosisData('diagnosisReport', null); 
        break;
      case VirtualDiagnosisStep.EMECHANIC_CONSULTATION_PAYMENT_INFO:
        setActiveStepId(VirtualDiagnosisStep.VIEW_AI_REPORT);
        break;
      case VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC:
        setActiveStepId(VirtualDiagnosisStep.EMECHANIC_CONSULTATION_PAYMENT_INFO);
        break;
      case VirtualDiagnosisStep.FINAL_CONFIRMATION_PAYMENT_CODE:
        // Consider if user should go back from final confirmation.
        // For now, let's go to contact step. They can always use "Back to Home".
        setActiveStepId(VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC);
        break;
      default:
        break;
    }
  };
  
  const handleSubmitAIDiagnosis = async () => {
    if (!diagnosisData.carBrand || diagnosisData.carBrand === CAR_BRANDS[0] ||
        !diagnosisData.carModel || (currentModels.length > 0 && diagnosisData.carModel === currentModels[0]) ||
        !diagnosisData.issueDescription) {
      setError(translate("errorMissingFields"));
      if (!diagnosisData.issueDescription) setActiveStepId(VirtualDiagnosisStep.DESCRIBE_ISSUE);
      else setActiveStepId(VirtualDiagnosisStep.SELECT_MODEL_BRAND_VIN);
      return;
    }
    setError(null);
    setIsLoading(true);
    setActiveStepId(VirtualDiagnosisStep.SUBMITTING_DIAGNOSIS);

    try {
      const report = await getVirtualDiagnosis(
        diagnosisData.carBrand,
        diagnosisData.carModel,
        diagnosisData.vin,
        diagnosisData.issueDescription,
        diagnosisData.dashboardPhotoBase64,
        language
      );
      updateDiagnosisData('diagnosisReport', report);
      if (typeof report === 'object' && report !== null && report.potentialProblems) {
        setActiveStepId(VirtualDiagnosisStep.VIEW_AI_REPORT);
      } else {
        setError(typeof report === 'string' ? report : translate('errorAIResponseFormat'));
        setActiveStepId(VirtualDiagnosisStep.DESCRIBE_ISSUE); 
      }
    } catch (apiError: any) {
      setError(apiError.message || translate('errorOccurred'));
      setActiveStepId(VirtualDiagnosisStep.DESCRIBE_ISSUE);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
  }, [photoPreview]);

  const renderReportContent = (report: StructuredDiagnosisReport | string | null) => {
    if (!report) return <p className="text-slate-400">{translate('errorOccurred', "No report generated or error.")}</p>;
    if (typeof report === 'string') return <p className="text-red-400 p-4 bg-red-900/20 rounded-md">{report}</p>;
    
    const renderMarkdown = (md: string | undefined) => md ? <div className="prose prose-sm prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1" dangerouslySetInnerHTML={{ __html: marked(md) as string }} /> : null;
    
    const getConfidenceClass = (confidence: string) => {
      const confLower = confidence?.toLowerCase();
      if (confLower === 'high') return 'text-red-400 font-semibold';
      if (confLower === 'medium') return 'text-yellow-400 font-semibold';
      if (confLower === 'low') return 'text-sky-400 font-semibold';
      return 'text-slate-300';
    };

    return (
      <div className="space-y-6 text-sm">
        <div className="ai-report-section p-4 bg-slate-700/60 rounded-lg shadow">
            <h3 className="!text-lg !font-semibold !text-emerald-400 !mb-2">{translate('reportSectionSummary')}</h3>
            {renderMarkdown(report.summary)}
            <p className="mt-3 text-xs text-sky-300">{translate('vdAIReportShortenedInfo')}</p>
        </div>
        
        {report.potentialProblems?.length > 0 && <div className="ai-report-section"><h3 className="!text-base">{translate('reportSectionPotentialProblems')}</h3><ul className="space-y-3">{report.potentialProblems.map((p, i) => <li key={i} className="p-3 bg-slate-800/70 rounded-md shadow-sm"><strong>{p.problem}</strong> (<span className={getConfidenceClass(p.confidence)}>{translate(`confidence${p.confidence}`, p.confidence)}</span>){renderMarkdown(p.details)}</li>)}</ul></div>}
        
        {report.imageAnalysisNotes && report.imageAnalysisNotes !== "Not applicable as no image was provided." && report.imageAnalysisNotes !== "No specific issues noted from image that alter initial assessment." && (
          <div className="ai-report-section"><h3 className="!text-base">{translate('reportSectionImageNotes')}</h3>{renderMarkdown(report.imageAnalysisNotes)}</div>
        )}

        {report.immediateChecks?.length > 0 && (
          <div className="ai-report-section"><h3 className="!text-base">{translate('reportSectionImmediateChecks')}</h3>
            <ul className="space-y-3">
              {report.immediateChecks.map((check, i) => (
                <li key={i} className="p-3 bg-slate-800/70 rounded-md shadow-sm">
                  <strong>{check.check}</strong>
                  {renderMarkdown(check.instructions)}
                  {check.toolsNeeded && <p className="text-xs text-slate-400 mt-1.5"><em>{translate('toolsNeeded')}: {check.toolsNeeded}</em></p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.professionalRecommendations?.length > 0 && (
          <div className="ai-report-section"><h3 className="!text-base">{translate('reportSectionProfessionalRecs')}</h3>
            <ul className="space-y-3">
              {report.professionalRecommendations.map((rec, i) => (
                <li key={i} className="p-3 bg-slate-800/70 rounded-md shadow-sm">
                  <strong>{rec.action}</strong>
                  {renderMarkdown(rec.reasoning)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.estimatedUrgency && (
          <div className="ai-report-section"><h3 className="!text-base">{translate('reportSectionUrgency')}</h3>
            <p className={`font-semibold text-md ${
              report.estimatedUrgency.toLowerCase().includes('high') ? 'text-red-400' : 
              report.estimatedUrgency.toLowerCase().includes('medium') ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {report.estimatedUrgency}
            </p>
          </div>
        )}

        {report.disclaimer && (
          <div className="ai-report-section mt-8 pt-4 border-t border-slate-700">
            <h3 className="!text-sm !font-semibold text-slate-500">{translate('reportSectionDisclaimer')}</h3>
            <div className="text-xs text-slate-500">{renderMarkdown(report.disclaimer)}</div>
          </div>
        )}
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (activeStepId) {
      case VirtualDiagnosisStep.SELECT_MODEL_BRAND_VIN:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white">{translate('vdStepSelectModelBrandVin')}</h2>
            <div>
              <label htmlFor="carBrand" className="block text-sm font-medium text-slate-300 mb-1">{translate('vdSelectCarBrand')}</label>
              <select
                id="carBrand" name="carBrand"
                value={diagnosisData.carBrand || CAR_BRANDS[0]}
                onChange={(e) => updateDiagnosisData('carBrand', e.target.value)}
                className="w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm"
              >
                {CAR_BRANDS.map(brand => <option key={brand} value={brand} disabled={brand === CAR_BRANDS[0]}>{brand}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="carModel" className="block text-sm font-medium text-slate-300 mb-1">{translate('vdSelectCarModel')}</label>
              <select
                id="carModel" name="carModel"
                value={diagnosisData.carModel || (currentModels.length > 0 ? currentModels[0] : '')}
                onChange={(e) => updateDiagnosisData('carModel', e.target.value)}
                disabled={!diagnosisData.carBrand || diagnosisData.carBrand === CAR_BRANDS[0] || currentModels.length === 0}
                className="w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm disabled:opacity-50"
              >
                {currentModels.map(model => <option key={model} value={model} disabled={model === currentModels[0] && (currentModels[0].toLowerCase().includes("select") || currentModels[0].toLowerCase().includes("first select"))}>{model}</option>)}
                 {(!currentModels || currentModels.length === 0) && <option value="" disabled>{translate('vdErrorSelectBrandFirst', 'Select a brand first')}</option>}
              </select>
            </div>
            <div>
              <label htmlFor="vin" className="block text-sm font-medium text-slate-300 mb-1">{translate('vdEnterVIN')}</label>
              <input type="text" id="vin" name="vin" value={diagnosisData.vin || ''} onChange={(e) => updateDiagnosisData('vin', e.target.value.toUpperCase())}
                     placeholder={translate('vdVINPlaceholder')} maxLength={17}
                     className="w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm uppercase" />
            </div>
          </div>
        );

      case VirtualDiagnosisStep.DESCRIBE_ISSUE:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">{translate('vdStepDescribeIssue')}</h2>
            <div>
              <label htmlFor="issueDescription" className="sr-only">{translate('vdDescribeIssue')}</label>
              <textarea
                id="issueDescription" name="issueDescription" rows={5}
                value={diagnosisData.issueDescription}
                onChange={(e) => updateDiagnosisData('issueDescription', e.target.value)}
                placeholder={translate('vdDescribeIssuePlaceholder')}
                className="w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm"
              />
            </div>
            <div>
              <label htmlFor="dashboardPhoto" className="block text-sm font-medium text-slate-300 mb-1">{translate('vdUploadPhoto')}</label>
              <div className="mt-1 flex items-center space-x-4">
                <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()} leftIcon={<UploadIcon />} size="md" disabled={isLoading} >
                    {translate('chooseFile')}
                </Button>
                <input type="file" id="dashboardPhoto" name="dashboardPhoto" accept="image/png, image/jpeg, image/gif" onChange={handlePhotoChange} ref={fileInputRef} className="hidden" />
                {photoPreview && (
                  <div className="relative group">
                    <img src={photoPreview} alt="Preview" className="h-16 w-auto rounded-md object-cover" />
                    <button onClick={removePhoto} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={translate('removePhoto')}>
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">{translate('photoUploadHint')}</p>
            </div>
          </div>
        );

      case VirtualDiagnosisStep.SUBMITTING_DIAGNOSIS:
        return (
          <div className="text-center py-10">
            <RpmSpinnerIcon className="w-20 h-20 text-sky-400 mx-auto mb-5" />
            <p className="text-xl font-semibold text-slate-200 animate-pulse">{translate('vdSubmitting')}</p>
          </div>
        );

      case VirtualDiagnosisStep.VIEW_AI_REPORT:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4 pb-2 border-b border-slate-700">{translate('vdAIReportTitle')}</h2>
            {renderReportContent(diagnosisData.diagnosisReport)}
          </div>
        );
      
      case VirtualDiagnosisStep.EMECHANIC_CONSULTATION_PAYMENT_INFO:
        return (
          <div className="space-y-6 text-center">
            <InformationCircleIcon className="w-16 h-16 text-sky-400 mx-auto" />
            <h2 className="text-xl font-semibold text-white">{translate('vdEMechanicConsultationTitle')}</h2>
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-700/50 p-4 rounded-md">{translate('vdEMechanicConsultationText')}</p>
          </div>
        );

      case VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white text-center">{translate('vdEnterContactDetails')}</h2>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-300 mb-1">{translate('contactEmail')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <MailIcon className="h-5 w-5 text-slate-400" /> </div>
                <input type="email" name="contactEmail" id="contactEmail" value={diagnosisData.contactEmail || ''} onChange={(e) => updateDiagnosisData('contactEmail', e.target.value)} placeholder={TRANSLATIONS.emailPlaceholder[language]}
                       className="w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm" />
              </div>
            </div>
             <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-300 mb-1">{translate('contactPhone')}</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <PhoneIcon className="h-5 w-5 text-slate-400" /> </div>
                <input type="tel" name="contactPhone" id="contactPhone" value={diagnosisData.contactPhone || ''} onChange={(e) => updateDiagnosisData('contactPhone', e.target.value)} placeholder="078XXXXXXX"
                     className="w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm" />
              </div>
            </div>
             <p className="text-xs text-slate-400 text-center">{translate('contactMethodPreferenceInfo')}</p>
          </div>
        );

      case VirtualDiagnosisStep.FINAL_CONFIRMATION_PAYMENT_CODE:
        const contactMethod = diagnosisData.contactEmail ? translate('contactViaEmail') : translate('contactViaPhone');
        return (
          <div className="text-center py-8">
            <CheckCircleIcon className="w-20 h-20 text-emerald-500 mx-auto mb-5" />
            <h2 className="text-2xl font-semibold text-white mb-3">{translate('thankYou')}</h2>
            <p className="text-slate-300">
              {translate('vdEMechanicConfirmationPaymentCode', "...", { contactMethod })}
            </p>
            {diagnosisData.id && <p className="text-xs text-slate-500 mt-2">Request ID: {diagnosisData.id}</p>}
          </div>
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  const showBackButton = ![VirtualDiagnosisStep.SELECT_MODEL_BRAND_VIN, VirtualDiagnosisStep.SUBMITTING_DIAGNOSIS, VirtualDiagnosisStep.FINAL_CONFIRMATION_PAYMENT_CODE].includes(activeStepId);
  const showNextButton = ![VirtualDiagnosisStep.SUBMITTING_DIAGNOSIS, VirtualDiagnosisStep.FINAL_CONFIRMATION_PAYMENT_CODE].includes(activeStepId);
  
  let nextButtonText = translate('next');
  if (activeStepId === VirtualDiagnosisStep.DESCRIBE_ISSUE) nextButtonText = translate('vdGetAIReport');
  if (activeStepId === VirtualDiagnosisStep.VIEW_AI_REPORT) nextButtonText = translate('vdProceedToEMechanic');
  if (activeStepId === VirtualDiagnosisStep.EMECHANIC_CONSULTATION_PAYMENT_INFO) nextButtonText = translate('vdProceedToEMechanicContact');
  if (activeStepId === VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC) nextButtonText = translate('vdSubmitForEMechanic');

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-[calc(100vh-10rem)]">
      <Button variant="ghost" size="sm" onClick={onBackToHome} className="mb-6 flex items-center group text-slate-400 hover:text-emerald-400">
        <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:text-emerald-400 transition-colors" />
        {translate('backToHome')}
      </Button>

      <div className="bg-slate-800 shadow-2xl rounded-xl p-5 sm:p-8">
        <ProgressBar currentStepId={activeStepId} stepsConfig={VIRTUAL_DIAGNOSIS_STEPS_CONFIG} translate={translate} />
        
        {error && (
          <div className="mb-6 p-3.5 bg-red-900/40 text-red-300 border border-red-700/60 rounded-lg flex items-start text-sm">
            <XSquareIcon className="w-5 h-5 mr-2.5 flex-shrink-0 mt-0.5 text-red-400" />
            <p>{error}</p>
          </div>
        )}

        <div className="min-h-[250px] sm:min-h-[300px]">
          {renderCurrentStep()}
        </div>
        
        {(showBackButton || showNextButton) && (
          <div className={`mt-10 flex ${showBackButton && showNextButton ? 'justify-between' : showNextButton ? 'justify-end' : 'justify-start'} items-center`}>
            {showBackButton && (
              <Button variant="ghost" onClick={handlePrevious} disabled={isLoading} leftIcon={<ArrowLeftIcon/>}>
                {translate('back')}
              </Button>
            )}
            {showNextButton && (
              <Button 
                variant="primary"
                onClick={handleNext} 
                isLoading={isLoading}
                disabled={isLoading}
                rightIcon={(activeStepId !== VirtualDiagnosisStep.DESCRIBE_ISSUE && activeStepId !== VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC) ? <ArrowRightIcon/> : undefined}
              >
                {nextButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualDiagnosis;
