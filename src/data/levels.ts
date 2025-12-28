export interface Choice {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Junction {
  question: string;
  choices: Choice[];
}

export interface Level {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  junctions: Junction[];
}

export const levels: Level[] = [
  {
    id: "pulmonary-embolism",
    title: "Pulmonary Embolism",
    icon: "🫁",
    description: "Navigate the diagnosis and treatment of PE",
    color: "from-blue-500 to-cyan-500",
    junctions: [
      {
        question: "A patient presents with sudden dyspnea and pleuritic chest pain. What is the most appropriate initial test?",
        choices: [
          { text: "D-dimer", isCorrect: true, explanation: "D-dimer is the appropriate initial test in patients with low-to-moderate pretest probability." },
          { text: "Chest X-ray only", isCorrect: false, explanation: "Chest X-ray is often normal in PE and not sensitive enough for diagnosis." },
          { text: "ECG only", isCorrect: false, explanation: "ECG may show signs but is not diagnostic for PE." },
        ],
      },
      {
        question: "D-dimer is elevated. What is the next step?",
        choices: [
          { text: "CT Pulmonary Angiography", isCorrect: true, explanation: "CTPA is the gold standard imaging for PE diagnosis." },
          { text: "Start aspirin", isCorrect: false, explanation: "Aspirin is not the treatment of choice for PE." },
          { text: "Reassure and discharge", isCorrect: false, explanation: "Elevated D-dimer requires further workup." },
        ],
      },
      {
        question: "CTPA confirms PE. What is the first-line treatment for a hemodynamically stable patient?",
        choices: [
          { text: "Anticoagulation (DOAC/LMWH)", isCorrect: true, explanation: "Anticoagulation is first-line for stable PE patients." },
          { text: "Thrombolysis", isCorrect: false, explanation: "Thrombolysis is reserved for massive/unstable PE." },
          { text: "Surgical embolectomy", isCorrect: false, explanation: "Surgery is rarely needed and for specific cases only." },
        ],
      },
    ],
  },
  {
    id: "myocardial-infarction",
    title: "Myocardial Infarction",
    icon: "❤️",
    description: "Race through the management of MI",
    color: "from-red-500 to-orange-500",
    junctions: [
      {
        question: "A patient presents with crushing chest pain radiating to the left arm. What should you order first?",
        choices: [
          { text: "12-lead ECG", isCorrect: true, explanation: "ECG should be obtained within 10 minutes of arrival." },
          { text: "Cardiac enzymes only", isCorrect: false, explanation: "Enzymes take time; ECG is faster and guides immediate management." },
          { text: "Chest X-ray first", isCorrect: false, explanation: "CXR is helpful but ECG is priority for suspected MI." },
        ],
      },
      {
        question: "ECG shows ST-elevation in leads II, III, aVF. What type of MI is this?",
        choices: [
          { text: "Inferior STEMI", isCorrect: true, explanation: "Leads II, III, aVF correspond to the inferior wall." },
          { text: "Anterior STEMI", isCorrect: false, explanation: "Anterior MI shows changes in V1-V4." },
          { text: "Lateral STEMI", isCorrect: false, explanation: "Lateral MI shows changes in I, aVL, V5-V6." },
        ],
      },
      {
        question: "What is the definitive treatment for STEMI?",
        choices: [
          { text: "Primary PCI", isCorrect: true, explanation: "Primary PCI (percutaneous coronary intervention) is the gold standard if available within 90-120 minutes." },
          { text: "Aspirin alone", isCorrect: false, explanation: "Aspirin is adjunctive but not definitive treatment." },
          { text: "Beta-blockers only", isCorrect: false, explanation: "Beta-blockers are supportive but don't restore blood flow." },
        ],
      },
    ],
  },
  {
    id: "appendicitis",
    title: "Appendicitis",
    icon: "🩺",
    description: "Diagnose and treat acute appendicitis",
    color: "from-green-500 to-emerald-500",
    junctions: [
      {
        question: "A patient has RLQ pain, fever, and anorexia. Which sign involves pain on internal rotation of the hip?",
        choices: [
          { text: "Obturator sign", isCorrect: true, explanation: "Obturator sign is positive when internal rotation causes pain (retrocecal appendix)." },
          { text: "Rovsing sign", isCorrect: false, explanation: "Rovsing sign is RLQ pain when pressing the LLQ." },
          { text: "McBurney's point", isCorrect: false, explanation: "McBurney's point is a location of tenderness, not a maneuver." },
        ],
      },
      {
        question: "What is the most appropriate imaging for suspected appendicitis in an adult?",
        choices: [
          { text: "CT Abdomen/Pelvis", isCorrect: true, explanation: "CT is the gold standard imaging for appendicitis in adults." },
          { text: "Plain abdominal X-ray", isCorrect: false, explanation: "X-ray has poor sensitivity for appendicitis." },
          { text: "MRI first-line", isCorrect: false, explanation: "MRI is preferred in pregnancy but not first-line in general." },
        ],
      },
      {
        question: "Imaging confirms uncomplicated appendicitis. What is the standard treatment?",
        choices: [
          { text: "Appendectomy", isCorrect: true, explanation: "Surgical removal remains the definitive treatment." },
          { text: "Antibiotics only", isCorrect: false, explanation: "Antibiotic-only therapy is sometimes used but surgery is standard." },
          { text: "Observation only", isCorrect: false, explanation: "Observation risks perforation and complications." },
        ],
      },
    ],
  },
  {
    id: "stroke",
    title: "Stroke",
    icon: "🧠",
    description: "Time-critical stroke management",
    color: "from-purple-500 to-pink-500",
    junctions: [
      {
        question: "A patient has sudden left-sided weakness and slurred speech. What is the first priority?",
        choices: [
          { text: "Non-contrast CT Head", isCorrect: true, explanation: "CT is essential to rule out hemorrhage before treatment." },
          { text: "MRI Brain", isCorrect: false, explanation: "MRI is more sensitive but CT is faster and available." },
          { text: "Lumbar puncture", isCorrect: false, explanation: "LP is not indicated for initial stroke workup." },
        ],
      },
      {
        question: "CT shows no hemorrhage. Symptoms started 2 hours ago. What is the next step?",
        choices: [
          { text: "IV tPA (Alteplase)", isCorrect: true, explanation: "tPA is indicated within 4.5 hours of symptom onset for ischemic stroke." },
          { text: "Aspirin only", isCorrect: false, explanation: "Aspirin is given after tPA or if tPA is contraindicated." },
          { text: "Immediate surgery", isCorrect: false, explanation: "Surgery is not first-line for acute ischemic stroke." },
        ],
      },
      {
        question: "What additional intervention may benefit patients with large vessel occlusion?",
        choices: [
          { text: "Mechanical thrombectomy", isCorrect: true, explanation: "Thrombectomy is indicated for large vessel occlusions within 24 hours in selected patients." },
          { text: "Carotid endarterectomy", isCorrect: false, explanation: "CEA is for prevention, not acute treatment." },
          { text: "Decompressive craniectomy", isCorrect: false, explanation: "This is for malignant edema, not standard acute treatment." },
        ],
      },
    ],
  },
];
