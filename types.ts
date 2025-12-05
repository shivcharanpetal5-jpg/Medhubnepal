
export interface Medicine {
  id: string;
  name: string;
  defaultConcentrationMg: number;
  defaultVolumeMl: number;
  perKgMin: number;
  perKgMax: number;
  maxDailyDoseMg: number;
  frequencyHours: number;
  description: string;
  citation: string;
  link: string;
}

export interface DoseResult {
  singleDoseMgMin: number;
  singleDoseMgMax: number;
  volumeMlMin: number;
  volumeMlMax: number;
  maxDailyDose: number;
  safe: boolean;
  warning?: string;
}

export interface BloodAnalysisResult {
  bloodGroup: string;
  confidence: number;
  antibodies: string;
  agglutinationDetails: string;
  recommendation: string;
}

export interface UrineAnalysisResult {
  parameter: string;
  finding: string;
  interpretation: string;
  severity: 'Normal' | 'Trace' | 'Moderate' | 'High' | 'Positive' | 'Negative' | 'Invalid';
  advice: string;
}

export interface SkinAnalysisResult {
  condition: string;
  probability: number;
  description: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Unknown';
  recommendation: string;
}

export interface XrayAnalysisResult {
  bodyPart: string;
  findings: string;
  impression: string;
  abnormalityDetected: boolean;
  advice: string;
}

export type TabType = 'home' | 'calculator' | 'duedate' | 'analyzer' | 'urinetest' | 'skin' | 'xray' | 'compatibility' | 'transport' | 'emergency';
