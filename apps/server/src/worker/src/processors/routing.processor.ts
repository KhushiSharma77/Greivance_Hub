type RoutingResult = {
  departmentName: string;
  routingReason: string;
  fallbackUsed: boolean;
};


const CATEGORY_DEPARTMENT_MAP: Record<string, string> = {
  "Roads & Infrastructure": "Public Works Department",
  "Water Supply": "Water Supply Department",
  "Electricity": "Electricity Board",
  "Sanitation": "Municipal Sanitation Department",
  "Public Safety": "Police Department",
  "Healthcare": "Health Department",
  "Education": "Education Department",
  "Transport": "Transport Department",
  "Municipal Services": "Municipal Corporation",
  "Administrative Delay": "Administrative Grievance Cell",
};


export function routeGrievanceToDepartment(
  category: string,
  city: string
): RoutingResult {

  const departmentName = CATEGORY_DEPARTMENT_MAP[category];

  // Fallback if category not mapped
  if (!departmentName) {
    return {
      departmentName: "General Grievance Cell",
      routingReason: `No direct mapping found for category "${category}"`,
      fallbackUsed: true,
    };
  }

  // City is currently informational (future: city-based overrides)
  return {
    departmentName,
    routingReason: `Category "${category}" is handled by ${departmentName}`,
    fallbackUsed: false,
  };
}
