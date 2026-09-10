// MediKiosk AI — Internationalization Strings
// Supported Languages: English (en), Hindi (hi), Tamil (ta), Bengali (bn)

export type SupportedLang = 'en' | 'hi' | 'ta' | 'bn';

export interface LangStrings {
  // App-level
  appName: string;
  tagline: string;

  // Language selection screen
  langSelectPrompt: string;
  langSelectAudio: string; // read aloud on mount

  // ABHA / Auth screen
  authTitle: string;
  authSubtitle: string;
  abhaLogin: string;
  aadhaarLogin: string;
  registerNew: string;
  abhaPlaceholder: string;
  aadhaarPlaceholder: string;
  loginBtn: string;
  orLabel: string;
  abhaHint: string;

  // Consent screen
  consentTitle: string;
  consentAudioIntro: string;
  consentBody: string;
  consentAgree: string;
  consentDisagree: string;
  consentVerbalPrompt: string; // spoken: "say yes to agree"

  // Progress step labels
  stepIdentify: string;
  stepConverse: string;
  stepScan: string;
  stepSummarize: string;
  stepDone: string;

  // Conversation / SOCRATES
  chiefComplaintQ: string;
  chiefComplaintAudio: string;
  durationQ: string;
  siteQ: string;
  siteAudio: string;
  onsetQ: string;
  onsetAudio: string;
  characterQ: string;
  characterAudio: string;
  radiationQ: string;
  radiationAudio: string;
  associatedQ: string;
  associatedAudio: string;
  timingQ: string;
  timingAudio: string;
  exacerbatingQ: string;
  exacerbatingAudio: string;
  relievingQ: string;
  relievingAudio: string;
  severityQ: string;
  severityAudio: string;

  // Past history questions
  pastMedicalQ: string;
  pastSurgicalQ: string;
  drugAllergyQ: string;
  familyHistoryQ: string;
  personalHistoryQ: string;
  rosQ: string; // Review of Systems

  // AYUSH Dashavidha
  ayushModeTitle: string;
  prakritiQ: string;
  vikritiQ: string;
  saraQ: string;
  samhananaQ: string;
  pramanaQ: string;
  satmyaQ: string;
  satvaQ: string;
  aharaShaktiQ: string;
  vyayamaShaktiQ: string;
  vayaQ: string;
  aharaPatternQ: string;
  viharaRoutineQ: string;

  // Document Scan
  scanTitle: string;
  scanInstruction: string;
  scanAudioGuide: string;
  scanDetected: string;
  scanHoldSteady: string;
  scanCaptured: string;
  skipScan: string;
  abnormalAlert: string;
  drugInteractionAlert: string;

  // Summary screen
  summaryTitle: string;
  summaryAudioConfirm: string; // "Here is what we recorded for you"
  pushToHisBtn: string;
  pushSuccess: string;
  fhirViewBtn: string;

  // Token / done
  tokenTitle: string;
  tokenAudio: string; // "You are number X in queue"
  waitMessage: string;
  returnToDashboard: string;

  // Accessibility toolbar
  audioOn: string;
  audioOff: string;
  highContrastOn: string;
  highContrastOff: string;
  fontSizeLabel: string;
  callStaff: string;
  callStaffMessage: string;

  // Common buttons
  next: string;
  back: string;
  repeat: string;
  submit: string;
  yes: string;
  no: string;
  skip: string;
  cancel: string;
  confirm: string;
  done: string;

  // Error / status
  errorGeneral: string;
  errorNoMic: string;
  processingLabel: string;
  listeningLabel: string;

  // Red flag
  redFlagTitle: string;
  redFlagBody: string;
  redFlagAction: string;

  // AYUSH system selection
  selectAyushSystem: string;
  ayushSystems: Record<string, string>;

  // Gender
  genderLabel: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;

  // Doctor screen
  doctorSummaryTitle: string;
  aiPopulatedNote: string;
  confirmAndSave: string;
}

const en: LangStrings = {
  appName: 'MediKiosk AI',
  tagline: 'AYUSH Smart Pre-Consultation System',

  langSelectPrompt: 'Please choose your language',
  langSelectAudio: 'Welcome to MediKiosk. Please tap your preferred language to continue.',

  authTitle: 'Welcome',
  authSubtitle: 'How would you like to identify yourself?',
  abhaLogin: 'Login with ABHA ID',
  aadhaarLogin: 'Login with Aadhaar',
  registerNew: 'Register as New Patient',
  abhaPlaceholder: 'e.g. 91-4829-1029-4821 or name@abdm',
  aadhaarPlaceholder: 'Enter 12-digit Aadhaar number',
  loginBtn: 'Verify & Continue',
  orLabel: 'OR',
  abhaHint: 'Your ABHA Health ID links your medical records',

  consentTitle: 'Your Privacy & Consent',
  consentAudioIntro: 'Before we begin, we need your permission to collect and use your health information. Please listen carefully.',
  consentBody: 'MediKiosk AI will collect your health history — symptoms, medical documents, and personal details — to help your doctor understand your condition before your appointment. Your data is protected under the Digital Personal Data Protection Act 2023. You can withdraw consent at any time. Your data will only be shared with your treating doctor. No information is shared with third parties without your explicit permission.',
  consentAgree: 'I Agree — Yes',
  consentDisagree: 'I Do Not Agree',
  consentVerbalPrompt: 'Say "yes" or tap the green button to agree',

  stepIdentify: 'Identify',
  stepConverse: 'Tell Us Your Problem',
  stepScan: 'Your Documents',
  stepSummarize: 'Review & Submit',
  stepDone: 'All Done',

  chiefComplaintQ: 'What is your main health problem today?',
  chiefComplaintAudio: 'What is the main health problem bringing you here today? You can speak or tap an option.',
  durationQ: 'How long have you had this problem?',
  siteQ: 'Where in your body do you feel the problem?',
  siteAudio: 'Tap or say where in your body you feel the problem.',
  onsetQ: 'How did it start?',
  onsetAudio: 'Did the problem come on suddenly, or did it start slowly and get worse over time?',
  characterQ: 'What does it feel like?',
  characterAudio: 'How would you describe the feeling? For example — is it a burning sensation, a dull ache, or a sharp stabbing pain?',
  radiationQ: 'Does it spread anywhere else?',
  radiationAudio: 'Does the pain or discomfort stay in one place, or does it spread to other parts of your body?',
  associatedQ: 'Do you have any other symptoms along with this?',
  associatedAudio: 'Are there any other problems happening at the same time? Tap all that apply.',
  timingQ: 'Is it there all the time, or does it come and go?',
  timingAudio: 'Is the problem there constantly, or does it come in waves or attacks?',
  exacerbatingQ: 'What makes it worse?',
  exacerbatingAudio: 'What makes the problem feel worse? For example — activity, eating, cold weather, stress?',
  relievingQ: 'What makes it better?',
  relievingAudio: 'What makes you feel better? For example — rest, warm water, medicines, lying down?',
  severityQ: 'On a scale from 1 to 10, how bad is it right now?',
  severityAudio: 'Please tap a number from 1 to 10. 1 means very mild. 10 means the worst pain you can imagine.',

  pastMedicalQ: 'Do you have any known medical conditions?',
  pastSurgicalQ: 'Have you had any operations or surgeries before?',
  drugAllergyQ: 'Are you allergic to any medicines or foods?',
  familyHistoryQ: 'Does anyone in your family have serious health conditions?',
  personalHistoryQ: 'Tell us about your daily habits — smoking, alcohol, diet preferences.',
  rosQ: 'Do you have any problems with the following body systems?',

  ayushModeTitle: 'AYUSH Health Assessment',
  prakritiQ: 'Which body type feels most like you?',
  vikritiQ: 'How are you feeling compared to your usual self lately?',
  saraQ: 'What is the quality of your skin, hair, and nails?',
  samhananaQ: 'How would you describe your body build?',
  pramanaQ: 'What is your height and weight?',
  satmyaQ: 'What foods or habits have you been used to since childhood?',
  satvaQ: 'How do you usually handle stress and difficult situations?',
  aharaShaktiQ: 'How is your appetite?',
  vyayamaShaktiQ: 'How much physical activity can you do comfortably?',
  vayaQ: 'What is your age?',
  aharaPatternQ: 'Describe your typical daily meals and eating pattern.',
  viharaRoutineQ: 'Describe your daily routine — sleep, wake time, exercise.',

  scanTitle: 'Scan Your Medical Documents',
  scanInstruction: 'If you have old prescriptions, lab reports, or hospital papers, please upload or take a photo of them now. You can skip this step if you do not have any.',
  scanAudioGuide: 'If you have old medical papers with you, please place one in front of the camera and tap the camera button. I will read the information for you.',
  scanDetected: 'Document detected. Please hold steady.',
  scanHoldSteady: 'Hold the document steady — almost there.',
  scanCaptured: 'Captured! I am reading the document now.',
  skipScan: 'Skip — I have no documents',
  abnormalAlert: 'Warning: this test result is outside the normal range.',
  drugInteractionAlert: 'Alert: possible interaction between medicines. Your doctor will review this.',

  summaryTitle: 'Summary of What We Recorded',
  summaryAudioConfirm: 'Here is a summary of everything you told us today. Please listen and let us know if anything needs to be changed.',
  pushToHisBtn: 'Send to Hospital System',
  pushSuccess: 'Your information has been sent to the hospital. Your doctor will see it when you are called.',
  fhirViewBtn: 'View Health Record (FHIR)',

  tokenTitle: 'You Are Registered!',
  tokenAudio: 'Registration complete. You are number {token} in the queue. Please sit and wait. You will be called when it is your turn.',
  waitMessage: 'Please wait in the seating area. We will call your name.',
  returnToDashboard: 'Return to Home',

  audioOn: 'Audio Guidance: ON',
  audioOff: 'Audio Guidance: OFF',
  highContrastOn: 'High Contrast: ON',
  highContrastOff: 'High Contrast: OFF',
  fontSizeLabel: 'Text Size',
  callStaff: 'Call for Help',
  callStaffMessage: 'A staff member has been alerted. Please wait — someone will come to assist you shortly.',

  next: 'Next',
  back: 'Go Back',
  repeat: 'Repeat',
  submit: 'Submit',
  yes: 'Yes',
  no: 'No',
  skip: 'Skip',
  cancel: 'Cancel',
  confirm: 'Confirm',
  done: 'Done',

  errorGeneral: 'Something went wrong. Please try again.',
  errorNoMic: 'Microphone not available. Please type your answer or tap an option.',
  processingLabel: 'Processing…',
  listeningLabel: 'Listening… Speak now',

  redFlagTitle: '🚨 Emergency Alert',
  redFlagBody: 'Your symptoms may need urgent attention. Please do not wait in the normal queue.',
  redFlagAction: 'Alert Triage Staff Now',

  selectAyushSystem: 'Which type of AYUSH treatment are you here for?',
  ayushSystems: {
    Ayurveda: 'Ayurveda',
    'Yoga & Naturopathy': 'Yoga & Naturopathy',
    Unani: 'Unani',
    Siddha: 'Siddha',
    Homoeopathy: 'Homoeopathy',
  },

  genderLabel: 'Gender',
  genderMale: 'Male',
  genderFemale: 'Female',
  genderOther: 'Other',

  doctorSummaryTitle: 'AI-Generated Clinical Summary',
  aiPopulatedNote: 'This field was auto-populated by the patient kiosk. Please review and confirm before saving.',
  confirmAndSave: 'Confirm & Save',
};

const hi: LangStrings = {
  appName: 'MediKiosk AI',
  tagline: 'AYUSH स्मार्ट प्री-कंसल्टेशन सिस्टम',

  langSelectPrompt: 'कृपया अपनी भाषा चुनें',
  langSelectAudio: 'MediKiosk में आपका स्वागत है। आगे बढ़ने के लिए अपनी पसंदीदा भाषा पर टैप करें।',

  authTitle: 'स्वागत है',
  authSubtitle: 'आप कैसे पहचान करना चाहेंगे?',
  abhaLogin: 'ABHA ID से लॉगिन करें',
  aadhaarLogin: 'आधार से लॉगिन करें',
  registerNew: 'नए रोगी के रूप में पंजीकरण करें',
  abhaPlaceholder: 'उदाहरण: 91-4829-1029-4821 या name@abdm',
  aadhaarPlaceholder: '12 अंकों का आधार नंबर दर्ज करें',
  loginBtn: 'सत्यापित करें और जारी रखें',
  orLabel: 'या',
  abhaHint: 'आपकी ABHA Health ID आपके मेडिकल रिकॉर्ड को जोड़ती है',

  consentTitle: 'आपकी गोपनीयता और सहमति',
  consentAudioIntro: 'शुरू करने से पहले, हमें आपकी स्वास्थ्य जानकारी एकत्र करने की अनुमति चाहिए। कृपया ध्यान से सुनें।',
  consentBody: 'MediKiosk AI आपकी स्वास्थ्य जानकारी — लक्षण, चिकित्सा दस्तावेज और व्यक्तिगत विवरण — एकत्र करेगा। आपका डेटा डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 के तहत सुरक्षित है। आप किसी भी समय सहमति वापस ले सकते हैं।',
  consentAgree: 'मैं सहमत हूं — हां',
  consentDisagree: 'मैं सहमत नहीं हूं',
  consentVerbalPrompt: '"हां" कहें या हरे बटन पर टैप करें',

  stepIdentify: 'पहचान',
  stepConverse: 'अपनी समस्या बताएं',
  stepScan: 'आपके दस्तावेज',
  stepSummarize: 'समीक्षा और सबमिट',
  stepDone: 'हो गया',

  chiefComplaintQ: 'आज आपकी मुख्य स्वास्थ्य समस्या क्या है?',
  chiefComplaintAudio: 'आज आप किस मुख्य स्वास्थ्य समस्या के लिए यहां आए हैं? बोलें या विकल्प टैप करें।',
  durationQ: 'यह समस्या कब से है?',
  siteQ: 'शरीर में कहां समस्या है?',
  siteAudio: 'बताएं या टैप करें — शरीर में कहां तकलीफ है।',
  onsetQ: 'यह कैसे शुरू हुआ?',
  onsetAudio: 'क्या समस्या अचानक आई, या धीरे-धीरे बढ़ी?',
  characterQ: 'कैसा महसूस होता है?',
  characterAudio: 'दर्द या तकलीफ कैसी है — जलन, दुखन, तेज दर्द या भारीपन?',
  radiationQ: 'क्या यह कहीं और फैलता है?',
  radiationAudio: 'क्या दर्द एक ही जगह रहता है या शरीर के दूसरे हिस्से में भी जाता है?',
  associatedQ: 'इसके साथ कोई और लक्षण हैं?',
  associatedAudio: 'क्या इसके साथ कोई और तकलीफ है? जो लागू हो उसे टैप करें।',
  timingQ: 'क्या यह हमेशा रहता है या आता-जाता है?',
  timingAudio: 'क्या समस्या हमेशा रहती है, या दौरे में आती है?',
  exacerbatingQ: 'क्या करने से यह बढ़ता है?',
  exacerbatingAudio: 'कौन सी चीज से तकलीफ बढ़ती है?',
  relievingQ: 'क्या करने से आराम मिलता है?',
  relievingAudio: 'किससे आराम मिलता है?',
  severityQ: '1 से 10 के पैमाने पर अभी कितना कष्ट है?',
  severityAudio: '1 से 10 तक कोई संख्या टैप करें। 1 मतलब बहुत कम, 10 मतलब सबसे ज्यादा।',

  pastMedicalQ: 'क्या आपको कोई पुरानी बीमारी है?',
  pastSurgicalQ: 'क्या पहले कभी ऑपरेशन हुआ है?',
  drugAllergyQ: 'क्या आपको किसी दवा या खाने से एलर्जी है?',
  familyHistoryQ: 'परिवार में किसी को कोई गंभीर बीमारी है?',
  personalHistoryQ: 'अपनी दिनचर्या के बारे में बताएं — धूम्रपान, शराब, खान-पान।',
  rosQ: 'क्या इन अंगों में कोई तकलीफ है?',

  ayushModeTitle: 'AYUSH स्वास्थ्य मूल्यांकन',
  prakritiQ: 'आपकी प्रकृति कैसी लगती है?',
  vikritiQ: 'हाल ही में अपने सामान्य स्वास्थ्य की तुलना में आप कैसा महसूस कर रहे हैं?',
  saraQ: 'आपकी त्वचा, बाल और नाखून की गुणवत्ता कैसी है?',
  samhananaQ: 'आपका शरीर कैसा है?',
  pramanaQ: 'आपकी ऊंचाई और वजन क्या है?',
  satmyaQ: 'बचपन से आप किन खाद्य पदार्थों के अभ्यस्त हैं?',
  satvaQ: 'आप तनाव को कैसे संभालते हैं?',
  aharaShaktiQ: 'आपकी भूख कैसी है?',
  vyayamaShaktiQ: 'आप कितना शारीरिक परिश्रम कर सकते हैं?',
  vayaQ: 'आपकी उम्र क्या है?',
  aharaPatternQ: 'अपने दैनिक भोजन का विवरण दें।',
  viharaRoutineQ: 'अपनी दिनचर्या बताएं — नींद, उठने का समय, व्यायाम।',

  scanTitle: 'अपने चिकित्सा दस्तावेज स्कैन करें',
  scanInstruction: 'यदि आपके पास पुराने नुस्खे, लैब रिपोर्ट या अस्पताल के कागज हैं, तो उन्हें अभी अपलोड करें या फोटो लें।',
  scanAudioGuide: 'यदि आपके पास पुराने कागज हैं, तो उन्हें कैमरे के सामने रखें और कैमरा बटन दबाएं।',
  scanDetected: 'दस्तावेज मिल गया। कृपया स्थिर रखें।',
  scanHoldSteady: 'दस्तावेज को स्थिर रखें — लगभग हो गया।',
  scanCaptured: 'हो गया! मैं अभी दस्तावेज पढ़ रहा हूं।',
  skipScan: 'छोड़ें — मेरे पास दस्तावेज नहीं हैं',
  abnormalAlert: 'चेतावनी: यह परीक्षण परिणाम सामान्य सीमा से बाहर है।',
  drugInteractionAlert: 'सतर्क: दवाओं के बीच संभावित इंटरैक्शन। आपका डॉक्टर इसकी समीक्षा करेंगे।',

  summaryTitle: 'हमने जो दर्ज किया उसका सारांश',
  summaryAudioConfirm: 'यहां आज आपने जो बताया उसका सारांश है। कृपया सुनें और बताएं कि कुछ बदलना है।',
  pushToHisBtn: 'अस्पताल प्रणाली को भेजें',
  pushSuccess: 'आपकी जानकारी अस्पताल को भेज दी गई है। आपके बुलाए जाने पर डॉक्टर इसे देखेंगे।',
  fhirViewBtn: 'स्वास्थ्य रिकॉर्ड देखें (FHIR)',

  tokenTitle: 'आपका पंजीकरण हो गया!',
  tokenAudio: 'पंजीकरण पूरा। आप पंक्ति में नंबर {token} पर हैं। कृपया बैठकर प्रतीक्षा करें।',
  waitMessage: 'कृपया बैठने के क्षेत्र में प्रतीक्षा करें। हम आपका नाम पुकारेंगे।',
  returnToDashboard: 'होम पर वापस जाएं',

  audioOn: 'ऑडियो मार्गदर्शन: चालू',
  audioOff: 'ऑडियो मार्गदर्शन: बंद',
  highContrastOn: 'उच्च कंट्रास्ट: चालू',
  highContrastOff: 'उच्च कंट्रास्ट: बंद',
  fontSizeLabel: 'अक्षर आकार',
  callStaff: 'मदद के लिए बुलाएं',
  callStaffMessage: 'एक कर्मचारी को सूचित कर दिया गया है। कृपया रुकें — कोई शीघ्र आएगा।',

  next: 'आगे',
  back: 'वापस',
  repeat: 'दोबारा सुनें',
  submit: 'जमा करें',
  yes: 'हां',
  no: 'नहीं',
  skip: 'छोड़ें',
  cancel: 'रद्द करें',
  confirm: 'पुष्टि करें',
  done: 'हो गया',

  errorGeneral: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
  errorNoMic: 'माइक्रोफोन उपलब्ध नहीं है। कृपया विकल्प टैप करें।',
  processingLabel: 'प्रसंस्करण…',
  listeningLabel: 'सुन रहे हैं… अभी बोलें',

  redFlagTitle: '🚨 आपातकालीन सूचना',
  redFlagBody: 'आपके लक्षणों को तत्काल ध्यान की जरूरत हो सकती है। कृपया सामान्य पंक्ति में प्रतीक्षा न करें।',
  redFlagAction: 'अभी ट्रायाज स्टाफ को सूचित करें',

  selectAyushSystem: 'आप किस AYUSH उपचार के लिए आए हैं?',
  ayushSystems: {
    Ayurveda: 'आयुर्वेद',
    'Yoga & Naturopathy': 'योग एवं प्राकृतिक चिकित्सा',
    Unani: 'यूनानी',
    Siddha: 'सिद्ध',
    Homoeopathy: 'होमियोपैथी',
  },

  genderLabel: 'लिंग',
  genderMale: 'पुरुष',
  genderFemale: 'महिला',
  genderOther: 'अन्य',

  doctorSummaryTitle: 'AI-निर्मित नैदानिक सारांश',
  aiPopulatedNote: 'यह क्षेत्र रोगी कियोस्क द्वारा स्वतः भरा गया है। सहेजने से पहले समीक्षा करें।',
  confirmAndSave: 'पुष्टि करें और सहेजें',
};

const ta: LangStrings = {
  appName: 'MediKiosk AI',
  tagline: 'AYUSH ஸ்மார்ட் ப்ரீ-கன்சல்டேஷன் சிஸ்டம்',

  langSelectPrompt: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
  langSelectAudio: 'MediKioskக்கு வரவேற்கிறோம். தொடர உங்கள் விருப்பமான மொழியைத் தட்டவும்.',

  authTitle: 'வரவேற்கிறோம்',
  authSubtitle: 'நீங்கள் எவ்வாறு அடையாளம் காட்ட விரும்புகிறீர்கள்?',
  abhaLogin: 'ABHA ID மூலம் உள்நுழையவும்',
  aadhaarLogin: 'ஆதார் மூலம் உள்நுழையவும்',
  registerNew: 'புதிய நோயாளியாக பதிவு செய்யவும்',
  abhaPlaceholder: 'எ.கா. 91-4829-1029-4821 அல்லது name@abdm',
  aadhaarPlaceholder: '12 இலக்க ஆதார் எண்ணை உள்ளிடவும்',
  loginBtn: 'சரிபார்த்து தொடரவும்',
  orLabel: 'அல்லது',
  abhaHint: 'உங்கள் ABHA ஆரோக்கிய ID உங்கள் மருத்துவ பதிவுகளை இணைக்கிறது',

  consentTitle: 'உங்கள் தனியுரிமை மற்றும் ஒப்புதல்',
  consentAudioIntro: 'தொடங்குவதற்கு முன், உங்கள் சுகாதார தகவலை சேகரிக்க உங்கள் அனுமதி தேவை. கவனமாகக் கேளுங்கள்.',
  consentBody: 'MediKiosk AI உங்கள் அறிகுறிகள், மருத்துவ ஆவணங்கள் மற்றும் தனிப்பட்ட விவரங்களை சேகரிக்கும். உங்கள் தரவு DPDP சட்டம் 2023 இன் கீழ் பாதுகாக்கப்படுகிறது.',
  consentAgree: 'நான் ஒப்புக்கொள்கிறேன் — ஆம்',
  consentDisagree: 'நான் ஒப்புக்கொள்ளவில்லை',
  consentVerbalPrompt: '"ஆம்" என்று சொல்லுங்கள் அல்லது பச்சை பொத்தானை தட்டவும்',

  stepIdentify: 'அடையாளம்',
  stepConverse: 'உங்கள் பிரச்னை சொல்லுங்கள்',
  stepScan: 'உங்கள் ஆவணங்கள்',
  stepSummarize: 'மதிப்பாய்வு மற்றும் சமர்ப்பிக்கவும்',
  stepDone: 'முடிந்தது',

  chiefComplaintQ: 'இன்று உங்கள் முக்கிய உடல்நலப் பிரச்னை என்ன?',
  chiefComplaintAudio: 'இன்று நீங்கள் எந்த உடல்நலப் பிரச்னைக்காக வந்துள்ளீர்கள்?',
  durationQ: 'இந்தப் பிரச்னை எவ்வளவு நாட்களாக உள்ளது?',
  siteQ: 'உடலில் எங்கு பிரச்னை உள்ளது?',
  siteAudio: 'உடலில் எந்த இடத்தில் தொந்தரவு உள்ளது என்று தட்டவும் அல்லது சொல்லுங்கள்.',
  onsetQ: 'இது எப்படி தொடங்கியது?',
  onsetAudio: 'பிரச்னை திடீரென்று வந்ததா, அல்லது மெதுவாக வளர்ந்ததா?',
  characterQ: 'இது எப்படி தோன்றுகிறது?',
  characterAudio: 'வலி அல்லது தொந்தரவை எவ்வாறு விவரிப்பீர்கள்?',
  radiationQ: 'இது வேறு இடத்திற்கு பரவுகிறதா?',
  radiationAudio: 'வலி ஒரே இடத்தில் இருக்கிறதா அல்லது வேறு இடங்களுக்கும் பரவுகிறதா?',
  associatedQ: 'இதனுடன் வேறு ஏதாவது அறிகுறிகள் உள்ளனவா?',
  associatedAudio: 'அதே நேரத்தில் வேறு ஏதாவது பிரச்னைகள் உள்ளனவா?',
  timingQ: 'இது எப்போதும் இருக்கிறதா அல்லது வந்து போகிறதா?',
  timingAudio: 'பிரச்னை தொடர்ந்து இருக்கிறதா, அல்லது இடைவிடாமல் வருகிறதா?',
  exacerbatingQ: 'எது மோசமாக்குகிறது?',
  exacerbatingAudio: 'என்ன செய்தால் தொந்தரவு அதிகமாகிறது?',
  relievingQ: 'எதனால் நலமடைகிறீர்கள்?',
  relievingAudio: 'என்ன செய்தால் நிவாரணம் கிடைக்கிறது?',
  severityQ: '1 முதல் 10 வரையில் இப்போது எவ்வளவு வலி உள்ளது?',
  severityAudio: '1 முதல் 10 வரை ஒரு எண்ணை தட்டவும். 1 என்பது மிகவும் இலகுவானது, 10 என்பது மிகவும் கடுமையானது.',

  pastMedicalQ: 'உங்களுக்கு ஏதாவது நாட்பட்ட நோய்கள் உள்ளனவா?',
  pastSurgicalQ: 'முன்பு ஏதாவது அறுவை சிகிச்சை நடந்துள்ளதா?',
  drugAllergyQ: 'ஏதாவது மருந்து அல்லது உணவால் ஒவ்வாமை உள்ளதா?',
  familyHistoryQ: 'குடும்பத்தில் யாரேனும் தீவிர நோய்களால் பாதிக்கப்பட்டுள்ளனரா?',
  personalHistoryQ: 'உங்கள் அன்றாட பழக்கங்களைப் பற்றி சொல்லுங்கள்.',
  rosQ: 'இந்த உடல் அமைப்புகளில் ஏதாவது பிரச்னைகள் உள்ளனவா?',

  ayushModeTitle: 'AYUSH சுகாதார மதிப்பீடு',
  prakritiQ: 'உங்கள் உடல் வகை எது போல் உணர்கிறீர்கள்?',
  vikritiQ: 'சமீபத்தில் உங்கள் வழக்கமான நிலையுடன் ஒப்பிடும்போது எப்படி உணர்கிறீர்கள்?',
  saraQ: 'உங்கள் தோல், முடி மற்றும் நகங்களின் தரம் என்ன?',
  samhananaQ: 'உங்கள் உடல் அமைப்பை எவ்வாறு விவரிப்பீர்கள்?',
  pramanaQ: 'உங்கள் உயரம் மற்றும் எடை என்ன?',
  satmyaQ: 'சிறு வயதிலிருந்தே நீங்கள் எந்த உணவுகளுக்கு பழகியுள்ளீர்கள்?',
  satvaQ: 'மன அழுத்தத்தை நீங்கள் எவ்வாறு கையாள்கிறீர்கள்?',
  aharaShaktiQ: 'உங்கள் பசியின்மை எப்படி இருக்கிறது?',
  vyayamaShaktiQ: 'நீங்கள் எவ்வளவு உடல் உழைப்பு செய்ய முடிகிறது?',
  vayaQ: 'உங்கள் வயது என்ன?',
  aharaPatternQ: 'உங்கள் அன்றாட உணவு வழக்கத்தை விவரிக்கவும்.',
  viharaRoutineQ: 'உங்கள் தினசரி வழக்கத்தை விவரிக்கவும் — தூக்கம், எழும் நேரம், உடற்பயிற்சி.',

  scanTitle: 'உங்கள் மருத்துவ ஆவணங்களை ஸ்கேன் செய்யவும்',
  scanInstruction: 'பழைய மருத்துவக் குறிப்புகள், ஆய்வக அறிக்கைகள் அல்லது மருத்துவமனை ஆவணங்கள் இருந்தால் அவற்றை இப்போது பதிவேற்றவும்.',
  scanAudioGuide: 'பழைய மருத்துவ ஆவணங்கள் இருந்தால், கேமரா முன்பு வையுங்கள் மற்றும் கேமரா பொத்தானை தட்டவும்.',
  scanDetected: 'ஆவணம் கண்டறியப்பட்டது. நிலையாக வைக்கவும்.',
  scanHoldSteady: 'ஆவணத்தை நிலையாக வைக்கவும் — கிட்டத்தட்ட முடிந்தது.',
  scanCaptured: 'படமெடுக்கப்பட்டது! இப்போது ஆவணத்தை படிக்கிறேன்.',
  skipScan: 'தவிர்க்கவும் — என்னிடம் ஆவணங்கள் இல்லை',
  abnormalAlert: 'எச்சரிக்கை: இந்த சோதனை முடிவு இயல்பான வரம்பிற்கு வெளியே உள்ளது.',
  drugInteractionAlert: 'எச்சரிக்கை: மருந்துகளிடையே சாத்தியமான தொடர்பு. உங்கள் மருத்துவர் இதை மதிப்பாய்வு செய்வார்.',

  summaryTitle: 'நாங்கள் பதிவு செய்தவற்றின் சுருக்கம்',
  summaryAudioConfirm: 'இன்று நீங்கள் சொன்னதன் சுருக்கம் இதோ. கேளுங்கள் மற்றும் ஏதாவது மாற்றல் தேவையா என்று தெரியப்படுத்துங்கள்.',
  pushToHisBtn: 'மருத்துவமனை அமைப்புக்கு அனுப்பவும்',
  pushSuccess: 'உங்கள் தகவல் மருத்துவமனைக்கு அனுப்பப்பட்டது.',
  fhirViewBtn: 'சுகாதார பதிவை பார்க்கவும் (FHIR)',

  tokenTitle: 'நீங்கள் பதிவு செய்யப்பட்டீர்கள்!',
  tokenAudio: 'பதிவு முடிந்தது. நீங்கள் வரிசையில் {token} வது இடத்தில் உள்ளீர்கள். தயவுசெய்து காத்திருக்கவும்.',
  waitMessage: 'தயவுசெய்து அமரும் பகுதியில் காத்திருக்கவும். உங்கள் பெயரை அழைப்போம்.',
  returnToDashboard: 'முகப்புக்கு திரும்பவும்',

  audioOn: 'ஆடியோ வழிகாட்டுதல்: இயக்கத்தில்',
  audioOff: 'ஆடியோ வழிகாட்டுதல்: அணைக்கப்பட்டது',
  highContrastOn: 'அதிக கான்ட்ராஸ்ட்: இயக்கத்தில்',
  highContrastOff: 'அதிக கான்ட்ராஸ்ட்: அணைக்கப்பட்டது',
  fontSizeLabel: 'உரை அளவு',
  callStaff: 'உதவிக்கு அழைக்கவும்',
  callStaffMessage: 'ஒரு ஊழியர் அறிவிக்கப்பட்டுள்ளார். காத்திருக்கவும்.',

  next: 'அடுத்து',
  back: 'திரும்பு',
  repeat: 'மீண்டும் கேட்கவும்',
  submit: 'சமர்ப்பிக்கவும்',
  yes: 'ஆம்',
  no: 'இல்லை',
  skip: 'தவிர்க்கவும்',
  cancel: 'ரத்துசெய்',
  confirm: 'உறுதிப்படுத்தவும்',
  done: 'முடிந்தது',

  errorGeneral: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
  errorNoMic: 'மைக்ரோஃபோன் கிடைக்கவில்லை. ஒரு விருப்பத்தை தட்டவும்.',
  processingLabel: 'செயலாக்கப்படுகிறது…',
  listeningLabel: 'கேட்கிறேன்… இப்போது பேசவும்',

  redFlagTitle: '🚨 அவசரகால எச்சரிக்கை',
  redFlagBody: 'உங்கள் அறிகுறிகளுக்கு அவசர கவனிப்பு தேவைப்படலாம்.',
  redFlagAction: 'இப்போது ட்ரியாஜ் ஊழியரை எச்சரிக்கவும்',

  selectAyushSystem: 'நீங்கள் எந்த AYUSH சிகிச்சைக்காக வந்துள்ளீர்கள்?',
  ayushSystems: {
    Ayurveda: 'ஆயுர்வேதம்',
    'Yoga & Naturopathy': 'யோகா மற்றும் இயற்கை சிகிச்சை',
    Unani: 'யூனானி',
    Siddha: 'சித்த',
    Homoeopathy: 'ஹோமியோபதி',
  },

  genderLabel: 'பாலினம்',
  genderMale: 'ஆண்',
  genderFemale: 'பெண்',
  genderOther: 'மற்றவை',

  doctorSummaryTitle: 'AI-உருவாக்கிய மருத்துவ சுருக்கம்',
  aiPopulatedNote: 'இந்த புலம் நோயாளி கியோஸ்க் மூலம் தானாக நிரப்பப்பட்டது. சேமிப்பதற்கு முன் மதிப்பாய்வு செய்யவும்.',
  confirmAndSave: 'உறுதிப்படுத்தி சேமிக்கவும்',
};

const bn: LangStrings = {
  appName: 'MediKiosk AI',
  tagline: 'AYUSH স্মার্ট প্রি-কনসালটেশন সিস্টেম',

  langSelectPrompt: 'অনুগ্রহ করে আপনার ভাষা বেছে নিন',
  langSelectAudio: 'MediKiosk-এ আপনাকে স্বাগতম। এগিয়ে যেতে আপনার পছন্দের ভাষায় ট্যাপ করুন।',

  authTitle: 'স্বাগতম',
  authSubtitle: 'আপনি কীভাবে নিজেকে পরিচয় দিতে চান?',
  abhaLogin: 'ABHA ID দিয়ে লগইন করুন',
  aadhaarLogin: 'আধার দিয়ে লগইন করুন',
  registerNew: 'নতুন রোগী হিসেবে নিবন্ধন করুন',
  abhaPlaceholder: 'যেমন: 91-4829-1029-4821 বা name@abdm',
  aadhaarPlaceholder: '১২ সংখ্যার আধার নম্বর লিখুন',
  loginBtn: 'যাচাই করুন এবং এগিয়ে যান',
  orLabel: 'অথবা',
  abhaHint: 'আপনার ABHA স্বাস্থ্য ID আপনার মেডিকেল রেকর্ড সংযুক্ত করে',

  consentTitle: 'আপনার গোপনীয়তা এবং সম্মতি',
  consentAudioIntro: 'শুরু করার আগে, আমাদের আপনার স্বাস্থ্য তথ্য সংগ্রহ করার অনুমতি দরকার। অনুগ্রহ করে মনোযোগ দিয়ে শুনুন।',
  consentBody: 'MediKiosk AI আপনার উপসর্গ, চিকিৎসা নথি এবং ব্যক্তিগত বিবরণ সংগ্রহ করবে। আপনার ডেটা DPDP আইন ২০২৩-এর অধীনে সুরক্ষিত।',
  consentAgree: 'আমি সম্মত — হ্যাঁ',
  consentDisagree: 'আমি সম্মত নই',
  consentVerbalPrompt: '"হ্যাঁ" বলুন বা সবুজ বোতামে ট্যাপ করুন',

  stepIdentify: 'পরিচয়',
  stepConverse: 'আপনার সমস্যা বলুন',
  stepScan: 'আপনার নথি',
  stepSummarize: 'পর্যালোচনা ও জমা দিন',
  stepDone: 'সম্পন্ন',

  chiefComplaintQ: 'আজ আপনার প্রধান স্বাস্থ্য সমস্যা কী?',
  chiefComplaintAudio: 'আজ আপনি কোন প্রধান স্বাস্থ্য সমস্যার জন্য এসেছেন? বলুন বা একটি বিকল্পে ট্যাপ করুন।',
  durationQ: 'এই সমস্যা কতদিন ধরে আছে?',
  siteQ: 'শরীরের কোথায় সমস্যা?',
  siteAudio: 'শরীরের কোথায় সমস্যা হচ্ছে তা ট্যাপ করুন বা বলুন।',
  onsetQ: 'এটি কীভাবে শুরু হয়েছিল?',
  onsetAudio: 'সমস্যাটি কি হঠাৎ এসেছে, নাকি ধীরে ধীরে বেড়েছে?',
  characterQ: 'এটি কেমন লাগছে?',
  characterAudio: 'ব্যথা বা অস্বস্তি কীভাবে বর্ণনা করবেন?',
  radiationQ: 'এটি কি অন্য কোথাও ছড়িয়ে পড়ে?',
  radiationAudio: 'ব্যথা কি এক জায়গায় থাকে, নাকি অন্য জায়গায় ছড়িয়ে পড়ে?',
  associatedQ: 'এর সাথে অন্য কোনো উপসর্গ আছে কি?',
  associatedAudio: 'একই সময়ে অন্য কোনো সমস্যা হচ্ছে? প্রযোজ্য সবগুলোতে ট্যাপ করুন।',
  timingQ: 'এটি কি সবসময় থাকে নাকি আসে-যায়?',
  timingAudio: 'সমস্যাটি কি ক্রমাগত থাকে, নাকি মাঝে মাঝে আসে?',
  exacerbatingQ: 'কীসে এটি আরও খারাপ হয়?',
  exacerbatingAudio: 'কী করলে সমস্যা বাড়ে?',
  relievingQ: 'কীসে ভালো লাগে?',
  relievingAudio: 'কীসে স্বস্তি পান?',
  severityQ: '১ থেকে ১০ এ এখন কতটা তীব্র?',
  severityAudio: '১ থেকে ১০ পর্যন্ত একটি সংখ্যায় ট্যাপ করুন। ১ মানে খুব হালকা, ১০ মানে সবচেয়ে তীব্র।',

  pastMedicalQ: 'আপনার কোনো দীর্ঘস্থায়ী রোগ আছে কি?',
  pastSurgicalQ: 'আগে কোনো অপারেশন হয়েছে কি?',
  drugAllergyQ: 'কোনো ওষুধ বা খাবারে অ্যালার্জি আছে কি?',
  familyHistoryQ: 'পরিবারে কেউ গুরুতর রোগে আক্রান্ত আছেন কি?',
  personalHistoryQ: 'আপনার দৈনন্দিন অভ্যাস সম্পর্কে বলুন।',
  rosQ: 'এই শরীরের অংশগুলোতে কোনো সমস্যা আছে কি?',

  ayushModeTitle: 'AYUSH স্বাস্থ্য মূল্যায়ন',
  prakritiQ: 'আপনার শরীরের ধরন কোনটির মতো মনে হয়?',
  vikritiQ: 'সম্প্রতি আপনার স্বাভাবিক অবস্থার তুলনায় কেমন অনুভব করছেন?',
  saraQ: 'আপনার ত্বক, চুল এবং নখের মান কেমন?',
  samhananaQ: 'আপনার শারীরিক গঠন কেমন?',
  pramanaQ: 'আপনার উচ্চতা ও ওজন কত?',
  satmyaQ: 'ছোটবেলা থেকে কোন খাবারে অভ্যস্ত?',
  satvaQ: 'আপনি মানসিক চাপ কীভাবে সামলান?',
  aharaShaktiQ: 'আপনার ক্ষুধা কেমন?',
  vyayamaShaktiQ: 'আপনি কতটা শারীরিক পরিশ্রম করতে পারেন?',
  vayaQ: 'আপনার বয়স কত?',
  aharaPatternQ: 'আপনার প্রতিদিনের খাদ্যাভ্যাস বর্ণনা করুন।',
  viharaRoutineQ: 'আপনার দৈনন্দিন রুটিন বর্ণনা করুন — ঘুম, ওঠার সময়, ব্যায়াম।',

  scanTitle: 'আপনার চিকিৎসা নথি স্ক্যান করুন',
  scanInstruction: 'পুরানো প্রেসক্রিপশন, ল্যাব রিপোর্ট বা হাসপাতালের কাগজ থাকলে এখন আপলোড করুন বা ছবি তুলুন।',
  scanAudioGuide: 'পুরানো চিকিৎসা কাগজ থাকলে ক্যামেরার সামনে রাখুন এবং ক্যামেরা বোতামে ট্যাপ করুন।',
  scanDetected: 'নথি সনাক্ত হয়েছে। স্থির রাখুন।',
  scanHoldSteady: 'নথি স্থির রাখুন — প্রায় হয়ে গেছে।',
  scanCaptured: 'ধারণ করা হয়েছে! এখন নথি পড়ছি।',
  skipScan: 'এড়িয়ে যান — আমার কাছে নথি নেই',
  abnormalAlert: 'সতর্কতা: এই পরীক্ষার ফলাফল স্বাভাবিক সীমার বাইরে।',
  drugInteractionAlert: 'সতর্কতা: ওষুধের মধ্যে সম্ভাব্য মিথস্ক্রিয়া। আপনার ডাক্তার এটি পর্যালোচনা করবেন।',

  summaryTitle: 'আমরা যা রেকর্ড করেছি তার সারসংক্ষেপ',
  summaryAudioConfirm: 'আজ আপনি যা বলেছেন তার সারসংক্ষেপ এখানে। শুনুন এবং কিছু পরিবর্তন করতে হবে কিনা জানান।',
  pushToHisBtn: 'হাসপাতাল সিস্টেমে পাঠান',
  pushSuccess: 'আপনার তথ্য হাসপাতালে পাঠানো হয়েছে।',
  fhirViewBtn: 'স্বাস্থ্য রেকর্ড দেখুন (FHIR)',

  tokenTitle: 'আপনি নিবন্ধিত হয়েছেন!',
  tokenAudio: 'নিবন্ধন সম্পন্ন। আপনি সারিতে {token} নম্বরে আছেন। অনুগ্রহ করে অপেক্ষা করুন।',
  waitMessage: 'বসার এলাকায় অপেক্ষা করুন। আমরা আপনার নাম ডাকব।',
  returnToDashboard: 'হোমে ফিরে যান',

  audioOn: 'অডিও গাইডেন্স: চালু',
  audioOff: 'অডিও গাইডেন্স: বন্ধ',
  highContrastOn: 'উচ্চ কন্ট্রাস্ট: চালু',
  highContrastOff: 'উচ্চ কন্ট্রাস্ট: বন্ধ',
  fontSizeLabel: 'টেক্সট আকার',
  callStaff: 'সাহায্যের জন্য ডাকুন',
  callStaffMessage: 'একজন কর্মীকে সতর্ক করা হয়েছে। অপেক্ষা করুন।',

  next: 'পরবর্তী',
  back: 'ফিরে যান',
  repeat: 'আবার শুনুন',
  submit: 'জমা দিন',
  yes: 'হ্যাঁ',
  no: 'না',
  skip: 'এড়িয়ে যান',
  cancel: 'বাতিল',
  confirm: 'নিশ্চিত করুন',
  done: 'সম্পন্ন',

  errorGeneral: 'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।',
  errorNoMic: 'মাইক্রোফোন পাওয়া যাচ্ছে না। একটি বিকল্পে ট্যাপ করুন।',
  processingLabel: 'প্রসেস হচ্ছে…',
  listeningLabel: 'শুনছি… এখন বলুন',

  redFlagTitle: '🚨 জরুরি সতর্কতা',
  redFlagBody: 'আপনার উপসর্গগুলোর জরুরি মনোযোগ প্রয়োজন হতে পারে।',
  redFlagAction: 'এখনই ট্রায়াজ কর্মীকে সতর্ক করুন',

  selectAyushSystem: 'আপনি কোন AYUSH চিকিৎসার জন্য এসেছেন?',
  ayushSystems: {
    Ayurveda: 'আয়ুর্বেদ',
    'Yoga & Naturopathy': 'যোগ ও প্রকৃতিচিকিৎসা',
    Unani: 'ইউনানী',
    Siddha: 'সিদ্ধ',
    Homoeopathy: 'হোমিওপ্যাথি',
  },

  genderLabel: 'লিঙ্গ',
  genderMale: 'পুরুষ',
  genderFemale: 'মহিলা',
  genderOther: 'অন্যান্য',

  doctorSummaryTitle: 'AI-নির্মিত ক্লিনিক্যাল সারসংক্ষেপ',
  aiPopulatedNote: 'এই ক্ষেত্রটি রোগী কিওস্ক দ্বারা স্বয়ংক্রিয়ভাবে পূর্ণ করা হয়েছে। সংরক্ষণের আগে পর্যালোচনা করুন।',
  confirmAndSave: 'নিশ্চিত করুন এবং সংরক্ষণ করুন',
};

export const STRINGS: Record<SupportedLang, LangStrings> = { en, hi, ta, bn };

export const LANG_META: Record<SupportedLang, { label: string; script: string; ttsLang: string; flag: string }> = {
  en: { label: 'English', script: 'English', ttsLang: 'en-IN', flag: '🇬🇧' },
  hi: { label: 'हिंदी', script: 'Hindi', ttsLang: 'hi-IN', flag: '🇮🇳' },
  ta: { label: 'தமிழ்', script: 'Tamil', ttsLang: 'ta-IN', flag: '🇮🇳' },
  bn: { label: 'বাংলা', script: 'Bengali', ttsLang: 'bn-IN', flag: '🇮🇳' },
};
