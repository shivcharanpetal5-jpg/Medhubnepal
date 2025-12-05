import { Medicine } from './types';

export const MEDICINES: Medicine[] = [
  {
    id: 'paracetamol_syrup',
    name: 'Paracetamol (Syrup)',
    defaultConcentrationMg: 120,
    defaultVolumeMl: 5,
    perKgMin: 10,
    perKgMax: 15,
    maxDailyDoseMg: 4000, // Absolute max adult cap, generally lower for kids based on weight
    frequencyHours: 4,
    description: 'Pain reliever and fever reducer.',
    citation: 'NHS / Medscape',
    link: 'https://www.nhs.uk/medicines/paracetamol-for-children/',
  },
  {
    id: 'ibuprofen_syrup',
    name: 'Ibuprofen (Syrup)',
    defaultConcentrationMg: 100,
    defaultVolumeMl: 5,
    perKgMin: 5,
    perKgMax: 10,
    maxDailyDoseMg: 2400, // Adult max
    frequencyHours: 6,
    description: 'Anti-inflammatory for pain and fever.',
    citation: 'NHS / BNF',
    link: 'https://www.nhs.uk/medicines/ibuprofen-for-children/',
  },
];

export const DISCLAIMER_TEXT = "⚠️ Medical Disclaimer: This tool is for educational and informational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always verify dosages with a qualified healthcare professional and check the medicine packaging. In emergencies, contact local emergency services immediately.";

export const COMPATIBILITY_MATRIX = {
  'O-': { donateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], receiveFrom: ['O-'] },
  'O+': { donateTo: ['O+', 'A+', 'B+', 'AB+'], receiveFrom: ['O+', 'O-'] },
  'A-': { donateTo: ['A-', 'A+', 'AB-', 'AB+'], receiveFrom: ['A-', 'O-'] },
  'A+': { donateTo: ['A+', 'AB+'], receiveFrom: ['A+', 'A-', 'O+', 'O-'] },
  'B-': { donateTo: ['B-', 'B+', 'AB-', 'AB+'], receiveFrom: ['B-', 'O-'] },
  'B+': { donateTo: ['B+', 'AB+'], receiveFrom: ['B+', 'B-', 'O+', 'O-'] },
  'AB-': { donateTo: ['AB-', 'AB+'], receiveFrom: ['AB-', 'A-', 'B-', 'O-'] },
  'AB+': { donateTo: ['AB+'], receiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] },
};
