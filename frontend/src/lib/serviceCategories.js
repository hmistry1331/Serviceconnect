
export const SERVICE_CATEGORIES = [
  { value: "PLUMBING",   label: "Plumbing"   },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "HVAC",       label: "HVAC"       },
  { value: "CARPENTRY",  label: "Carpentry"  },
  { value: "PAINTING",   label: "Painting"   },
  { value: "CLEANING",   label: "Cleaning"   },
  { value: "ROOFING",    label: "Roofing"    },
];

export function getCategoryByValue(value) {
  return SERVICE_CATEGORIES.find((c) => c.value === value) || null;
}