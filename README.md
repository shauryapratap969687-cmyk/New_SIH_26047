<div align="center">

# 🏥 MediKiosk AI
### *AYUSH Smart Pre-Consultation Platform*

**Smart India Hackathon 2026 · Problem Statement SIH-26047**

[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> **"MediKiosk AI doesn't replace the AYUSH physician.**
> **It gives them a 10-minute head start."**

<br/>

[🚀 Live Demo](#-getting-started) · [📖 Documentation](#-architecture) · [🎯 SIH Problem Statement](#-problem-statement) · [🤝 Contributing](#-contributing)

---

</div>

## 🎯 Problem Statement

**Imagine you are a patient in an AYUSH hospital OPD.**

You wait 45 minutes in a queue. When you finally meet the doctor, the next **15 minutes are spent answering basic questions** — name, age, where the pain is, how long, what medications you've taken.

> The doctor is doing data entry. That's not doctoring — that's clerical work.

This happens at **every AYUSH OPD in India**, every single day. The problem is even worse for AYUSH than for allopathy — because AYUSH doctors need *more* information:

- Prakriti (body constitution)
- Nadi (pulse examination)
- Agni (digestive strength)
- Dashavidha Pariksha (10-fold assessment)
- Ahara-Vihara (diet & lifestyle patterns)

A **60-point assessment** that a 5-minute OPD slot simply cannot accommodate.

**SIH-26047 asks us to fix this.** We did.

---

## 💡 Our Solution

**MediKiosk AI** is a bilingual, multimodal, fully-accessible pre-consultation kiosk that patients use **in the waiting room, before they meet the doctor.** By the time the patient walks in, the doctor already has a complete, structured clinical history on their screen.

```
Patient arrives → Kiosk → Voice/Touch Interview → OCR Documents → Summary → Doctor
     ↑                                                                        ↑
  (waiting room)                                                    (ready to treat)
```

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🗣️ **Voice + Touch Dual Input** | Every question answerable by speaking OR tapping — never forced into one mode |
| 🌐 **4-Language Support** | English · हिंदी · தமிழ் · বাংলা — with audio auto-play and icon-first selection |
| 🔊 **Audio-Guided by Default** | Every screen reads itself aloud — designed for illiterate & visually impaired patients |
| 🚨 **Real-Time Red-Flag Detection** | Detects emergency symptoms (chest pain, stroke, respiratory failure) in Hindi + English |
| 📄 **Document AI / OCR** | Upload old prescriptions & lab reports — AI extracts diagnoses, medications, lab values |
| 🏥 **ABHA / Aadhaar Auth** | Mock ABDM integration — patients log in with ABHA ID or Aadhaar |
| 📋 **FHIR R4 Bundle** | Generates FHIR-compliant health record bundle (mocked, ready for real ABDM API) |
| ♿ **Full Accessibility** | ARIA roles · Screen-reader compatible · High-contrast mode · Font scaling |
| 🎫 **OPD Token System** | Auto-generates and speaks the patient's queue token number |
| 💾 **Session Auto-Save** | Interrupted patients can resume exactly where they left off |

---

## 🏗️ Architecture — 4 Modules

<details>
<summary><b>🔵 Module A — Conversational Multimodal History Engine</b></summary>

The patient is guided through an **adaptive SOCRATES interview** using the internationally-recognised clinical framework:

| Letter | Meaning | Question |
|---|---|---|
| **S** | Site | Where in your body is the problem? |
| **O** | Onset | Did it come suddenly or gradually? |
| **C** | Character | What does it feel like? (burning, dull, sharp…) |
| **R** | Radiation | Does it spread anywhere? |
| **A** | Associations | Any other symptoms at the same time? |
| **T** | Timing | Is it always there, or does it come and go? |
| **E** | Exacerbating/Relieving | What makes it worse or better? |
| **S** | Severity | How bad is it? (1–10 scale) |

The interview then continues with:
- Past Medical & Surgical History
- Drug & Allergy History
- Family History
- Personal History (smoking, diet, occupation)
- Review of Systems
- **AYUSH Dashavidha Pariksha** (all 10 fields — Prakriti, Sara, Samhanana, Pramana, Satmya, Satva, Ahara Shakti, Vyayama Shakti, Vaya)

**🚨 Red-Flag Emergency Detection** runs in real-time:

| Emergency | Triggers | Action |
|---|---|---|
| 🫀 Cardiovascular | Chest pain + breathlessness + sweating + left arm radiation | Immediate Priority Triage — ECG Room |
| 🧠 Neurological (Stroke) | Facial droop + slurred speech + one-sided weakness | Code Stroke — CT Neuro |
| 🫁 Respiratory Failure | Severe breathlessness + stridor + gasping | Nebulization + O₂ Triage |
| 🩸 Acute Abdomen | Rigid abdomen + vomiting blood + black stool | Surgical Casualty On-Call |

Bilingual keywords supported — `seene me dard` = `chest pain`, `behosh` = `loss of consciousness`.

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

Generates a physician-ready, structured clinical summary in the standard format:

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

## ♿ Accessibility — Built for Everyone

> *This is a PRIMARY evaluation criterion in SIH-26047.*

MediKiosk AI is designed to be **fully usable by someone who cannot read at all** and by **someone who cannot see the screen at all.**

### For Illiterate / Low-Literacy Users
- ✅ **Icon-first navigation** — large emoji pictograms on every button (min 56×56px)
- ✅ **Audio guidance ON by default** — every screen reads itself aloud without any toggle
- ✅ **No typed text required** — all input via voice or tap-to-select
- ✅ **Visual progress metaphors** — icon milestone bar, not just "Step 3 of 5"
- ✅ **Color + shape + audio redundancy** — never convey meaning through color alone
- ✅ **Large tap targets** — minimum 48×48px enforced via CSS, typically 64–100px

### For Visually Impaired Users
- ✅ **Full ARIA compliance** — `role`, `aria-label`, `aria-live`, `aria-checked` everywhere
- ✅ **Screen reader compatible** — tested logical tab/focus order
- ✅ **Voice-first mode** — entire flow completable by listening + speaking only
- ✅ **Audio consent** — DPDP text read aloud in full; verbal "yes" accepted
- ✅ **High-contrast mode** — black background, yellow text, bold borders
- ✅ **Sonification** — distinct audio tones for `listening` 🎵, `done` ✅, `error` ❌, `emergency` 🚨
- ✅ **Document scanning audio guidance** — "Document detected — hold steady — captured"

### Persistent Controls (Every Screen)
```
Bottom-right corner — always visible, always in the same place:
  🔁 Repeat (re-speaks the current question)
  ← Back   (go to previous)
  🆘 Help  (alerts staff + plays loud tone)
```

---

## 🌐 Languages Supported

| Language | Code | TTS Voice | Script |
|---|---|---|---|
| English | `en` | `en-IN` | Latin |
| हिंदी Hindi | `hi` | `hi-IN` | Devanagari |
| தமிழ் Tamil | `ta` | `ta-IN` | Tamil |
| বাংলা Bengali | `bn` | `bn-IN` | Bengali |

All patient-facing text, audio prompts, and error messages are translated in all 4 languages. Adding more languages requires only a new entry in [`src/i18n/strings.ts`](src/i18n/strings.ts).

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 18 + TypeScript | Component-driven, type-safe |
| **Build Tool** | Vite 8 | Instant HMR, fast production builds |
| **Styling** | Tailwind CSS 4 | Utility-first, responsive by default |
| **Icons** | Lucide React | Consistent, accessible icon set |
| **Routing** | React Router 7 | Client-side SPA routing |
| **Voice Input** | Web Speech API (native) | Works offline, no API key needed |
| **TTS** | SpeechSynthesis API (native) | Works offline, 4-language support |
| **Audio Tones** | Web Audio API (native) | Sonification for screen-reader users |
| **Data** | localStorage + sessionStorage | 100% offline, no backend required |
| **Linting** | oxlint | Fast, zero-config |

> **No API keys. No backend. No database.** Runs entirely in the browser — works on a ₹3,000 Android tablet with no internet after first load.

---

## 📁 Project Structure

```
ayush-caseflow/
├── src/
│   ├── i18n/
│   │   └── strings.ts              # 4-language translations (en/hi/ta/bn)
│   ├── services/
│   │   ├── abhaService.ts          # Mock ABHA/Aadhaar auth + FHIR R4 bundle
│   │   ├── adaptiveQuestioning.ts  # Branching SOCRATES question engine
│   │   ├── aiIntelligence.ts       # Red-flag detection, TTS, OCR pipeline
│   │   └── storage.ts              # localStorage CRUD for patients & cases
│   ├── components/
│   │   ├── AccessibilityProvider.tsx  # Global a11y context (lang/audio/contrast)
│   │   ├── AccessibilityToolbar.tsx   # Floating ♿ controls
│   │   ├── AudioProgressBar.tsx       # Icon-milestone progress tracker
│   │   ├── IconButton.tsx             # Large accessible tap target (56px+)
│   │   ├── RepeatBackButton.tsx       # Persistent 🔁/←/🆘 cluster
│   │   ├── VoiceDictationButton.tsx   # Mic input component
│   │   └── Navbar.tsx                 # Doctor-facing navigation
│   ├── hooks/
│   │   └── useAutoSpeak.ts         # Auto-TTS on screen mount/step change
│   ├── pages/
│   │   ├── PatientCheckinPage.tsx  # 🌟 5-step patient kiosk wizard
│   │   ├── DashboardPage.tsx       # Doctor's OPD queue dashboard
│   │   ├── CaseTakingPage.tsx      # Full AYUSH case-taking form
│   │   ├── LoginPage.tsx           # Doctor authentication
│   │   ├── AddPatientPage.tsx      # Manual patient registration
│   │   ├── SavedCasesPage.tsx      # Case history browser
│   │   └── CaseDetailPage.tsx      # Individual case viewer
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces for all 5 AYUSH systems
│   ├── context/
│   │   └── AuthContext.tsx         # Doctor session management
│   └── App.tsx                     # Route definitions
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Chrome or Edge browser (for Web Speech API / Voice input)

### Installation

```bash
# Clone the repository
git clone https://github.com/shauryapratap969687-cmyk/New_SIH_26047.git

# Navigate into the project
cd New_SIH_26047

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser and visit:

| URL | Description |
|---|---|
| `http://localhost:5173/patient-checkin` | 🏥 Patient Kiosk (public — no login) |
| `http://localhost:5173/login` | 👨‍⚕️ Doctor Login |
| `http://localhost:5173/dashboard` | 📊 Doctor Dashboard (after login) |

### Demo Credentials

```
Email:    doctor@ayush.demo
Password: Ayush@123
```

### Test ABHA IDs (for Patient Kiosk)

```
91-4829-1029-4821   →  Ramesh Kumar Sharma (Male, 54)
ramesh@abdm         →  Same patient (handle format)
91-1234-5678-9012   →  Priya Devi (Female, 32)

Aadhaar: 234567890123  →  Ramesh Kumar Sharma
```

### Production Build

```bash
npm run build     # TypeScript compile + Vite bundle
npm run preview   # Preview the production build locally
npx oxlint src/   # Lint check
```

---

## 🎭 The Patient Journey (End-to-End Demo)

```
Step 1 — IDENTIFY
  ├── Select language: 🇬🇧 English / 🇮🇳 हिंदी / 🇮🇳 தமிழ் / 🇮🇳 বাংলা
  ├── Login: ABHA ID / Aadhaar / Register New
  ├── DPDP Act 2023 consent (read aloud, verbal "yes" accepted)
  └── Select AYUSH system: Ayurveda / Unani / Siddha / Homoeopathy / Yoga

Step 2 — CONVERSE (Adaptive Interview — 21 questions)
  ├── Chief Complaint (multi-select icon grid)
  ├── Duration
  ├── SOCRATES HPI (8 questions, branching)
  ├── Past Medical / Surgical / Allergy / Family / Personal History
  ├── Review of Systems
  └── AYUSH Dashavidha Pariksha (Prakriti, Ahara Shakti, Vihara…)
       ↓ Red-flag engine running throughout ↓
       🚨 Emergency detected → Full-screen alert → Priority Triage

Step 3 — SCAN
  ├── Upload/photograph old prescriptions, lab reports, discharge summaries
  ├── OCR extracts diagnoses, medications, lab values
  ├── Abnormal results flagged in red + spoken aloud
  └── Drug interaction alerts generated

Step 4 — SUMMARIZE & ROUTE
  ├── Structured clinical summary preview (Chief Complaint → ROS)
  ├── "Send to Hospital System" → FHIR R4 bundle generated + HIS push
  ├── Patient hears audio confirmation in their language
  └── Confirm & Get Token

Step 5 — DONE
  ├── OPD Token printed on screen (e.g. OPD-4821)
  ├── Token number spoken aloud ("You are number 4821 in the queue")
  └── Patient waits — doctor's screen is already populated
```

---

## 👨‍⚕️ The Doctor's Experience

When the patient's turn comes, the doctor sees:

```
┌─────────────────────────────────────────────────────────┐
│  🤖 AI-Generated Clinical Summary — [Patient Name]      │
│  ─────────────────────────────────────────────────────  │
│  Chief Complaint: Joint pain, bilateral knees × 3 months│
│  HPI: Dull aching pain (6/10), gradual onset, worse in  │
│       cold mornings, relieved by warm fomentation        │
│  Past Medical: Hypertension (on Telmisartan)            │
│  Allergies: None reported                               │
│  ─────────────────────────────────────────────────────  │
│  📄 2 documents scanned — 1 abnormal result             │
│  ⚠️  FBS: 118 mg/dL (High) · HbA1c: 6.4% (Prediabetes) │
│  💊  Drug alert: Avoid Licorice with Telmisartan        │
│  ─────────────────────────────────────────────────────  │
│  [AI-populated — confirm before saving]                 │
└─────────────────────────────────────────────────────────┘
```

The doctor then edits, confirms, and completes the full AYUSH assessment:

- **Ayurveda**: Ashtavidha Pariksha (Nadi, Mutra, Mala, Jihva, Shabda, Sparsha, Drik, Akriti) + Dashavidha + Dosha
- **Homoeopathy**: Mental/Physical Generals, Thermal State, Miasmatic Impression, Repertory Rubrics
- **Unani**: Mizaj, Nabz, Akhlat, Asbab-e-Sitta Zarooriya
- **Siddha**: Udal Thathu, Envagai Thervu, Vali/Azhal/Iyam, Neerkuri-Neikuri
- **Yoga & Naturopathy**: Stress level, Yoga experience, Contraindications, Nature cure

---

## 📊 Impact

| Metric | Before MediKiosk | After MediKiosk |
|---|---|---|
| History collection time | 10–15 min per patient (doctor's time) | < 5 min (patient self-reports at kiosk) |
| Emergency detection | Manual, depends on triage nurse | Real-time automated, bilingual |
| Paper document loss | Common | Digitized and structured |
| AYUSH documentation | Ad-hoc, paper-based | Standardised, structured, digital |
| Language barrier | High | Eliminated (4 languages + voice) |
| Illiterate patient access | Poor | Full icon + audio guidance |

**Target reach**: 3,900+ AYUSH hospitals · 28,000+ dispensaries · 750M+ AYUSH patients annually

---

## 🔒 Data Privacy

- All data stored in **browser localStorage / sessionStorage only** — nothing leaves the device
- Temporary voice audio is **never stored** — only the extracted text
- Session data cleared immediately after patient submits
- DPDP Act 2023 consent is **mandatory** before any data collection begins
- ABHA ID linked only after explicit patient consent

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run build` (must pass) and `npx oxlint src/` (must pass)
5. Commit and push (`git push origin feature/your-feature`)
6. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🏆 Team

Built with ❤️ for **Smart India Hackathon 2026** · Problem Statement **SIH-26047**

*Ministry of AYUSH · National Health Authority · ABDM*

---

<div align="center">

**⭐ If this project helped you, please star the repository!**

[![GitHub stars](https://img.shields.io/github/stars/shauryapratap969687-cmyk/New_SIH_26047?style=social)](https://github.com/shauryapratap969687-cmyk/New_SIH_26047/stargazers)

</div>
