export interface AnalysisResult {
  securityLevel: string;
  score: number;
  analysisPoints: string[];
  improvements: string[];
  securityTips: string[];
  rawText: string;
}

export enum SecurityLevel {
  VERY_WEAK = "Très faible",
  WEAK = "Faible",
  MEDIUM = "Moyen",
  STRONG = "Fort",
  VERY_STRONG = "Très fort"
}