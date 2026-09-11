<div align="center">

# 🏥 MediKiosk AI
### *AYUSH Smart Pre-Consultation Platform*

**Smart India Hackathon 2026 · Problem Statement SIH-26047**

[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/shauryapratap969687-cmyk/New_SIH_26047?style=for-the-badge&logo=github)](https://github.com/shauryapratap969687-cmyk/New_SIH_26047/stargazers)

<br/>

> **"MediKiosk AI doesn't replace the AYUSH physician.**
> **It gives them a 10-minute head start — with a complete, structured, bilingual patient history — before the patient even walks through the door."**

<br/>

[🚀 Getting Started](#-getting-started) · [✨ Features](#-complete-feature-list) · [🏗️ Architecture](#️-architecture--4-modules) · [📋 Patient Journey](#-the-patient-journey-end-to-end) · [🤝 Contributing](#-contributing)

---

</div>

## 🎯 Problem Statement

**Imagine you are a patient in an AYUSH hospital OPD.**

You wait 45 minutes in a queue. When you finally meet the doctor, the next **15 minutes are spent answering basic questions** — name, age, where the pain is, how long, what medications you've taken.

> The doctor is doing data entry. That's not doctoring — that's clerical work.

This happens at **every AYUSH OPD in India**, every single day. The problem is worse for AYUSH than for allopathy — because AYUSH doctors need *more* information:

- **Prakriti** (body constitution — determines treatment personalisation)
- **Nadi** (pulse character — diagnostic tool)
- **Dashavidha Pariksha** (10-fold assessment unique to Ayurveda)
- **Ahara-Vihara** (diet & lifestyle — core to AYUSH treatment)

A **60-point assessment** that a 5-minute OPD slot simply cannot accommodate.

**SIH-26047 asks us to fix this. We did — completely.**

---

## 💡 Our Solution

**MediKiosk AI** is a voice-enabled, multilingual, fully-accessible AYUSH pre-consultation kiosk that patients use **in the waiting room, before they meet the doctor.** By the time the patient walks in, the doctor already has a complete, structured clinical history ready.

```
Patient arrives → Kiosk (Voice + Touch + Body Map) → OCR Documents → Summary → Doctor
     ↑                                                                             ↑
  (waiting room,                                                        (ready to treat,
   self-reports)                                                         no data entry)
```

---

## ✨ Complete Feature List

### 🗣️ Core — Conversation & Input
| Feature | Description |
|---|---|
| 🗣️ **Voice + Touch Dual Input** | Every question answerable by speaking OR tapping — patient is never forced into one mode |
| 🌐 **4-Language Support** | English · हिंदी · தமிழ் · বাংলা — audio auto-plays in chosen language |
| 🔊 **Audio-Guided by Default** | Every screen reads itself aloud — works for fully illiterate patients |
| 🧠 **Adaptive SOCRATES Engine** | 21 branching questions — later questions adapt based on earlier answers |
| 🌿 **Dashavidha Pariksha** | Full 10-fold Ayurvedic assessment in AYUSH mode |

### 🫀 NEW — Masterpiece Patient Features
| Feature | Description |
|---|---|
| 🫀 **Body Map** | Interactive SVG body diagram — tap the exact location of pain (front + back view). No reading required — a grandmother who can't read "epigastric" can tap her stomach |
| 😐 **FACES Pain Scale** | 6 illustrated faces (😊→😐→😣→😰→😭→😭) — globally validated Wong-Baker scale for low-literacy & paediatric patients, replaces the 1–10 slider |
| 🔢 **Live Queue Tracker** | Real-time simulated OPD queue — shows position, est. wait, speaks "almost your turn!" when 3 patients ahead. Per-AYUSH-system icons & thresholds |
| 📋 **Discharge Card** | Auto-generated post-visit card with AYUSH-system-specific diet, lifestyle & medicine timing (🌅morning/☀️afternoon/🌙night pictograms). WhatsApp-shareable + printable |
| 🤖 **Help Assistant Chatbot** | Always-available `🤖 Help` floating button (bottom-left). Answers: hospital navigation, medical term explanations, diet advice, emergency contacts. Context-aware — explains the exact kiosk question a patient is stuck on |

### 📄 Documents & Records
| Feature | Description |
|---|---|
| 📄 **Document AI / OCR** | Upload old prescriptions & lab reports — AI extracts diagnoses, medications, lab values (abnormals flagged in red) |
| 💊 **Drug Interaction Alerts** | Herbal-allopathic interaction detection (e.g., Yashtimadhu + Telmisartan) |
| 📅 **Chronological Timeline** | Documents sorted into medical history timeline |
| 🏥 **ABHA / Aadhaar Auth** | Mock ABDM integration — login with ABHA ID (`name@abdm`) or Aadhaar |
| 📦 **FHIR R4 Bundle** | Full FHIR-compliant health record generated on submission (mocked, ready for real ABDM API) |
| 🏗️ **HIS Push Stub** | Simulates push to Hospital Information System endpoint |

### 🚨 Safety & Compliance
| Feature | Description |
|---|---|
| 🚨 **Real-Time Red-Flag Detection** | Detects emergency symptom combinations in Hindi + English — chest pain + breathlessness, stroke signs, acute abdomen |
| 📜 **DPDP Act 2023 Compliance** | Explicit consent, read aloud paragraph-by-paragraph, verbal "yes" accepted, timestamped |
| 🔒 **Zero Data Transmission** | All data stays in browser localStorage — nothing leaves the device |
| 💾 **Session Auto-Save** | Interrupted patients resume exactly where they left off |

### ♿ Accessibility (Non-Negotiable)
| Feature | Description |
|---|---|
| ♿ **Icon-First Navigation** | Large emoji pictograms on every button (min 56×56px) |
| 🎵 **Audio Sonification** | Distinct tones for `listening` / `done` / `error` / `emergency` / `processing` |
| 🌑 **High-Contrast Mode** | Black background, yellow text, thick borders |
| 🔡 **Font Scaling** | 3 sizes: normal / large / extra-large |
| 🔁 **Persistent Controls** | 🔁 Repeat · ← Back · 🆘 Call Staff — fixed on every screen |
| 🎫 **OPD Token** | Auto-generated and spoken aloud — patient never needs to read it |
| 📖 **Full ARIA Compliance** | `role`, `aria-label`, `aria-live`, `aria-checked` everywhere |

---

## 🏗️ Architecture — 4 Modules

<details>
<summary><b>🔵 Module A — Conversational Multimodal History Engine</b></summary>

The patient is guided through an **adaptive SOCRATES interview** using the internationally-recognised clinical framework:

| Letter | Meaning | How We Capture It |
|---|---|---|
| **S** | Site | 🫀 **Interactive Body Map** — tap the exact spot (no reading needed) |
| **O** | Onset | Voice / tap — "Did it come suddenly or gradually?" |
| **C** | Character | Multi-select icon grid — burning, dull, sharp, cramping… |
| **R** | Radiation | Yes/No + body map |
| **A** | Associations | Multi-select — other symptoms at the same time |
| **T** | Timing | Always there? Comes and goes? Getting worse? |
| **E** | Exacerbating | What makes it worse? What makes it better? |
| **S** | Severity | 😐 **FACES Pain Scale** (6 faces) + numeric slider |

Then continues:
- Past Medical & Surgical History
- Drug & Allergy History
- Family History
- Personal History (smoking, diet, occupation)
- Review of Systems
- **AYUSH Dashavidha Pariksha** (Prakriti, Sara, Samhanana, Pramana, Satmya, Satva, Ahara Shakti, Vyayama Shakti, Vaya)

**🚨 Red-Flag Emergency Detection** runs in real-time throughout:

| Emergency | Triggers | Action |
|---|---|---|
| 🫀 Cardiovascular | Chest pain + breathlessness + sweating + left arm radiation | Priority Triage — ECG Room |
| 🧠 Neurological (Stroke) | Facial droop + slurred speech + one-sided weakness | Code Stroke — CT Neuro |
| 🫁 Respiratory Failure | Severe breathlessness + stridor + gasping | Nebulization + O₂ Triage |
| 🩸 Acute Abdomen | Rigid abdomen + vomiting blood + black stool | Surgical Casualty On-Call |

</details>

<details>
<summary><b>🟢 Module B — Medical Document Digitization & OCR Intelligence</b></summary>

Patients upload old prescriptions, lab reports, discharge summaries, or scan/X-ray reports.

The **Document AI OCR pipeline**:
1. Detects document type (Lab Report / Prescription / Discharge Summary / Scan)
2. Extracts structured data:
   - **Diagnoses** (past conditions)
   - **Medications** (name, dosage, frequency, category)
   - **Lab Results** (value, unit, reference range) — **abnormal values highlighted in red**
   - **Procedures** performed
3. Runs **herbal-allopathic drug interaction checks**
   - *e.g., "Yashtimadhu + Telmisartan may alter blood pressure control"*
4. Sorts documents into a **chronological medical timeline**

</details>

<details>
<summary><b>🟡 Module C — Structured History Summary Generator</b></summary>

Generates a physician-ready, structured clinical summary:

```
Chief Complaint → HPI (SOCRATES) → Past Medical/Surgical →
Drug & Allergy History → Family History → Personal History →
Review of Systems → Prior Investigations Summary
```

- Appears on the **doctor's screen the moment the patient is called**
- Every AI-populated field is clearly marked *"AI-generated — physician must confirm"*
- Bilingual output: patient hears audio confirmation · physician sees structured text
- All fields are editable before saving

</details>

<details>
<summary><b>🔴 Module D — Consent, Privacy & ABDM Integration</b></summary>

- **DPDP Act 2023 compliant** — explicit, granular, revocable consent
- Consent text read aloud paragraph-by-paragraph in patient's chosen language
- Verbal *"yes"* accepted as valid consent alongside tap
- **ABHA Health ID integration** (mock) — `91-XXXX-XXXX-XXXX` or `name@abdm`
- **Aadhaar-based patient lookup** (mock)
- **FHIR R4 Bundle generation** — full structured health record, NDHM-aligned
- **HIS push stub** — simulates real Hospital Information System endpoint

</details>

---

## 🆕 New Features Deep-Dive

### 🫀 Interactive Body Map
> *"A grandmother who can't read 'epigastric region' can definitely tap her stomach."*

Instead of asking patients to select a pain location from a text list, we show a **fully interactive SVG human body diagram**:

- **Front & Back toggle** — covers all anatomical regions
- **11 tappable regions**: Head/Face · Neck/Throat · Chest/Heart · Abdomen · Lower Abdomen · Left Arm · Right Arm · Back/Spine · Left Leg · Right Leg · Whole Body
- Tap a region → immediately advances to next question (no "Next" button)
- Side-panel list for keyboard/screen-reader users
- Every region speaks its name aloud on selection
- **Zero reading required** — designed for fully illiterate patients

```
Front View                    Back View
┌─────────────────┐           ┌─────────────────┐
│    [Head 👤]    │           │    [Head 👤]    │
│    [Neck  ]     │           │    [Neck  ]     │
│ [L Arm][Chest]  │           │[L Arm][Back]    │
│        [Abdm]   │           │                 │
│ [L Leg][R Leg]  │           │ [L Leg][R Leg]  │
└─────────────────┘           └─────────────────┘
```

---

### 😐 Wong-Baker FACES Pain Scale
> *"Globally validated for low-literacy adults and children. Zero reading required."*

Completely replaces the generic 1–10 numeric slider with **6 custom SVG illustrated faces**:

| Score | Face | Label |
|---|---|---|
| 0 | 😊 (big smile, open eyes, green) | No pain |
| 2 | 🙂 (small smile, green-yellow) | Hurts a little |
| 4 | 😐 (flat mouth, yellow) | Hurts some |
| 6 | 😣 (frown, squinting eyes, orange) | Hurts even more |
| 8 | 😰 (deeper frown, squinting, red) | Hurts a lot |
| 10 | 😭 (crying face with blue tear drops, dark red) | Worst pain |

- Custom SVG drawing per face — eyebrows tilt inward with pain, tears appear at score 10
- Selecting a face speaks the pain description aloud
- Numeric slider kept below as secondary option for tech-savvy users
- **Recognised by WHO pain assessment guidelines**

---

### 🔢 Live Queue Token Tracker
> *"Eliminates the most common patient anxiety: 'Did they call me? Did I miss it?'"*

After receiving their OPD token, patients see a real-time queue panel:

```
🌿 Ayurveda OPD          Token: OPD-4821

┌──────────┬──────────┬──────────┐
│ Serving  │ Position │ Est. Wait│
│   4816   │   #5     │  10 min  │
└──────────┴──────────┴──────────┘

Queue: 👤 👤 👤 👤 🙋 (you)

⏰ Please wait — approximately 10 minutes remaining

● Live   Updated: 11:42 AM
```

- Automatically **speaks an alert** when ≤3 patients remain
- Plays an **emergency tone** when patient is NEXT
- Visual queue strip shows their position among waiting patients
- **"While you wait" tip** for patients far back in the queue
- Per-AYUSH-system icons (🌿 Ayurveda · 💊 Homoeopathy · ⚗️ Unani · 🔮 Siddha · 🧘 Yoga)

---

### 📋 Discharge Card
> *"The most common post-visit failure: patient forgets dosage and diet by the time they reach home."*

After submission, a **personalised discharge card** is auto-generated with:

**5 AYUSH-system-specific advice sets** (each unique and clinically accurate):

| Section | What's Inside |
|---|---|
| 🥗 Diet | System-specific dietary rules (Ayurvedic: avoid incompatible foods; Homoeopathic: avoid coffee/mint; Unani: Mizaj-matched foods…) |
| 💊 Medicine Timings | Pictographic: 🌅 Morning · ☀️ Afternoon · 🌙 Night with exact time and before/after food instruction |
| 🌅 Lifestyle | System-specific daily routine advice |
| ❌ Avoid | System-specific contraindications |
| 📅 Next Visit | Auto-calculated (7 days) + "or as directed by doctor" |
| 📞 Emergency | 112 · 108 · Hospital number |

**Action buttons:**
- 📱 **WhatsApp Share** — native `navigator.share` on mobile, URL fallback on desktop
- 🖨️ **Print** — CSS print-safe layout
- 🔊 **Read entire card aloud** — one tap reads all instructions in patient's language

---

### 🤖 Help Assistant Chatbot
> *"A confused or low-literacy patient gets help without needing staff."*

Always-visible `🤖 Help` button (bottom-left corner — never conflicts with the 🔁/←/🆘 cluster at bottom-right):

**What it knows:**

| Category | Examples |
|---|---|
| 🗺️ Navigation | Lab location & timings · Pharmacy · X-Ray · OPD counter · Toilets |
| ⏱️ Wait times | Per-department estimated queues |
| 📖 Medical terms | HPI · SOCRATES · Prakriti · HbA1c · Ayurveda · Homoeopathy · Doshas |
| 📄 Documents | Full checklist · ABHA ID creation guide |
| 🌿 Wellness | Ayurvedic diet rules · Pranayama · Yoga asanas |
| 🚨 Emergency | Symptom recognition + 112/108/hospital number |
| ❓ Context-aware | **"Explain this question"** — re-explains the exact kiosk question the patient is stuck on |

**How it works:**
- Voice input (🎤) + text input + **Quick Chips** (pre-made common questions)
- Offline keyword-scoring engine — no API key, works on ₹3,000 tablet
- All responses translated in all 4 languages
- Re-read button on every bot response 🔊
- Unread badge pulses when the bot has a proactive message

---

## ♿ Accessibility — Built for Everyone

> *This is a PRIMARY evaluation criterion in SIH-26047.*

MediKiosk AI is designed to be **fully usable by someone who cannot read at all** and by **someone who cannot see the screen at all.**

### For Illiterate / Low-Literacy Users
- ✅ **Body Map** — tap a body diagram instead of reading anatomical words
- ✅ **FACES Pain Scale** — tap a face instead of understanding 1–10 numbers
- ✅ **Icon-first navigation** — large emoji pictograms on every button (min 56×56px)
- ✅ **Audio guidance ON by default** — every screen reads itself aloud
- ✅ **No typed text required** — all input via voice or tap-to-select
- ✅ **Visual + audio + shape redundancy** — never convey meaning through color alone
- ✅ **Large tap targets** — minimum 48×48px, typically 64–100px

### For Visually Impaired Users
- ✅ **Full ARIA compliance** — `role`, `aria-label`, `aria-live`, `aria-checked` everywhere
- ✅ **Screen reader compatible** — logical tab/focus order throughout
- ✅ **Voice-first mode** — entire flow completable by listening + speaking only
- ✅ **Audio consent** — DPDP text read aloud in full; verbal "yes" accepted
- ✅ **High-contrast mode** — black background, yellow text, bold borders
- ✅ **Sonification** — distinct audio tones for `listening` 🎵, `done` ✅, `error` ❌, `emergency` 🚨
- ✅ **Discharge Card read aloud** — one tap reads entire post-visit instructions

### Persistent Controls (Every Screen)
```
Bottom-right corner — always visible, always in the same place:
  🔁 Repeat (re-speaks the current question)
  ← Back   (go to previous step)
  🆘 Help  (alerts staff + plays loud tone + opens call modal)

Bottom-left corner:
  🤖 Help  (AI assistant — navigation, terms, wellness, emergency)
```

---

## 🌐 Languages Supported

| Language | Code | TTS Voice | Script |
|---|---|---|---|
| English | `en` | `en-IN` | Latin |
| हिंदी Hindi | `hi` | `hi-IN` | Devanagari |
| தமிழ் Tamil | `ta` | `ta-IN` | Tamil |
| বাংলা Bengali | `bn` | `bn-IN` | Bengali |

All patient-facing text, audio prompts, error messages, discharge card content, and chatbot responses are available in all 4 languages. Adding more languages requires only a new entry in [`src/i18n/strings.ts`](src/i18n/strings.ts).

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 18 + TypeScript | Component-driven, type-safe |
| **Build Tool** | Vite 8 | Instant HMR, fast production builds |
| **Styling** | Tailwind CSS 4 | Utility-first, responsive by default |
| **Icons** | Lucide React | Consistent, accessible icon set |
| **Body Map** | Custom SVG (inline) | No dependencies, fully accessible |
| **FACES Scale** | Custom SVG (inline) | No image files, crisp at any size |
| **Routing** | React Router 7 | Client-side SPA routing |
| **Voice Input** | Web Speech API (native) | Works offline, no API key needed |
| **TTS** | SpeechSynthesis API (native) | Works offline, 4-language support |
| **Audio Tones** | Web Audio API (native) | Sonification, no audio files needed |
| **Data** | localStorage + sessionStorage | 100% offline, no backend required |
| **Linting** | oxlint | Fast, zero-config |

> **No API keys. No backend. No database. No internet required after first load.**
> Runs entirely in the browser — works on a ₹3,000 Android tablet.

---

## 📁 Project Structure

```
src/
├── i18n/
│   └── strings.ts                  # 4-language translations (en/hi/ta/bn)
├── services/
│   ├── abhaService.ts              # Mock ABHA/Aadhaar auth + FHIR R4 bundle
│   ├── adaptiveQuestioning.ts      # Branching SOCRATES question engine
│   ├── aiIntelligence.ts           # Red-flag detection, TTS, OCR pipeline
│   ├── chatbotKnowledge.ts         # 🆕 Help chatbot knowledge base (20+ entries)
│   └── storage.ts                  # localStorage CRUD
├── components/
│   ├── AccessibilityProvider.tsx   # Global a11y context (lang/audio/contrast/TTS)
│   ├── AccessibilityToolbar.tsx    # Floating ♿ controls
│   ├── AudioProgressBar.tsx        # Icon-milestone progress tracker
│   ├── BodyMap.tsx                 # 🆕 Interactive SVG body diagram (front+back)
│   ├── DischargeCard.tsx           # 🆕 Post-visit card (WhatsApp + print)
│   ├── FacesPainScale.tsx          # 🆕 Wong-Baker FACES pain scale (6 custom SVG faces)
│   ├── HelpChatbot.tsx             # 🆕 Floating help assistant (offline, 4-language)
│   ├── IconButton.tsx              # Large accessible tap target (56px+)
│   ├── QueueTracker.tsx            # 🆕 Live OPD queue position + TTS alerts
│   ├── RepeatBackButton.tsx        # Persistent 🔁/←/🆘 cluster
│   └── Navbar.tsx                  # Doctor-facing navigation
├── hooks/
│   └── useAutoSpeak.ts             # Auto-TTS on screen mount/step change
└── pages/
    ├── PatientCheckinPage.tsx      # 🌟 5-step patient kiosk wizard (1600+ lines)
    ├── DashboardPage.tsx           # Doctor's OPD queue dashboard
    ├── CaseTakingPage.tsx          # Full AYUSH case-taking form
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Chrome or Edge (for Web Speech API — voice input/output)

### Installation

```bash
# Clone the repository
git clone https://github.com/shauryapratap969687-cmyk/New_SIH_26047.git
cd New_SIH_26047

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser:

| URL | Description |
|---|---|
| `http://localhost:5173/patient-checkin` | 🏥 Patient Kiosk — the full 5-step flow |
| `http://localhost:5173/login` | 👨‍⚕️ Doctor Login |
| `http://localhost:5173/dashboard` | 📊 Doctor Dashboard (after login) |

### Demo Credentials

```
Doctor Login:
  Email:    doctor@ayush.demo
  Password: Ayush@123

ABHA IDs (for Patient Kiosk):
  91-4829-1029-4821  →  Ramesh Kumar Sharma (Male, 54)
  ramesh@abdm        →  Same patient (handle format)
  91-1234-5678-9012  →  Priya Devi (Female, 32)

Aadhaar (for lookup):
  234567890123       →  Ramesh Kumar Sharma
  987654321098       →  Priya Devi
```

### Production Build

```bash
npm run build      # TypeScript compile + Vite bundle → dist/
npm run preview    # Preview production build locally
npx oxlint src/    # Lint check (must exit 0)
```

---

## 🎭 The Patient Journey (End-to-End Demo)

```
Step 1 — IDENTIFY (2–3 min)
  ├── Select language: 🇬🇧 English / 🇮🇳 हिंदी / 🇮🇳 தமிழ் / 🇮🇳 বাংলা
  ├── Login: ABHA ID / Aadhaar / Register New
  ├── DPDP Act 2023 consent (read aloud per-paragraph, verbal "yes" accepted)
  └── Select AYUSH system: Ayurveda / Unani / Siddha / Homoeopathy / Yoga

Step 2 — CONVERSE (3–5 min)
  ├── Chief Complaint (icon grid)
  ├── 🆕 Body Map: Tap exact pain location on SVG body
  ├── Duration / Onset
  ├── SOCRATES HPI (7 questions, branching)
  ├── 🆕 FACES Scale: Tap a face to rate pain severity
  ├── Past Medical / Surgical / Allergy / Family / Personal History
  ├── Review of Systems
  └── AYUSH Dashavidha Pariksha
       ↓  Red-flag engine running throughout  ↓
       🚨 Emergency detected → Full-screen alert → Priority Triage

Step 3 — SCAN (optional, 1–2 min)
  ├── Upload old prescriptions, lab reports, discharge summaries
  ├── OCR extracts diagnoses, medications, lab values
  ├── Abnormal results flagged red + spoken aloud
  └── Drug interaction alerts

Step 4 — SUMMARIZE (1 min)
  ├── Structured clinical summary preview
  ├── FHIR R4 bundle generated + HIS push
  └── Confirm & Get Token

Step 5 — DONE 🎉
  ├── 🆕 Live Queue Tracker (real-time position + est. wait + TTS alerts)
  ├── 🆕 Discharge Card (diet + timings + lifestyle — WhatsApp / Print)
  ├── Token spoken aloud
  └── Doctor's screen already populated — ready to treat
```

---

## 👨‍⚕️ The Doctor's Experience

```
┌─────────────────────────────────────────────────────────┐
│  🤖 AI-Generated Clinical Summary — Ramesh Kumar Sharma │
│  ─────────────────────────────────────────────────────  │
│  Chief Complaint: Bilateral knee joint pain × 3 months  │
│  Site: Left Leg / Knee (tapped on body map)             │
│  Severity: 6/10 😣 (FACES scale — "Hurts even more")   │
│  HPI: Dull aching, gradual onset, worse in cold mornings│
│       relieved by warm fomentation                      │
│  Past Medical: Hypertension (Telmisartan)               │
│  Allergies: None reported                               │
│  ─────────────────────────────────────────────────────  │
│  📄 2 documents scanned — 1 abnormal result             │
│  ⚠️  FBS: 118 mg/dL (High) · HbA1c: 6.4% (Prediabetes) │
│  💊  Drug alert: Avoid Licorice with Telmisartan        │
│  ─────────────────────────────────────────────────────  │
│  [AI-populated — confirm before saving]                 │
└─────────────────────────────────────────────────────────┘
```

The doctor then fills the system-specific AYUSH form:
- **Ayurveda**: Ashtavidha Pariksha + Dashavidha + Dosha analysis
- **Homoeopathy**: Mental/Physical Generals + Miasmatic Impression + Repertory Rubrics
- **Unani**: Mizaj + Nabz + Asbab-e-Sitta Zarooriya
- **Siddha**: Envagai Thervu + Vali/Azhal/Iyam + Neerkuri-Neikuri
- **Yoga & Naturopathy**: Stress level + Yoga experience + Contraindications

---

## 📊 Impact

| Metric | Before MediKiosk | After MediKiosk |
|---|---|---|
| History collection time | 10–15 min (doctor's time) | < 5 min (patient self-reports) |
| Pain location accuracy | Verbal description, often imprecise | Exact body-map tap location |
| Pain scale literacy | Many patients can't use 1–10 | FACES scale — zero reading needed |
| Emergency detection | Manual, depends on triage | Real-time automated, bilingual |
| Post-visit compliance | Patient forgets diet/timing at home | WhatsApp discharge card in hand |
| Queue anxiety | Patient misses their call | Live audio queue updates |
| Language barrier | High | Eliminated — 4 languages + voice |
| Paper document loss | Common | Digitized and structured |
| Target reach | — | 3,900+ AYUSH hospitals · 28,000+ dispensaries |

---

## 🔒 Data Privacy

- All data stored in **browser localStorage / sessionStorage only** — nothing leaves the device
- Voice audio is **never stored** — only the extracted text transcript
- Session data cleared immediately after patient submits
- **DPDP Act 2023 consent** mandatory before any data collection begins
- ABHA ID linked only after explicit patient consent
- Aadhaar number **never stored** — used only for ABHA profile lookup

---

## 🤝 Contributing

We welcome contributions! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) first.

```bash
git checkout -b feat/your-feature
# make changes
npm run build       # must exit 0
npx oxlint src/     # must exit 0
git push origin feat/your-feature
# open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file for details.

---

## 🏆 Team

Built with ❤️ for **Smart India Hackathon 2026** · Problem Statement **SIH-26047**

*Ministry of AYUSH · National Health Authority · Ayushman Bharat Digital Mission*

---

<div align="center">

### 🆕 Latest Release Highlights
🫀 Body Map · 😐 FACES Pain Scale · 🔢 Live Queue Tracker · 📋 WhatsApp Discharge Card · 🤖 AI Help Chatbot

**⭐ If this project helped you, please star the repository!**

[![GitHub stars](https://img.shields.io/github/stars/shauryapratap969687-cmyk/New_SIH_26047?style=social)](https://github.com/shauryapratap969687-cmyk/New_SIH_26047/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shauryapratap969687-cmyk/New_SIH_26047?style=social)](https://github.com/shauryapratap969687-cmyk/New_SIH_26047/network/members)

</div>
