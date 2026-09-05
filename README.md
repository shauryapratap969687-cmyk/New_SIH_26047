# 🌿 AYUSH CaseFlow
### **SIH26047: Patient Case-Taking Software for Ministry of Ayush**
> *Digitalized Clinical Case-Taking, Assessment & Decision Support System*

---

## 📌 Problem Overview & Purpose
**AYUSH CaseFlow** is a modern, responsive prototype designed for **Smart India Hackathon (SIH26047)** for the **Ministry of Ayush, Government of India**. 

Standardized clinical case-taking across traditional and complementary systems—**Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homoeopathy**—requires structured capture of holistic diagnostic parameters (*Dosha, Dhatus, Ashtavidha/Dashavidha Pariksha, Miasm, Mizaj, Asbab-e-Sitta, Envagai Thervu*) alongside conventional medical examinations and vitals.

This prototype provides attending AYUSH Medical Officers with a standardized digital case sheet, audio-assisted voice-to-text dictation, and print-ready clinical reports.

> ⚠️ **Disclaimer:** *Prototype only. Built for hackathon demonstration purposes. Not for real clinical diagnosis or emergency medical decision-making.*

---

## ✨ Core Features

### 1. 🔐 Doctor Authentication Portal
- Secure login interface with route guarding.
- **Demo Account Autofill:** 1-click button to automatically load demo doctor credentials.
- Persistent session storage in `localStorage`.
- Official credentials:
  - **Email:** `doctor@ayush.demo`
  - **Password:** `Ayush@123`

### 2. 📊 Doctor Dashboard & Insights
- Dynamic KPI stat counters: **Total Patients**, **Total Cases**, **Cases Today**, **Draft Cases**.
- Integrated **AYUSH Discipline Breakdown** (Ayurveda, Homoeopathy, Unani, Siddha, Yoga & Naturopathy).
- Live Recent Cases table with instant search and 1-click shortcuts to view/edit/print.

### 3. 👤 Add Patient Demographics
- Structured intake form for demographics, emergency contacts, occupation, and known allergies.
- Automatic registration ID generator (`PAT-2026-XXXX`).
- Informed digital consent tracking checkbox.
- Quick navigation directly into case-taking for registered patients.

### 4. 🌟 AYUSH-Specific Case-Taking Form (Star Feature)
A 6-step clinical case workflow tailored to traditional systems of medicine:
1. **Patient Selection & System**: Link to patient and select primary AYUSH discipline.
2. **Presenting Complaints**: Chief complaints, duration (*Kala*), onset/progression, associated symptoms (*Anubandha Lakshana*), previous treatments.
3. **General History**: Past medical/surgical history, family history (*Kula Vrittanta*), physiological functions (appetite, sleep quality, bowel/bladder, mental state, menstrual history).
4. **Vitals & Physical Exam**: Height, weight, auto-calculated **BMI ($kg/m^2$)**, BP, pulse, temp, respiratory rate, systemic findings.
5. **AYUSH Assessment (Discipline-Dynamic)**:
   - **Common AYUSH**: *Bala* (Strength), *Satva* (Mind), *Agni* (Digestion), *Nidana* (Etiology), *Samprapti* (Pathogenesis).
   - **Ayurveda**: Dosha balance, Prakriti, Agni, Koshta, **Ashtavidha Pariksha** (Nadi, Mutra, Mala, Jihva, Shabda, Sparsha, Drik, Akriti) & **Dashavidha Pariksha** notes.
   - **Homoeopathy**: Thermal state, thirst pattern, miasmatic impression (Psora, Sycosis, Syphilis, Tubercular), mental/physical generals, modalities ($<$ / $>$), repertory rubrics.
   - **Unani**: Mizaj (Damwi, Safrawi, Balghami, Sawdawi, Motadil), Akhlat imbalance, Nabz, **Asbab-e-Sitta Zarooriya** (6 Essentials), Sue Mizaj.
   - **Siddha**: Mukkuttram balance (Vali, Azhal, Iyam), Udal Thathu, Neerkuri/Neikuri oil drop notes, **Envagai Thervu** 8-fold examination.
   - **Yoga & Naturopathy**: Stress level, activity level, yoga experience, flexibility limits, postural contraindications, nature cure therapy notes.
6. **Doctor Assessment & Plan**: Provisional AYUSH diagnosis, recommended diagnostic tests/referrals, therapeutic prescriptions, diet (*Pathya/Apathya*), lifestyle guidelines, follow-up scheduler.

### 5. 🎙️ Smart Feature: Voice-to-Text Dictation
- Integrated across key clinical textareas (*Chief Complaints, Past History, Examination Findings, Observations, Advice*).
- Powered by browser-native **Web Speech API** (zero paid APIs, no third-party keys required).
- Features **live pulsing waveform recording indicator**, continuous interim feedback, and language toggle (**English (`en-IN`) / Hindi (`hi-IN`)**).
- Fallback alerts for unsupported environments.

### 6. 📁 Saved Cases & Directory
- Filter by **AYUSH Discipline** and **Status (Draft / Saved)**.
- Real-time search across patient name, case ID, complaint keywords, or diagnosis.
- Edit pending draft sessions or delete obsolete test records.

### 7. 🖨️ Printable Clinical Case Summary Sheet
- Official Ministry of Ayush-style standard case sheet format.
- Clean printable design (`window.print()`) with print CSS optimizations (removes web navigation and highlights clinical parameters).

---

## 🛠️ Technology Stack
- **Framework:** React 19 + TypeScript (Strict Mode)
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Routing:** React Router v7 (SPA with client-side history)
- **Persistence:** LocalStorage Service with pre-seeded realistic sample clinical data
- **Speech Engine:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)

---

## 🚀 Quick Start & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- Modern web browser (Google Chrome, Microsoft Edge, or Chromium-based browsers recommended for Web Speech API support)

### Installation & Launch

1. **Clone or Navigate to the project directory:**
   ```bash
   cd ayush-caseflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` (or the URL shown in your terminal).

4. **Production Build:**
   ```bash
   npm run build
   ```

5. **Linting Check:**
   ```bash
   npm run lint
   ```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **AYUSH Medical Officer** | `doctor@ayush.demo` | `Ayush@123` |

*Tip: You can click the **"Auto-Fill Demo"** button on the login screen to sign in instantly.*

---

## 📋 Sample Data Pre-loaded
On first launch, AYUSH CaseFlow automatically initializes realistic demonstration records:
- **3 Patients:**
  - `PAT-2026-1042`: Rajesh Sharma (48y, Male)
  - `PAT-2026-1089`: Sunita Devi (34y, Female)
  - `PAT-2026-1120`: Mohammad Farooq (52y, Male)
- **3 Comprehensive Cases:**
  - `CAS-2026-8801`: Ayurveda — *Janu Sandhigata Vata* (Bilateral Knee Osteoarthritis)
  - `CAS-2026-8802`: Homoeopathy — *Chronic Vascular Migraine with Psora-Sycosis Miasm*
  - `CAS-2026-8803`: Unani — *Waja-ul-Mafasil (Rheumatoid Joint Pain with Sue Mizaj Barid)*

---

## 🌐 Voice-to-Text Browser Compatibility Notes
- Voice-to-text uses the standard **Web Speech API** natively built into Chromium browsers.
- For best voice dictation performance, test in **Google Chrome** or **Microsoft Edge**.
- Please allow microphone permissions when prompted by your browser.

---

## 👥 Hackathon Submission Info
- **Problem Statement ID:** SIH26047
- **Project Title:** Patient Case-Taking Software
- **Beneficiary:** Ministry of Ayush, Government of India
- **Deliverable:** Working interactive prototype ready for 7th Sept evaluation.
