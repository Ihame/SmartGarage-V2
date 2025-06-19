
import React, { useState, useContext, useEffect } from 'react';
import { OBDProduct, AppView, OBDInquiryData, UserProfile } from '../types';
import { SAMPLE_OBD_PRODUCTS, TRANSLATIONS } from '../constants';
import ProductCard from './common/ProductCard';
import { LanguageContext, AuthContext } from '../App';
import Button from './common/Button';
import Modal from './common/Modal';
import { CheckCircleIcon, MailIcon, PhoneIcon, UserIcon as UserFormIcon } from './common/Icon'; // Renamed UserIcon import
import { supabase } from '../services/supabaseClient';

const OBDShop: React.FC = () => {
  const { translate, language } = useContext(LanguageContext);
  const { currentUser } = useContext(AuthContext);

  const [products] = useState<OBDProduct[]>(SAMPLE_OBD_PRODUCTS);
  
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [selectedProductForInfo, setSelectedProductForInfo] = useState<OBDProduct | null>(null);
  const [inquiryData, setInquiryData] = useState<Partial<OBDInquiryData>>({});
  const [isLoadingInquiry, setIsLoadingInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill form when modal opens and user is logged in
    if (currentUser && showRequestInfoModal) { 
      setInquiryData(prev => ({
        ...prev,
        userName: prev.userName || currentUser.full_name || '',
        userEmail: prev.userEmail || currentUser.email || '',
        user_id: currentUser.id, 
      }));
    } else if (!currentUser && showRequestInfoModal) {
      // Ensure user_id is null if no user is logged in when modal opens
       setInquiryData(prev => ({
        ...prev,
        user_id: null,
      }));
    }
  }, [currentUser, showRequestInfoModal]);


  const handleRequestInfo = (product: OBDProduct) => {
    setSelectedProductForInfo(product);
    // Initialize form data, prefill from currentUser if available
    setInquiryData({ 
      productId: product.id, 
      productName: product.name,
      userName: currentUser?.full_name || '',
      userEmail: currentUser?.email || '',
      userPhone: '', 
      message: '',
      user_id: currentUser?.id || null, 
    });
    setInquirySubmitted(false); // Reset submission state
    setFormError(null); // Clear previous errors
    setShowRequestInfoModal(true);
  };

  const closeInquiryModal = () => {
    setShowRequestInfoModal(false);
    setSelectedProductForInfo(null);
    // Delay resetting form data to allow modal to close smoothly
    setTimeout(() => {
        setInquiryData({});
        setIsLoadingInquiry(false);
        setInquirySubmitted(false);
        setFormError(null);
    }, 300); // Match modal transition duration
  };

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInquiryData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null); // Clear error on input change
  };

  const validateInquiryForm = (): boolean => {
    if (!inquiryData.userName?.trim() || !inquiryData.userEmail?.trim() || !inquiryData.userPhone?.trim()) {
      setFormError(translate('fillAllFields'));
      return false;
    }
    if (inquiryData.userEmail && !/\S+@\S+\.\S+/.test(inquiryData.userEmail)) {
        setFormError(translate('invalidEmailFormat'));
        return false;
    }
    // Validate Rwandan phone number format if provided
    if (inquiryData.userPhone && !/^07[2389]\d{7}$/.test(inquiryData.userPhone)) {
        setFormError(translate('invalidPhoneFormat'));
        return false;
    }
    setFormError(null);
    return true;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInquiryForm() || !selectedProductForInfo) return;

    setIsLoadingInquiry(true);
    const inquiryToSave = {
      user_id: currentUser?.id || null, 
      product_id: selectedProductForInfo.id,
      product_name: selectedProductForInfo.name,
      user_name: inquiryData.userName!,
      user_email: inquiryData.userEmail!,
      user_phone: inquiryData.userPhone!,
      message: inquiryData.message || null,
      status: 'pending contact',
    };

    const { data: dbData, error: dbError } = await supabase
      .from('obd_inquiries')
      .insert([inquiryToSave])
      .select()
      .single();

    setIsLoadingInquiry(false);
    if (dbError) {
      console.error('Error saving OBD inquiry to Supabase:', dbError.message, dbError.details, dbError.hint);
      setFormError(translate('errorDbSave', 'Failed to submit inquiry. ') + dbError.message);
    } else {
      console.log("OBD Inquiry Submitted to Supabase:", dbData);
      // Update local state with DB generated ID, status, and created_at if needed for display
      setInquiryData(prev => ({...prev, id: dbData.id, status: dbData.status, created_at: dbData.created_at}));
      setInquirySubmitted(true);
    }
  };
  
  const inputBaseClass = "w-full bg-slate-700 border-slate-600 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-sm placeholder-slate-400";
  const inputWithIconClass = `${inputBaseClass} pl-10`;


  return (
    <div className="bg-slate-900 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {translate('obdShopTitle')}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {translate('obdShopIntro')}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onRequestInfo={handleRequestInfo}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 text-lg">
            {translate('noProductsAvailable', 'No OBD scanners available at the moment. Please check back soon!')}
          </p>
        )}
      </div>

      <Modal
        isOpen={showRequestInfoModal}
        onClose={closeInquiryModal}
        title={selectedProductForInfo ? translate('obdInquiryTitle', "Request Info", { productName: selectedProductForInfo.name }) : translate('requestInfo')}
        size="lg"
      >
        {selectedProductForInfo && (
          <>
            {inquirySubmitted ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-20 h-20 text-emerald-500 mx-auto mb-5" />
                <h3 className="text-2xl font-semibold text-white">{translate('obdInquirySubmittedTitle')}</h3>
                <p className="text-slate-300 mt-3 text-md leading-relaxed">
                  {translate('obdInquirySubmittedMsg', "...", { 
                    userName: inquiryData.userName || "Valued Customer", 
                    productName: selectedProductForInfo.name,
                    contactDetail: inquiryData.userEmail || inquiryData.userPhone || "your contact"
                  })}
                </p>
                {inquiryData.id && <p className="text-xs text-slate-500 mt-2">Inquiry ID: {inquiryData.id}</p>}
                <Button onClick={closeInquiryModal} fullWidth className="mt-8" variant="primary" size="lg">
                    {translate('close')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-5">
                <div className="p-4 bg-slate-700/60 rounded-lg mb-4 shadow">
                    <h4 className="font-semibold text-xl text-emerald-400">{selectedProductForInfo.name}</h4>
                    <p className="text-xs text-slate-300 mt-1">{selectedProductForInfo.description}</p>
                    <p className="text-lg font-bold text-sky-300 mt-2">{translate('obdPriceDisplay', '', {price: selectedProductForInfo.price.toLocaleString()})}</p>
                </div>
                <p className="text-sm text-slate-300 text-center">{translate('obdInquiryPrompt')}</p>
                
                {formError && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg text-sm text-center shadow">{formError}</p>}

                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-slate-300 mb-1">{translate('yourName')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <UserFormIcon className="h-5 w-5 text-slate-400" /> </div>
                    <input type="text" name="userName" id="userName" value={inquiryData.userName || ''} onChange={handleInquiryChange} required 
                           className={inputWithIconClass} placeholder={translate('namePlaceholder')} />
                  </div>
                </div>
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-slate-300 mb-1">{translate('emailAddress')}</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <MailIcon className="h-5 w-5 text-slate-400" /> </div>
                    <input type="email" name="userEmail" id="userEmail" value={inquiryData.userEmail || ''} onChange={handleInquiryChange} required
                           className={inputWithIconClass} placeholder={TRANSLATIONS.emailPlaceholder[language]}/>
                  </div>
                </div>
                <div>
                  <label htmlFor="userPhone" className="block text-sm font-medium text-slate-300 mb-1">{translate('phoneNumber')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <PhoneIcon className="h-5 w-5 text-slate-400" /> </div>
                    <input type="tel" name="userPhone" id="userPhone" value={inquiryData.userPhone || ''} onChange={handleInquiryChange} required
                           className={inputWithIconClass} placeholder="078XXXXXXX"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">{translate('yourMessageOptional')}</label>
                  <textarea name="message" id="message" rows={3} value={inquiryData.message || ''} onChange={handleInquiryChange}
                           className={`${inputBaseClass} py-2`} // Adjusted padding for textarea
                           placeholder={TRANSLATIONS.obdMessagePlaceholder?.[language] || "Any specific questions?"}/>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={closeInquiryModal} disabled={isLoadingInquiry} className="w-full sm:w-auto" size="lg">
                        {translate('close')}
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isLoadingInquiry} disabled={isLoadingInquiry} className="w-full sm:w-auto" size="lg">
                        {translate('submit')}
                    </Button>
                </div>
              </form>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default OBDShop;
