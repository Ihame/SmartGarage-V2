
import { Language, Testimonial, Translations, OBDProduct, AppView, VirtualDiagnosisStep, StepConfig, CommunityPost, CarBrand } from './types';

export const API_KEY_ENV_VAR = 'API_KEY'; // For Gemini

export const CAR_BRANDS: string[] = [
  "Choose car brand...", // Placeholder value
  "Toyota", "Volkswagen", "Tesla", "Nissan", "Hyundai", "Kia", "BYD", "Rivian", "Mercedes-Benz", "BMW", "Ford", "Porsche",
  "Honda", "Mazda", "Subaru", "Lexus", "Audi", "Volvo", "Jaguar", "Land Rover", "Mitsubishi", "Chevrolet", "GMC", "Cadillac", "Chrysler", "Dodge", "Jeep", "Ram",
  "Peugeot", "Citroën", "Renault", "Fiat", "Opel", "SEAT", "Škoda",
  "Great Wall Motors (GWM)", "Haval", "Chery", "Geely", "MG", "Tata", "Mahindra",
  "Ampersand E-Motorcycle", 
  "Other EV/Hybrid Brand"
];

export const CAR_BRANDS_MODELS: CarBrand[] = [
  { name: "Choose car brand...", models: ["First select a brand"] },
  {
    name: "Toyota",
    models: [
      "Select Toyota model...", "Corolla Hybrid", "Camry Hybrid", "Prius", "Prius Prime (PHEV)", "RAV4 Hybrid", "RAV4 Prime (PHEV)",
      "Highlander Hybrid", "Venza", "Sienna", "Crown", "Mirai (FCEV)", "bZ4X (EV)",
      "Aqua", "Yaris Hybrid", "C-HR Hybrid", "Harrier Hybrid", "Alphard Hybrid", "Land Cruiser Hybrid (new)",
      "BZ3 (EV - China)", "Probox Hybrid (Kei car - specific markets)", "Sienta Hybrid",
      "Other Toyota EV/Hybrid"
    ]
  },
  {
    name: "Volkswagen",
    models: [
      "Select VW model...", "ID.3 (EV)", "ID.4 (EV)", "ID.5 (EV)", "ID.6 (EV - China)", "ID.7 (EV)", "ID. Buzz (EV)",
      "Golf GTE (PHEV)", "Passat GTE (PHEV)", "Tiguan eHybrid (PHEV)", "Touareg R eHybrid (PHEV)", "Arteon eHybrid (PHEV)",
      "e-Golf (EV - older)", "e-up! (EV)",
      "Other VW EV/Hybrid"
    ]
  },
  {
    name: "Ampersand E-Motorcycle",
    models: ["Select Ampersand model...", "E-Motorcycle Gen2", "E-Motorcycle Gen3", "Other Ampersand Model"]
  },
  {
    name: "Tesla",
    models: ["Select Tesla model...", "Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster (New)", "Other Tesla Model"]
  },
  {
    name: "Nissan",
    models: ["Select Nissan model...", "Leaf (EV)", "Ariya (EV)", "Kicks e-Power (Hybrid)", "Note e-Power (Hybrid)", "Serena e-Power (Hybrid)", "Qashqai e-Power (Hybrid)", "X-Trail e-Power (Hybrid)", "Townstar EV", "Other Nissan EV/Hybrid"]
  },
  {
    name: "Hyundai",
    models: [
      "Select Hyundai model...", "Kona Electric (EV)", "Ioniq Electric (EV - older)", "Ioniq 5 (EV)", "Ioniq 6 (EV)",
      "Tucson Hybrid", "Tucson PHEV", "Santa Fe Hybrid", "Santa Fe PHEV",
      "Ioniq Hybrid (older)", "Ioniq Plug-in Hybrid (older)", "Sonata Hybrid", "Elantra Hybrid", "Nexo (FCEV)",
      "Bayon Hybrid", "Staria Hybrid",
      "Other Hyundai EV/Hybrid"
    ]
  },
  {
    name: "Kia",
    models: [
      "Select Kia model...", "Niro EV (e-Niro)", "EV6 (EV)", "EV9 (EV)", "Soul EV",
      "Niro Hybrid", "Niro PHEV", "Sportage Hybrid", "Sportage PHEV", "Sorento Hybrid", "Sorento PHEV",
      "Optima Hybrid (K5 Hybrid - older)", "Optima PHEV (older)", "Ceed Sportswagon PHEV", "XCeed PHEV",
      "Ray EV (Korea)", "EV3 (Concept/Upcoming)", "EV4 (Concept/Upcoming)", "EV5 (China/Upcoming Global)",
      "Other Kia EV/Hybrid"
    ]
  },
  {
    name: "BYD",
    models: [
      "Select BYD model...", "Atto 3 (Yuan Plus - EV)", "Dolphin (EA1 - EV)", "Seal (EV)", "Han (EV)", "Tang (EV/PHEV)", "Song Plus (EV/PHEV)",
      "Qin Plus (EV/PHEV)", "Destroyer 05 (PHEV)", "Frigate 07 (PHEV)", "Seagull (EV)", "Yangwang U8 (Luxury EV SUV)",
      "Other BYD EV/Hybrid"
    ]
  },
   { name: "Rivian", models: ["Select Rivian model...", "R1T (EV Truck)", "R1S (EV SUV)", "EDV (Electric Delivery Van)", "Other Rivian Model"] },
   { name: "Mercedes-Benz", models: [
       "Select Mercedes model...", "EQA (EV)", "EQB (EV)", "EQC (EV)", "EQE Sedan (EV)", "EQE SUV (EV)", "EQS Sedan (EV)", "EQS SUV (EV)", "EQV (EV Van)", "eSprinter (EV Van)", "eCitan (EV Van)",
       "A250e (PHEV)", "B250e (PHEV)", "C300e (PHEV)", "E300e/de (PHEV)", "S580e (PHEV)", "GLA250e (PHEV)", "GLC300e/de (PHEV)", "GLE350e/de (PHEV)", "GLS (Maybach GLS 600 Hybrid)",
       "AMG GT 63 S E PERFORMANCE (PHEV)",
       "Other Mercedes EV/Hybrid"
     ]
   },
   { name: "BMW", models: [
       "Select BMW model...", "i3 (EV - older)", "i4 (EV)", "i5 (EV)", "i7 (EV)", "iX1 (EV)", "iX3 (EV)", "iX (EV)",
       "225xe Active Tourer (PHEV)", "330e (PHEV)", "530e/545e (PHEV)", "745e/750e (PHEV)",
       "X1 xDrive25e/30e (PHEV)", "X2 xDrive25e (PHEV)", "X3 xDrive30e (PHEV)", "X5 xDrive45e/50e (PHEV)", "XM (PHEV)",
       "Other BMW EV/Hybrid"
     ]
   },
   { name: "Ford", models: [
       "Select Ford model...", "Mustang Mach-E (EV)", "F-150 Lightning (EV)", "E-Transit (EV)",
       "Explorer PHEV", "Kuga PHEV (Escape PHEV)", "Puma EcoBoost Hybrid (Mild Hybrid)", "Focus EcoBoost Hybrid (Mild Hybrid)", "Fiesta EcoBoost Hybrid (Mild Hybrid)",
       "Transit Custom PHEV", "Tourneo Custom PHEV",
       "Other Ford EV/Hybrid"
     ]
   },
   { name: "Porsche", models: ["Select Porsche model...", "Taycan (EV)", "Taycan Cross Turismo (EV)", "Macan Electric (EV)", "Cayenne E-Hybrid (PHEV)", "Panamera E-Hybrid (PHEV)", "Other Porsche EV/Hybrid"] },
  { name: "Honda", models: ["Select Honda model...", "Honda e (EV)", "CR-V Hybrid", "HR-V e:HEV (Hybrid)", "Jazz e:HEV (Hybrid)", "Civic e:HEV (Hybrid)", "Prologue (EV - GM Platform)", "Clarity (PHEV/FCEV - Discontinued but may exist)", "Insight (Hybrid - Discontinued but may exist)", "Other Honda EV/Hybrid"] },
  { name: "Mazda", models: ["Select Mazda model...", "MX-30 EV", "MX-30 R-EV (Rotary PHEV)", "CX-60 PHEV", "CX-90 PHEV", "Mazda2 Hybrid (Toyota Yaris based)", "Other Mazda EV/Hybrid"] },
  { name: "Subaru", models: ["Select Subaru model...", "Solterra (EV)", "Crosstrek Hybrid (PHEV - US)", "Forester e-BOXER (Mild Hybrid - Europe/Asia)", "XV e-BOXER (Mild Hybrid - Europe/Asia)", "Other Subaru EV/Hybrid"] },
  { name: "Lexus", models: ["Select Lexus model...", "RZ 450e (EV)", "UX 300e (EV)", "NX 350h/450h+ (Hybrid/PHEV)", "RX 350h/450h+/500h (Hybrid/PHEV)", "ES 300h (Hybrid)", "LS 500h (Hybrid)", "LC 500h (Hybrid)", "LBX (Hybrid)", "Other Lexus EV/Hybrid"] },
  { name: "Audi", models: ["Select Audi model...", "e-tron GT (EV)", "RS e-tron GT (EV)", "Q4 e-tron (EV)", "Q4 Sportback e-tron (EV)", "Q8 e-tron (EV - formerly e-tron)", "Q8 Sportback e-tron (EV)", "A3 Sportback TFSI e (PHEV)", "A6 TFSI e (PHEV)", "A7 TFSI e (PHEV)", "A8 TFSI e (PHEV)", "Q3 TFSI e (PHEV)", "Q5 TFSI e (PHEV)", "Q7 TFSI e (PHEV)", "Q8 TFSI e (PHEV)", "Other Audi EV/Hybrid"] },
  { name: "Volvo", models: ["Select Volvo model...", "XC40 Recharge (EV)", "C40 Recharge (EV)", "EX30 (EV)", "EX90 (EV)", "XC60 Recharge (PHEV)", "XC90 Recharge (PHEV)", "S60 Recharge (PHEV)", "V60 Recharge (PHEV)", "S90 Recharge (PHEV)", "V90 Recharge (PHEV)", "Other Volvo EV/Hybrid"] },
  { name: "Jaguar", models: ["Select Jaguar model...", "I-PACE (EV)", "E-PACE PHEV", "F-PACE PHEV", "Other Jaguar EV/Hybrid"] },
  { name: "Land Rover", models: ["Select Land Rover model...", "Range Rover PHEV", "Range Rover Sport PHEV", "Range Rover Velar PHEV", "Discovery Sport PHEV", "Defender PHEV", "Range Rover Evoque PHEV", "Other Land Rover EV/Hybrid"] },
  { name: "Mitsubishi", models: ["Select Mitsubishi model...", "Outlander PHEV", "Eclipse Cross PHEV", "Airtrek EV (China)", "Minicab MiEV (Kei EV Van)", "Other Mitsubishi EV/Hybrid"] },
  { name: "Chevrolet", models: ["Select Chevrolet model...", "Bolt EV", "Bolt EUV", "Blazer EV", "Equinox EV", "Silverado EV", "Volt (PHEV - Discontinued)", "Other Chevrolet EV/Hybrid"] },
  { name: "Peugeot", models: ["Select Peugeot model...", "e-208 (EV)", "e-2008 (EV)", "e-308 (EV)", "e-3008 (EV)", "e-Partner (EV Van)", "e-Rifter (EV MPV)", "308 Hybrid (PHEV)", "3008 Hybrid (PHEV)", "508 Hybrid (PHEV)", "408 Hybrid (PHEV)", "Other Peugeot EV/Hybrid"] },
  { name: "Citroën", models: ["Select Citroën model...", "ë-C4 (EV)", "ë-C4 X (EV)", "Ami (EV Quadricycle)", "ë-Berlingo (EV Van/MPV)", "ë-SpaceTourer (EV MPV)", "C5 Aircross Hybrid (PHEV)", "C5 X Hybrid (PHEV)", "Other Citroën EV/Hybrid"] },
  { name: "Renault", models: ["Select Renault model...", "Zoe (EV)", "Megane E-Tech Electric (EV)", "Kangoo E-Tech Electric (EV Van)", "Master E-Tech Electric (EV Van)", "Twingo E-Tech Electric (EV)", "Scenic E-Tech (EV)", "R5 E-Tech (Upcoming EV)", "Captur E-Tech Hybrid/PHEV", "Clio E-Tech Hybrid", "Arkana E-Tech Hybrid", "Other Renault EV/Hybrid"] },
  { name: "Fiat", models: ["Select Fiat model...", "500e (EV)", "E-Doblo (EV Van)", "E-Ulysse (EV MPV)", "Panda Hybrid (Mild Hybrid)", "500 Hybrid (Mild Hybrid)", "Tipo Hybrid (Mild Hybrid)", "Other Fiat EV/Hybrid"] },
  { name: "Great Wall Motors (GWM)", models: ["Select GWM model...", "ORA Funky Cat (Good Cat / Haomao - EV)", "ORA Lightning Cat (EV)", "WEY Coffee 01 (PHEV)", "WEY Coffee 02 (PHEV)", "Tank 500 PHEV", "Other GWM EV/Hybrid"] },
  { name: "Chery", models: ["Select Chery model...", "EQ1 (Little Ant - EV)", "QQ Ice Cream (EV)", "Tiggo 8 Pro e+ (PHEV)", "Omoda 5 EV", "Other Chery EV/Hybrid"] },
  { name: "Geely", models: ["Select Geely model...", "Geometry A/C/E (EV)", "Zeekr 001/009/X (EV - Premium Brand)", "Galaxy L7 (PHEV)", "Other Geely EV/Hybrid"] },
  { name: "MG", models: ["Select MG model...", "MG4 EV (Mulan - EV)", "MG5 EV", "ZS EV", "HS PHEV", "Marvel R Electric (EV)", "Cyberster (EV Roadster)", "Other MG EV/Hybrid"] },
  { name: "Tata", models: ["Select Tata model...", "Nexon EV", "Tiago EV", "Tigor EV", "Punch EV", "Curvv EV (Concept/Upcoming)", "Avinya EV (Concept/Upcoming)", "Other Tata EV/Hybrid"] },
  { name: "Mahindra", models: ["Select Mahindra model...", "XUV400 (EV)", "eKUV100 (EV - Phased out?)", "eVerito (EV - Phased out?)", "BE.05 / BE.07 (Upcoming EVs)", "XUV.e8 / XUV.e9 (Upcoming EVs)", "Other Mahindra EV/Hybrid"] },
  { name: "Other EV/Hybrid Brand", models: ["Please specify model in description"] }
];


export const CHARGING_METHODS: string[] = [
  "Select primary charging method...",
  "Home AC (Slow Charging)",
  "Public AC (Destination Charging)",
  "Public DC (Fast Charging)",
  "Workplace Charging",
  "Mixed (Home & Public)",
  "Other"
];


export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 1,
    name: "Aline U.",
    location: "Gasabo District, Kigali",
    text: "Virtual Diagnosis gave a quick idea of my EV's issue. The e-mechanic follow-up was thorough and helped me understand the payment for the full service.",
    avatarUrl: "https://picsum.photos/seed/aline_avatar/100/100"
  },
  {
    id: 2,
    name: "John K.",
    location: "Nyarugenge, Kigali",
    text: "I used Spares Part Hunter and found a rare component for my hybrid quickly. The team contacted me with options the same day. Great free service!",
    avatarUrl: "https://picsum.photos/seed/johnk_avatar/100/100"
  },
  {
    id: 3,
    name: "Fatima S.",
    location: "Kicukiro, Kigali",
    text: "The Battery Life Prediction service gave me a useful preliminary insight. The team contacted me to discuss a detailed report.",
    avatarUrl: "https://picsum.photos/seed/fatima_avatar/100/100"
  }
];

export const SAMPLE_OBD_PRODUCTS: OBDProduct[] = [
  {
    id: "obd001",
    name: "SmartLink OBD-II Basic",
    description: "Your essential partner for quick EV/Hybrid diagnostics. Bluetooth connectivity, reads common trouble codes.",
    price: 45000, 
    imageUrl: "https://picsum.photos/seed/obd1/400/300",
    features: ["Bluetooth 4.0", "Reads DTCs", "Live Data Stream (Basic)", "EV Battery Health (Basic)"],
    compatibility: "Most 2006+ EV/Hybrid vehicles",
  },
  {
    id: "obd002",
    name: "SmartScan Pro OBD-II",
    description: "Advanced diagnostics for enthusiasts and pros. Wi-Fi & Bluetooth, deep system scans, coding capabilities.",
    price: 85000, 
    imageUrl: "https://picsum.photos/seed/obd2/400/300",
    features: ["Wi-Fi & Bluetooth 5.0", "Advanced DTCs & Definitions", "Full System Scan", "Bidirectional Controls (Selected Models)", "EV Battery Deep Analysis", "Software Updates"],
    compatibility: "Wide range of EV/Hybrid vehicles, specific model support varies",
  },
  {
    id: "obd003",
    name: "SmartGarage Connect OBD-II",
    description: "Seamless integration with the SmartGarage App. Real-time monitoring, predictive maintenance alerts, and remote diagnostics support.",
    price: 120000, 
    imageUrl: "https://picsum.photos/seed/obd3/400/300",
    features: ["App-Integrated", "Real-time Telemetry", "Predictive Maintenance Hints", "Remote Diagnostics Support", "Over-the-Air Updates"],
    compatibility: "Optimized for SmartGarage App users, broad vehicle support",
  }
];

export const VIRTUAL_DIAGNOSIS_STEPS_CONFIG: StepConfig[] = [
  { id: VirtualDiagnosisStep.SELECT_MODEL_BRAND_VIN, titleKey: 'vdStepSelectModelBrandVin', fields: ['carBrand', 'carModel', 'vin'] },
  { id: VirtualDiagnosisStep.DESCRIBE_ISSUE, titleKey: 'vdStepDescribeIssue', fields: ['issueDescription'] },
  { id: VirtualDiagnosisStep.VIEW_AI_REPORT, titleKey: 'vdStepViewAIReport' },
  { id: VirtualDiagnosisStep.EMECHANIC_CONSULTATION_PAYMENT_INFO, titleKey: 'vdStepEMechanicConsultationPaymentInfo' },
  { id: VirtualDiagnosisStep.CONTACT_FOR_EMECHANIC, titleKey: 'vdStepContactForEMechanic', fields: ['contactEmail', 'contactPhone'] },
  { id: VirtualDiagnosisStep.FINAL_CONFIRMATION_PAYMENT_CODE, titleKey: 'vdStepFinalConfirmationPaymentCode' },
];

// SAMPLE_COMMUNITY_POSTS will be fetched from DB, this can be removed or kept as initial fallback
export const SAMPLE_COMMUNITY_POSTS: CommunityPost[] = [
  { id: 1, user_id: 'sample_user_1', author_name: 'EV Enthusiast Kigali', content: 'Just got my new EV! Any tips for maximizing battery life in Kigali weather? Looking for insights on charging cycles.', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 2, user_id: 'sample_user_2', author_name: 'Hybrid Pro Rwanda', content: 'Sharing my experience with regenerative braking on hilly roads around Kigali. It really makes a difference for hybrids! Also, what are common maintenance checks for a 5-year-old hybrid?', created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
];


export const TRANSLATIONS: Translations = {
  // Navigation & General Service Names
  navVirtualDiagnosis: { [Language.EN]: "Virtual Diagnosis", [Language.RW]: "Isuzuma Ryihuse (AI)" },
  navBatteryPrediction: { [Language.EN]: "Battery Prediction", [Language.RW]: "Ubuzima bwa Batiri" },
  navSparesHunter: { [Language.EN]: "Spares Part Hunter", [Language.RW]: "Gushaka Ibyuma" },
  navOBDShop: { [Language.EN]: "OBD Info", [Language.RW]: "Amakuru kuri OBD" },
  navGarageSolutions: { [Language.EN]: "Garage Solutions", [Language.RW]: "Ibisubizo by'Amagaraji" },
  navCommunity: { [Language.EN]: "Community", [Language.RW]: "Umuryango" },
  navSupport: { [Language.EN]: "Support", [Language.RW]: "Ubufasha" },
  navLanguageEN: { [Language.EN]: "English", [Language.RW]: "Icyongereza" },
  navLanguageRW: { [Language.EN]: "Kinyarwanda", [Language.RW]: "Kinyarwanda" },
  navLogin: { [Language.EN]: "Login", [Language.RW]: "Injira" },
  navRegister: { [Language.EN]: "Register", [Language.RW]: "Iyandikishe" },
  navLogout: { [Language.EN]: "Logout", [Language.RW]: "Sohoka" },
  navMyProfile: { [Language.EN]: "My Profile", [Language.RW]: "Profile Yanjye" },
  loginToEngage: { [Language.EN]: "Login to Engage Fully!", [Language.RW]: "Injira Wigire Uruhare Rwuzuye!" },
  goToCommunity: { [Language.EN]: "Go to Community", [Language.RW]: "Jya mu Muryango" },
  findParts: { [Language.EN]: "Find My Part", [Language.RW]: "Shaka Igice Cyanyuma" },
  requestOBDInfo: { [Language.EN]: "Request Info", [Language.RW]: "Saba Amakuru" },

  // Hero Section
  heroHeadlinePart1: { [Language.EN]: "Your Car Speaks.", [Language.RW]: "Imodoka Yawe Ivuga." },
  heroHeadlinePart2: { [Language.EN]: "We Listen. Intelligently.", [Language.RW]: "Turumva. Tubyitayeho." },
  heroSubtext: { [Language.EN]: "AI-powered care for EVs & hybrids in Africa—smarter diagnostics, predictive maintenance, and genuine parts access.", [Language.RW]: "Ubufasha bukoresha AI ku modoka z'amashanyarazi n'izivanga muri Afurika—isuzuma ryihuse, kumenya mbere ibizaba, n'uburyo bwo kubona ibyuma by'umwimerere." },
  startAIDiagnosis: { [Language.EN]: "Start AI Diagnosis", [Language.RW]: "Tangira Isuzuma rya AI" },
  exploreOBD: { [Language.EN]: "Explore OBD Scanners", [Language.RW]: "Reba Ibyuma bya OBD" }, 
  forGarages: { [Language.EN]: "Garage ERP Solutions", [Language.RW]: "Porogaramu za ERP ku Magaraji" },

  // Stats
  statEvsServiced: { [Language.EN]: "EVs Serviced in Rwanda", [Language.RW]: "EVs Zakorewe mu Rwanda" },
  statHappyClients: { [Language.EN]: "Happy EV/Hybrid Owners", [Language.RW]: "Abanyev n'Hybrid Bishimye" },
  statPartsSourced: { [Language.EN]: "Genuine Parts Sourced", [Language.RW]: "Ibyuma Byabonetse" },
  statAvgResponseTime: { [Language.EN]: "Avg. Initial AI Assessment Time", [Language.RW]: "Igihe Cy'Isuzumwa Rya AI" },

  // Services Section
  ourServicesTitle: { [Language.EN]: "Intelligent Auto Care, Simplified", [Language.RW]: "Ubwitonzi bw'Imodoka, Byoroshye" },
  ourServicesSubtitle: { [Language.EN]: "From AI diagnostics to community support, we offer comprehensive solutions for your EV & Hybrid needs.", [Language.RW]: "Kuva ku isuzuma rya AI kugeza ku bufasha bw'umuryango, dutanga ibisubizo byuzuye ku byo ukeneye kuri EV & Hybrid yawe." },
  
  // Testimonials
  testimonialsTitle: { [Language.EN]: "Loved by EV Owners Across Rwanda", [Language.RW]: "Bikunzwe n'Abatunze EV mu Rwanda Hose" },

  // For Garages CTA
  forGaragesTitle: { [Language.EN]: "Are You a Garage Owner?", [Language.RW]: "Uri Nyir'Igaraji?" },
  forGaragesText: { [Language.EN]: "Partner with SmartGarage to offer cutting-edge EV services and access our advanced ERP solutions. Let's drive the future of auto care together.", [Language.RW]: "Fatanya na SmartGarage gutanga serivisi zigezweho za EV no kubona porogaramu zacu za ERP. Reka tuyobore ejo hazaza h'ubwita ku modoka hamwe." },

  // VIRTUAL DIAGNOSIS
  vdStepSelectModelBrandVin: { [Language.EN]: "1. Vehicle Details", [Language.RW]: "1. Amakuru y'Imodoka" },
  vdStepDescribeIssue: { [Language.EN]: "2. Issue", [Language.RW]: "2. Ikibazo" },
  vdStepViewAIReport: { [Language.EN]: "3. AI Report", [Language.RW]: "3. Raporo ya AI" },
  vdStepEMechanicConsultationPaymentInfo: { [Language.EN]: "4. E-Mechanic & Payment", [Language.RW]: "4. E-Mechanic & Kwishyura" },
  vdStepContactForEMechanic: { [Language.EN]: "5. Contact", [Language.RW]: "5. Twandikire" },
  vdStepFinalConfirmationPaymentCode: { [Language.EN]: "6. Confirmed", [Language.RW]: "6. Byemejwe" },

  vdSelectCarBrand: { [Language.EN]: "Select Car Brand", [Language.RW]: "Hitamo Ubwoko bw'Ikirango cy'Imodoka" },
  vdSelectCarModel: { [Language.EN]: "Select Car Model", [Language.RW]: "Hitamo Ubwoko bw'Imodoka" },
  vdErrorSelectBrandFirst: { [Language.EN]: "Select a brand first", [Language.RW]: "Hitamo ikirango mbere" },
  vdEnterVIN: { [Language.EN]: "Enter VIN (Optional)", [Language.RW]: "Andika VIN (Si ngombwa)" },
  vdVINPlaceholder: { [Language.EN]: "17-character Vehicle Identification Number", [Language.RW]: "Nimero y'Imodoka igizwe n'inyuguti 17" },
  vdDescribeIssue: { [Language.EN]: "Describe Your Issue in Detail", [Language.RW]: "Sobanura Ikibazo Cyawe neza" },
  vdDescribeIssuePlaceholder: { [Language.EN]: "e.g., Loud humming noise from the front when accelerating, battery drains quickly overnight, warning light XYZ is on...", [Language.RW]: "Urugero: Urusaku rwinshi ruturutse imbere iyo nihuta, batiri ishira vuba nijoro, itara ry'ikimenyetso XYZ riraka..." },
  vdUploadPhoto: { [Language.EN]: "Upload Dashboard/Relevant Photo (Optional)", [Language.RW]: "Ongeraho Ifoto ya Dashibodi/Ifoto Ifite Akamaro (Si ngombwa)" },
  vdGetAIReport: { [Language.EN]: "Get Initial AI Assessment", [Language.RW]: "Bona Isuzuma Ryibanze rya AI" },
  vdSubmitting: { [Language.EN]: "Generating Your Initial AI Assessment...", [Language.RW]: "Turimo Gutegura Isuzuma Ryawe Ryibanze rya AI..." },
  vdAIReportTitle: { [Language.EN]: "Initial AI Assessment Report", [Language.RW]: "Raporo y'Ibanze y'Isuzumwa rya AI" },
  vdAIReportShortenedInfo: { [Language.EN]: "This is a brief initial assessment. For a comprehensive diagnosis and repair plan, our e-mechanics are here to help.", [Language.RW]: "Iri ni isuzuma rigufi ry'ibanze. Kugira ngo ubone isuzuma ryuzuye na gahunda yo gukora, aba e-mechanic bacu bari hano ngo bagufashe." },
  
  vdEMechanicConsultationTitle: { [Language.EN]: "E-Mechanic Consultation & Full Report", [Language.RW]: "Ubujyanama bw'E-Mechanic na Raporo Yuzuye" },
  vdEMechanicConsultationText: { [Language.EN]: "Our certified e-mechanics will review your case based on the AI assessment and your inputs. They will contact you for a detailed consultation. The full service, including this consultation and a comprehensive report with repair guidance and cost estimates, requires a payment. Payment details will be provided by the e-mechanic during your consultation.", [Language.RW]: "Aba e-mechanic bacu bemewe bazasuzuma ikibazo cyawe bashingiye ku isuzuma rya AI n'ibyo watanze. Bazakwandikira bakugishe inama irambuye. Serivisi yuzuye, harimo iyi nama na raporo irambuye ifite amabwiriza yo gukora n'igereranya ry'ibiciro, isaba kwishyura. Amakuru yo kwishyura uzayahabwa n'e-mechanic mu gihe cy'inama yanyu." },
  vdProceedToEMechanicContact: { [Language.EN]: "Proceed to Share Contact for E-Mechanic", [Language.RW]: "Komeza Usharinge Amakuru y'E-Mechanic" },

  vdEnterContactDetails: { [Language.EN]: "Provide your contact details for the e-mechanic:", [Language.RW]: "Tanga amakuru yawe yo guhamagarwa n'e-mechanic:" },
  vdSubmitForEMechanic: { [Language.EN]: "Send to E-Mechanic", [Language.RW]: "Ohereza kuri E-Mechanic" },
  vdEMechanicConfirmationPaymentCode: { [Language.EN]: "Thank you! Your request has been submitted. Our e-mechanic team will contact you via {contactMethod} shortly to discuss your case and provide payment details for the full diagnostic service. Please check your messages/calls.", [Language.RW]: "Murakoze! Ubusabe bwawe bwakiriwe. Itsinda ryacu ry'aba e-mechanic rizakwandikira kuri {contactMethod} vuba ngo muganire ku kibazo cyawe no kuguha amakuru yo kwishyura serivisi yuzuye y'isuzuma. Nyamuneka reba ubutumwa/guhamagarwa kwawe." },
  vdErrorSelectBrand: { [Language.EN]: "Please select your car brand.", [Language.RW]: "Nyamuneka hitamo ikirango cy'imodoka yawe." },
  vdErrorSelectModel: { [Language.EN]: "Please select your car model.", [Language.RW]: "Nyamuneka hitamo ubwoko bw'imodoka yawe." },
  vdErrorDescribeIssue: { [Language.EN]: "Please describe the issue you are experiencing.", [Language.RW]: "Nyamuneka sobanura ikibazo ufite." },
  
  reportSectionPotentialProblems: { [Language.EN]: "Potential Problem(s)", [Language.RW]: "Ibishobora Kuba Ikibazo" },
  reportSectionImmediateChecks: { [Language.EN]: "Immediate Checks (User Verifiable)", [Language.RW]: "Ibyo Wahita Ugenzura (Umukoresha)" },
  reportSectionProfessionalRecs: { [Language.EN]: "Professional Recommendations", [Language.RW]: "Inama z'Ababigize Umwuga" },
  reportSectionUrgency: { [Language.EN]: "Estimated Urgency", [Language.RW]: "Ubwihutirwe Bwagereranijwe" },
  reportSectionSummary: { [Language.EN]: "Summary", [Language.RW]: "Incāmāke" },
  reportSectionImageNotes: { [Language.EN]: "Image Analysis Notes", [Language.RW]: "Ibitekerezo ku Isesengura ry'Ifoto" },
  reportSectionDisclaimer: { [Language.EN]: "Disclaimer", [Language.RW]: "Itangazo Ryihariye" },
  confidenceHigh: { [Language.EN]: "High", [Language.RW]: "Haringaniye Cyane" },
  confidenceMedium: { [Language.EN]: "Medium", [Language.RW]: "Haringaniye" },
  confidenceLow: { [Language.EN]: "Low", [Language.RW]: "Hasi" },

  // Battery Prediction
  batteryPredictionTitle: { [Language.EN]: "EV & Hybrid Battery Life Prediction", [Language.RW]: "Kumenya Ubuzima bwa Batiri ya EV & Hybrid" },
  batteryPredictionDesc: { [Language.EN]: "Get insights into your battery's health and estimated lifespan. Understand how your driving and charging habits affect it.", [Language.RW]: "Menya byinshi ku buzima bwa batiri yawe n'igihe ishobora kumara. Sobanukirwa uko imigendere yawe n'uburyo bwo gusharija bigira ingaruka." },
  bpEnterDetails: { [Language.EN]: "Enter Your Vehicle & Usage Details:", [Language.RW]: "Andika Amakuru y'Imodoka yawe n'Uko Uyikoresha:" },
  bpMileage: { [Language.EN]: "Current Mileage (km)", [Language.RW]: "Kilometero Zimaze Gukorwa (km)" },
  bpMileagePlaceholder: { [Language.EN]: "e.g., 50000", [Language.RW]: "Urugero: 50000" },
  bpAvgDriving: { [Language.EN]: "Average Driving Distance (km per day/week)", [Language.RW]: "Intera Ukora (km ku munsi/icyumweru)" },
  bpAvgDrivingPlaceholder: { [Language.EN]: "e.g., 40km per day", [Language.RW]: "Urugero: 40km ku munsi" },
  bpChargingMethod: { [Language.EN]: "Primary Charging Method", [Language.RW]: "Uburyo Bukuru bwo Gusharija" },
  bpGetPreliminaryInsight: { [Language.EN]: "Get Preliminary Insight", [Language.RW]: "Bona Incamake y'Ibanze" },
  bpPreliminaryInsightTitle: { [Language.EN]: "Preliminary Battery Insight", [Language.RW]: "Incamake y'Ibanze ku Buzima bwa Batiri" },
  bpGenericInsight: { [Language.EN]: "Based on typical usage for vehicles like yours, your battery appears to be performing within expected parameters. For a detailed lifespan prediction, degradation analysis, and personalized charging advice, please provide your contact details. Our specialists will reach out.", [Language.RW]: "Dushingiye ku mikoreshereze isanzwe y'imodoka nk'iyawe, batiri yawe isa n'aho iri gukora neza. Kugira ngo ubone raporo irambuye ku gihe ishobora kumara, isesengura ry'isenyuka ryayo, n'inama zihariye zo gusharija, nyamuneka tanga amakuru yawe. Abahanga bacu bazakwandikira." },
  bpContactForReport: { [Language.EN]: "Enter your email/phone for our specialists to contact you with a detailed battery health analysis and advice:", [Language.RW]: "Andika email/telefone yawe kugira ngo abahanga bacu bakwandikire baguhe isesengura rirambuye ry'ubuzima bwa batiri n'inama:" },
  bpReportConfirmation: { [Language.EN]: "Thank you! Your request has been submitted. Our battery specialists will analyze your information and contact you at {contactMethod} within 24-48 hours with detailed insights and advice.", [Language.RW]: "Murakoze! Ubusabe bwawe bwakiriwe. Abahanga bacu mu bya batiri bazasesengura amakuru yawe bakwandikire kuri {contactMethod} mu masaha 24-48 baguha amakuru arambuye n'inama." },

  // Spares Part Hunter
  sparesHunterTitle: { [Language.EN]: "Spares Part Hunter", [Language.RW]: "Gushakisha Ibyuma by'Imodoka" },
  sparesHunterDesc: { [Language.EN]: "Need a specific EV or Hybrid part? Describe it, and our team will help you find it. This is a free service!", [Language.RW]: "Ukeneye icyuma runaka cya EV cyangwa Hybrid? Kisobanure, maze itsinda ryacu rigufashe kukibona. Iyi serivisi ni ubuntu!" },
  shDescribePart: { [Language.EN]: "Describe the Part You Need", [Language.RW]: "Sobanura Icyuma Ukeneye" },
  shDescribePartPlaceholder: { [Language.EN]: "e.g., 'Front left headlight assembly for Toyota Prius 2018', 'Charging port cover for Nissan Leaf Gen 2', 'Specific sensor model number if known'...", [Language.RW]: "Urugero: 'Igice cy'itara ry'imbere ibumoso rya Toyota Prius 2018', 'Igipfukisho cy'umwanya wo gusharijiramo cya Nissan Leaf Gen 2', 'Nimero y'icyuma runaka niba iyizi'..." },
  shUploadPartPhoto: { [Language.EN]: "Upload Photo of the Part (Optional)", [Language.RW]: "Ohereza Ifoto y'Icyuma (Si ngombwa)" },
  shCarModelOptional: { [Language.EN]: "Car Model (Optional, helps us find it faster)", [Language.RW]: "Ubwoko bw'Imodoka (Si ngombwa, bidufasha kuyibona vuba)" },
  shFindMyPart: { [Language.EN]: "Submit Part Request", [Language.RW]: "Ohereza Ubusabe bw'Igice" },
  shContactForSearch: { [Language.EN]: "Our parts specialists will search for your item and contact you. Please provide your preferred contact method:", [Language.RW]: "Abahanga bacu mu byuma bazashakisha icyuma cyawe bakwandikire. Nyamuneka tanga uburyo wifuza ko twakwandikira:" },
  shSearchConfirmation: { [Language.EN]: "Thank you! Your part request has been submitted. Our parts specialists are on the case. We'll contact you at {contactMethod} with sourcing options or if more details are needed.", [Language.RW]: "Murakoze! Ubusabe bwawe bw'igice bwakiriwe. Abahanga bacu mu byuma batangiye gushakisha. Turakwandikira kuri {contactMethod} tukubwira aho ushobora kubona icyuma cyawe cyangwa niba dukeneye andi makuru." },
  errorDescribePart: { [Language.EN]: "Please describe the part you need.", [Language.RW]: "Nyamuneka sobanura icyuma ukeneye." },
  optional: { [Language.EN]: "Optional", [Language.RW]: "Si ngombwa" },
  selectOptional: { [Language.EN]: "Select Model (Optional)", [Language.RW]: "Hitamo Ubwoko (Si ngombwa)" },
  shDescribePartDetails: { [Language.EN]: "1. Part Details", [Language.RW]: "1. Amakuru y'Igice" },
  shEnterContact: { [Language.EN]: "2. Your Contact", [Language.RW]: "2. Amakuru Yawe" },
  shConfirmationTitle: { [Language.EN]: "Request Submitted", [Language.RW]: "Ubusabe Bwakiriwe" },


  // Community Hub & Auth
  communityHubTitle: { [Language.EN]: "EV Community Hub", [Language.RW]: "Umuryango w'Abakoresha EV" },
  communityHubDesc: { [Language.EN]: "Connect with other EV owners in Rwanda. See posts, car hints, and EV trends.", [Language.RW]: "Hura n'abandi bakoresha EV mu Rwanda. Reba ubutumwa, ibitekerezo ku modoka, n'amakuru agezweho kuri EV." },
  communityLoginPrompt: { [Language.EN]: "Login or Register to create posts and engage fully.", [Language.RW]: "Injira cyangwa wiyandikishe kugira ngo wandike ubutumwa kandi wigire uruhare rwuzuye." },
  communitySignInBenefits: { [Language.EN]: "Sign in to receive news updates, maintenance reminders (e.g., Contrôle Technique, Insurance), and personalized content!", [Language.RW]: "Injira wakire amakuru mashya, ibyibutso byo gusuzumisha imodoka (urugero: Contrôle Technique, Ubwishingizi), n'ibindi byihariye!" },
  createPost: { [Language.EN]: "Create Post", [Language.RW]: "Andika Ubutumwa" },
  cancelPost: { [Language.EN]: "Cancel", [Language.RW]: "Rekura" },
  recentPosts: { [Language.EN]: "Recent Posts & EV Hints", [Language.RW]: "Ubutumwa Buheruka & Ibitekerezo kuri EV" },
  noPostsYet: { [Language.EN]: "No posts yet. Be the first to share something or check back for EV hints!", [Language.RW]: "Nta butumwa burimo. Ba uwa mbere usangize ikintu cyangwa ugaruke nyuma urebe ibitekerezo kuri EV!" },
  submitPost: { [Language.EN]: "Submit Post", [Language.RW]: "Ohereza Ubutumwa" },
  postContentPlaceholder: { [Language.EN]: "What's on your mind? Share tips, ask questions...", [Language.RW]: "Utekereza iki? Sangiza inama, baza ibibazo..." },
  postSubmitted: { [Language.EN]: "Post submitted successfully!", [Language.RW]: "Ubutumwa bwoherejwe neza!" },
  postContentEmpty: { [Language.EN]: "Post content cannot be empty.", [Language.RW]: "Ubutumwa ntibushobora kuba busa." },
  loginTitle: { [Language.EN]: "Login to Your Account", [Language.RW]: "Injira muri Konti Yawe" },
  registerTitle: { [Language.EN]: "Create New Account", [Language.RW]: "Fungura Konti Nshya" },
  emailLabel: { [Language.EN]: "Email Address", [Language.RW]: "Aderesi ya Email" },
  passwordLabel: { [Language.EN]: "Password", [Language.RW]: "Ijambobanga" },
  confirmPasswordLabel: { [Language.EN]: "Confirm Password", [Language.RW]: "Emeza Ijambobanga" },
  nameLabel: { [Language.EN]: "Full Name", [Language.RW]: "Amazina Yuzuye" },
  loginButton: { [Language.EN]: "Login", [Language.RW]: "Injira" },
  registerButton: { [Language.EN]: "Register", [Language.RW]: "Iyandikishe" },
  dontHaveAccount: { [Language.EN]: "Don't have an account?", [Language.RW]: "Nta konti ufite?" },
  alreadyHaveAccount: { [Language.EN]: "Already have an account?", [Language.RW]: "Usanganywe konti?" },
  loginSuccess: { [Language.EN]: "Login successful! Redirecting...", [Language.RW]: "Winjiye neza! Turakuyobora..." },
  registrationSuccess: { [Language.EN]: "Registration successful!", [Language.RW]: "Wiyandikishije neza!" }, // Simplified, will add email confirm note below
  loginPromptAfterRegister: { [Language.EN]: "Please check your email to confirm your account, then you can login.", [Language.RW]: "Nyamuneka reba email yawe wemeze konti, hanyuma ushobore kwinjira." },
  authError: { [Language.EN]: "Authentication failed. Please check your credentials or try again.", [Language.RW]: "Kwinjira byanze. Nyamuneka reba neza amakuru yawe cyangwa wongere ugerageze." },
  passwordMismatch: { [Language.EN]: "Passwords do not match.", [Language.RW]: "Amagambo banga ntabwo ahuye." },
  fillAllFields: { [Language.EN]: "Please fill in all required fields.", [Language.RW]: "Nyamuneka uzuza imyanya yose isabwa." },
  emailPlaceholder: { [Language.EN]: "your.email@example.com", [Language.RW]: "email.yawe@urugero.com" },
  passwordPlaceholder: { [Language.EN]: "Enter your password", [Language.RW]: "Andika ijambobanga ryawe" },
  confirmPasswordPlaceholder: { [Language.EN]: "Confirm your password", [Language.RW]: "Emeza ijambobanga ryawe" },
  namePlaceholder: { [Language.EN]: "Enter your full name", [Language.RW]: "Andika amazina yawe yuzuye" },

  
  // OBD Shop (Request Info Flow)
  obdShopTitle: { [Language.EN]: "SmartGarage OBD Scanners - Request Info", [Language.RW]: "Ibyuma bya SmartGarage OBD - Saba Amakuru" },
  obdShopIntro: { [Language.EN]: "Unlock your car's full potential. Learn more about our OBD scanners and how they integrate with the SmartGarage app.", [Language.RW]: "Fungura ubushobozi bwose bw'imodoka yawe. Menya byinshi ku byuma byacu bya OBD n'uko bihuza na porogaramu ya SmartGarage." },
  features: { [Language.EN]: "Features", [Language.RW]: "Ibiranga" },
  compatibility: { [Language.EN]: "Compatibility", [Language.RW]: "Ibihuza" },
  requestInfo: { [Language.EN]: "Request Info", [Language.RW]: "Saba Amakuru" },
  obdInquiryTitle: { [Language.EN]: "Request Information for {productName}", [Language.RW]: "Saba Amakuru kuri {productName}" },
  obdInquiryPrompt: { [Language.EN]: "Interested in this OBD scanner? Fill out your details below, and our team will contact you with more information and purchasing options.", [Language.RW]: "Ushishikajwe n'iki cyuma cya OBD? Uzuza amakuru yawe hano hepfo, maze itsinda ryacu rizakwandikira riguha andi makuru n'uburyo bwo kugura." },
  obdInquirySubmittedTitle: { [Language.EN]: "Inquiry Sent!", [Language.RW]: "Ubusabe Bwoherejwe!" },
  obdInquirySubmittedMsg: { [Language.EN]: "Thank you, {userName}! We've received your inquiry for the {productName}. Our team will contact you at {contactDetail} shortly with more information.", [Language.RW]: "Murakoze, {userName}! Twakiriye ubusabe bwanyu kuri {productName}. Itsinda ryacu rizakwandikira kuri {contactDetail} vuba riguha andi makuru." },
  obdMessagePlaceholder: { [Language.EN]: "Any specific questions?", [Language.RW]: "Hari ibibazo byihariye ufite?" },
  productName: { [Language.EN]: "Product Name", [Language.RW]: "Izina ry'Igicuruzwa" },
  yourMessageOptional: { [Language.EN]: "Your Message (Optional)", [Language.RW]: "Ubutumwa Bwawe (Si ngombwa)" },
  noProductsAvailable: { [Language.EN]: "No OBD scanners available at the moment. Please check back soon!", [Language.RW]: "Nta byuma bya OBD bihari kuri ubu. Nyamuneka ongera urebe vuba!"},
  priceOnRequest: { [Language.EN]: "Price on Request", [Language.RW]: "Igiciro ku Busabe"},


  // Garage Solutions
  garageSolutionsTitle: { [Language.EN]: "Empower Your Garage with SmartGarage ERP", [Language.RW]: "Ongera Imbaraga Igaraji Yawe na SmartGarage ERP" },
  garageSolutionsHero: { [Language.EN]: "Streamline Operations, Boost Efficiency, and Delight Customers with our tailored ERP for modern EV & Hybrid auto shops.", [Language.RW]: "Koroshya Ibikorwa, Ongera Umusaruro, kandi Ushimishe Abakiriya na porogaramu yacu ya ERP yagenewe amagaraji agezweho akora EV & Hybrid." },
  garageFeatureAIDiagnostics: { [Language.EN]: "AI-Powered Diagnostics Integration", [Language.RW]: "Guhuza n'Isuzuma rikoresha AI" },
  garageFeatureAIDiagnosticsDesc: { [Language.EN]: "Integrate AI diagnostics directly into your workflow for faster, more accurate EV/Hybrid diagnostics.", [Language.RW]: "Huza isuzuma rya AI mu bikorwa byawe bya buri munsi kugira ngo ubone isuzuma ryihuse kandi ritomoye ry'imodoka za EV/Hybrid." },
  garageFeatureAppointments: { [Language.EN]: "Automated Appointment Scheduling", [Language.RW]: "Guhanga Gahunda zo Guhura Automatic" },
  garageFeatureAppointmentsDesc: { [Language.EN]: "Smart scheduling for customers, optimized for technician availability and EV charging times.", [Language.RW]: "Gahunda zihariye ku bakiriya, zigenewe kuboneka kw'abatekinisiye n'ibihe byo gusharija EV." },
  garageFeatureInventory: { [Language.EN]: "EV Parts Inventory Management", [Language.RW]: "Gucunga Ibikoresho by'Imodoka z'Amashanyarazi" },
  garageFeatureInventoryDesc: { [Language.EN]: "Manage specialized EV and Hybrid parts inventory with predictive ordering and supplier integration.", [Language.RW]: "Cunga neza ibikoresho byihariye by'imodoka za EV na Hybrid, hamwe no gutumiza mbere no guhuza n'abatanga ibikoresho." },
  garageFeatureCRM: { [Language.EN]: "Customer Relationship Management (CRM)", [Language.RW]: "Gucunga Umubano n'Abakiriya (CRM)" },
  garageFeatureCRMDesc: { [Language.EN]: "Build lasting customer relationships with EV-specific service history, reminders, and communication tools.", [Language.RW]: "Wubake umubano urambye n'abakiriya ukoresheje amateka ya serivisi yihariye ya EV, ibyibutso, n'ibikoresho byo kuvugana." },
  garageFeatureWorkflow: { [Language.EN]: "Technician Workflow Optimization", [Language.RW]: "Kunonosora Imikorere y'Abatekinisiye" },
  garageFeatureWorkflowDesc: { [Language.EN]: "Optimize technician tasks, track job progress, and ensure quality control for complex EV repairs.", [Language.RW]: "Nonosora imirimo y'abatekinisiye, kurikirana iterambere ry'akazi, kandi urebe neza igenzura ry'ubuziranenge ku gukora EV bigoye." },
  garageFeatureAnalytics: { [Language.EN]: "Analytics and Reporting", [Language.RW]: "Isesengura n'Amakuru" },
  garageFeatureAnalyticsDesc: { [Language.EN]: "Gain insights into your garage's performance with detailed reports on EV services, parts usage, and customer trends.", [Language.RW]: "Menya byinshi ku mikorere y'igaraji yawe ukoresheje raporo zirambuye ku serivisi za EV, ikoreshwa ry'ibyuma, n'imigendekere y'abakiriya." },
  garageFeaturesTitle: { [Language.EN]: "Key Features of Our Garage ERP", [Language.RW]: "Iby'ingenzi biranga Porogaramu yacu ya ERP y'Amagaraji" },
  garageFeaturesSubtitle: { [Language.EN]: "Built from the ground up for the unique needs of electric and hybrid vehicle servicing.", [Language.RW]: "Yubatswe kuva hasi igenewe ibyihariye bikenewe mu gukora imodoka z'amashanyarazi na hybrid." },
  garageReadyTransformTitle: { [Language.EN]: "Ready to Transform Your Garage?", [Language.RW]: "Witeguye Guhindura Igaraji Yawe?" },
  garageReadyTransformDesc: { [Language.EN]: "Let's discuss how SmartGarage ERP can help you stay ahead in the evolving automotive landscape.", [Language.RW]: "Reka tuganire uburyo SmartGarage ERP ishobora kugufasha kuguma imbere mu isi y'imodoka igenda ihinduka." },
  requestDemo: { [Language.EN]: "Request a Demo", [Language.RW]: "Saba Igeragezwa" },
  demoRequestSubmitted: { [Language.EN]: "Thank you! Your demo request has been submitted. We will contact you shortly.", [Language.RW]: "Murakoze! Ubusabe bwanyu bwo kugerageza bwakiriwe. Turabahamagara vuba." },
  yourName: { [Language.EN]: "Your Name", [Language.RW]: "Izina Ryanyu" },
  garageName: { [Language.EN]: "Garage Name", [Language.RW]: "Izina ry'Igaraji" },
  emailAddress: { [Language.EN]: "Email Address", [Language.RW]: "Aderesi ya Email" },
  phoneNumber: { [Language.EN]: "Phone Number", [Language.RW]: "Nimero ya Terefone" },


  // Placeholder Pages (generic fallback)
  pageComingSoonTitle: { [Language.EN]: "Coming Soon", [Language.RW]: "Biri hafi" },
  pageComingSoonDesc: { [Language.EN]: "This feature is under development and will be available soon. Stay tuned!", [Language.RW]: "Iki gice kiri gutegurwa kandi kizaboneka vuba. Mukomeze mudukurikire!" },
  comingSoon: { [Language.EN]: "Feature Coming Soon!", [Language.RW]: "Iki Gice Kiri Hafi!" },


  // General UI & Common terms
  submit: { [Language.EN]: "Submit", [Language.RW]: "Emeza" },
  close: { [Language.EN]: "Close", [Language.RW]: "Funga" },
  next: { [Language.EN]: "Next", [Language.RW]: "Komeza" },
  back: { [Language.EN]: "Back", [Language.RW]: "Subira Inyuma" },
  learnMore: { [Language.EN]: "Learn More", [Language.RW]: "Menya Byinshi" },
  home: { [Language.EN]: "Home", [Language.RW]: "Ahabanza" },
  viewReport: { [Language.EN]: "View Report", [Language.RW]: "Reba Raporo" },
  backToHome: { [Language.EN]: "Back to Home", [Language.RW]: "Subira Ahabanza"},
  errorOccurred: { [Language.EN]: "An error occurred", [Language.RW]: "Habaye ikibazo"},
  errorDbSave: { [Language.EN]: "Failed to save your request. Please try again or contact support.", [Language.RW]: "Kwandika ubusabe bwawe byanze. Nyamuneka ongera ugerageze cyangwa uvugane n'ubufasha." },
  errorFileSize: { [Language.EN]: "Max 5MB allowed.", [Language.RW]: "Nturenze 5MB." },
  photoUploadHint: { [Language.EN]: "PNG, JPG, GIF up to 5MB. Clear dashboard lights or affected area.", [Language.RW]: "PNG, JPG, GIF kugeza 5MB. Ifoto igaragaza neza amatara ya dashibodi cyangwa ahangiritse."},
  uploading: { [Language.EN]: "Uploading...", [Language.RW]: "Kohereza ifoto..."},
  uploadPhoto: { [Language.EN]: "Upload Photo", [Language.RW]: "Ongeraho Ifoto"},
  removePhoto: { [Language.EN]: "Remove Photo", [Language.RW]: "Kura Ifoto"},
  skipPhoto: { [Language.EN]: "Skip Photo for Now", [Language.RW]: "Reka Ifoto Ubungubu"},
  takePhoto: { [Language.EN]: "Take Photo", [Language.RW]: "Fata Ifoto"},
  chooseFile: { [Language.EN]: "Choose File", [Language.RW]: "Hitamo Idosiye"},
  orDragAndDrop: { [Language.EN]: "or drag and drop", [Language.RW]: "cyangwa kanda ushyireho"},
  contactEmail: { [Language.EN]: "Email Address", [Language.RW]: "Aderesi ya Email"},
  contactPhone: { [Language.EN]: "Phone Number (e.g., 078XXXXXXX)", [Language.RW]: "Nimero ya Terefone (Urugero: 078XXXXXXX)"},
  or: { [Language.EN]: "OR", [Language.RW]: "CYANGWA"},
  contactPreference: { [Language.EN]: "How would you like us to contact you?", [Language.RW]: "Urifuza ko twakwandikira gute?"},
  contactViaEmail: { [Language.EN]: "Via Email", [Language.RW]: "Kuri Email"},
  contactViaPhone: { [Language.EN]: "Via Phone Call", [Language.RW]: "Guhamagarwa kuri Terefone"},
  pleaseProvideContact: { [Language.EN]: "Please provide at least one valid contact method.", [Language.RW]: "Nyamuneka tanga nibura uburyo bumwe bwemewe bwo kukwandikira."},
  invalidEmailFormat: { [Language.EN]: "Please enter a valid email address.", [Language.RW]: "Nyamuneka andika aderesi ya email yemewe." },
  invalidPhoneFormat: { [Language.EN]: "Please enter a valid Rwandan phone number (e.g., 078XXXXXXX).", [Language.RW]: "Nyamuneka andika nimero ya terefone y'u Rwanda yemewe (urugero: 078XXXXXXX)." },
  processing: { [Language.EN]: "Processing...", [Language.RW]: "Birimo gutunganywa..." },
  thankYou: { [Language.EN]: "Thank You!", [Language.RW]: "Murakoze!" },
  errorMissingFields: { [Language.EN]: "Required information is missing. Please check the form.", [Language.RW]: "Amakuru asabwa ntabwo yuzuye. Nyamuneka reba ifishi." },
  errorAIResponseFormat: { [Language.EN]: "AI response format error. Please try again.", [Language.RW]: "Ikosa mu buryo AI yasubijemo. Nyamuneka ongera ugerageze." },
  vdPriceInfo: { [Language.EN]: "Full Service Involves Fee", [Language.RW]: "Serivisi Yuzuye Isaba Kwishyura" },
  bpPriceInfo: { [Language.EN]: "Consultation Required", [Language.RW]: "Ubujyanama Burakenewe" },
  freeService: { [Language.EN]: "Free Service", [Language.RW]: "Serivisi y'Ubuntu" },
  obdPriceDisplay: { [Language.EN]: "Price: {price} RWF", [Language.RW]: "Igiciro: {price} RWF" }, 
  communityAccess: { [Language.EN]: "Free to View", [Language.RW]: "Kureba ni Ubuntu" },
  loginOrRegister: { [Language.EN]: "Login / Register", [Language.RW]: "Injira / Iyandikishe" },
  toolsNeeded: { [Language.EN]: "Tools needed", [Language.RW]: "Ibikoresho bikenewe"},
  contactMethodPreferenceInfo: { [Language.EN]: "Our team will use one of these methods to reach you.", [Language.RW]: "Itsinda ryacu rizakoresha bumwe muri ubu buryo kugirango ribone uko ribavugisha."},
  vdProceedToEMechanic: { [Language.EN]: "Request E-Mechanic Consultation", [Language.RW]: "Saba Ubujyanama bw'E-Mechanic"},
  signedInAs: { [Language.EN]: "Signed in as", [Language.RW]: "Winjiye nka" },
  errorInvalidMileage: { [Language.EN]: "Please enter valid current mileage (numbers only).", [Language.RW]: "Nyamuneka andika kilometero zimaze gukorwa (imibare gusa)." },
  errorInvalidDrivingDistance: { [Language.EN]: "Please enter average driving distance.", [Language.RW]: "Nyamuneka andika intera ukora." },
  errorSelectChargingMethod: { [Language.EN]: "Please select a primary charging method.", [Language.RW]: "Nyamuneka hitamo uburyo bukuru bwo gusharija." },
  otherEVHybridModel: { [Language.EN]: "Other EV/Hybrid Model", [Language.RW]: "Ubundi bwoko bwa EV/Hybrid"},
  loadingPosts: { [Language.EN]: "Loading posts...", [Language.RW]: "Turimo gushaka ubutumwa..."},
  confirmation: { [Language.EN]: "Confirmation", [Language.RW]: "Kwemeza"}, // Added for BatteryPrediction step title
};

// Ensure all AppView enum values used in navigations have corresponding navLabels and page titles in TRANSLATIONS
// Ensure all services have a price string or 'Free' for the ServiceCard
// Virtual Diagnosis: Updated text
// Battery Prediction: Updated text
// Spares Part Hunter: "Free Service"
// OBD Shop: price is displayed per item, action is "Request Info"
// Community Hub: "Free to View"
