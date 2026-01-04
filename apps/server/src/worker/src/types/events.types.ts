import type { PriorityLevel, SentimentType } from "@team-call-of-code/db";


export type GrievanceProcessedEvent = {
  grievanceId: string;
  analysis: {
    category: string;
    priority:  PriorityLevel | null;
    summary: string;
    urgency: number;
    severity: number;
    sentiment: SentimentType;
    confidence: number
  };
};

export type DuplicateCheckedEvent = {
  grievanceId: string;
  isDuplicate: boolean;
  matchedGrievanceId?: string;
  similarityScore: number;
};

export type GrievanceRoutedEvent = {
  grievanceId: string;
  departmentName: string;
  city:string;
};

export type MultilingualProcessedEvent = {
  grievanceId: string;
  originalLanguage: string;
  normalizedText: string;
};

export type MultilingualFailedEvent = {
  grievanceId: string;
  error: Error;
};
