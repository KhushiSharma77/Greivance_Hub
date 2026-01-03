export type GrievanceStatus =
  | "PENDING"
  | "ANALYZED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type PriorityLevel =
  | "Low"
  | "Medium"
  | "High";

export type GrievanceDTO = {
  id: string;
  userId: string;
  originalText: string;
  translatedText: string | null;
  category: string | null;
  priority: PriorityLevel | null;
  status: GrievanceStatus;
  departmentId: string | null;
  assignedOfficerId: string | null;
  duplicateOfId: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateGrievanceInput = {
  departmentName: string;
  grievance: {
    userId: string;
    originalText: string;
    translatedText?: string;
    category?: string;
    priority?: PriorityLevel;
    latitude?: number;
    longitude?: number;
  };
};
