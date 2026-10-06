import {
  AlertTriangle,
  Droplets,
  Lightbulb,
  type LucideIcon,
  Trash2,
} from "lucide-react";

export interface CategoryDefinition {
  id?: string;
  name: string;
  departmentName: string;
  icon: LucideIcon;
  description: string;
  slaHours: number;
  feeAmount: number;
  feeCurrency: string;
  quickPrompts: string[];
}

export const MUNICIPAL_CATEGORIES: CategoryDefinition[] = [
  {
    name: "Waterlogging & Drainage Choke",
    departmentName: "Drainage & Sewerage",
    icon: Droplets,
    description:
      "Severe stormwater accumulation, clogged street drains, canal blockages, or manhole overflows.",
    slaHours: 24,
    feeAmount: 0,
    feeCurrency: "BDT",
    quickPrompts: [
      "Stagnant water blocked roadway",
      "Overflowing storm culvert",
      "Clogged neighborhood drain pipe",
    ],
  },
  {
    name: "Broken Streetlight & Dark Corridors",
    departmentName: "Electrical Engineering",
    icon: Lightbulb,
    description:
      "Non-functional street lamps, flickering illumination, damaged electrical poles, or exposed wires.",
    slaHours: 48,
    feeAmount: 0,
    feeCurrency: "BDT",
    quickPrompts: [
      "Extinguished pole lamp at intersection",
      "Flickering high-mast lighting",
      "Exposed low-hanging street wire",
    ],
  },
  {
    name: "Pothole & Pavement Hazard",
    departmentName: "Roads & Highways",
    icon: AlertTriangle,
    description:
      "Deep craters, fractured asphalt, damaged footpath slabs, or cave-ins threatening road users.",
    slaHours: 72,
    feeAmount: 100,
    feeCurrency: "BDT",
    quickPrompts: [
      "Deep vehicle pothole on main road",
      "Missing storm sewer manhole lid",
      "Collapsed pedestrian sidewalk pavement",
    ],
  },
  {
    name: "Illegal Garbage Dumping",
    departmentName: "Sanitation & Waste Management",
    icon: Trash2,
    description:
      "Unauthorized waste heaps, overflowing public dumpsters, medical waste, or dead animal clearance.",
    slaHours: 24,
    feeAmount: 50,
    feeCurrency: "BDT",
    quickPrompts: [
      "Overflowing neighborhood dumpster bin",
      "Hazardous waste on roadside sidewalk",
      "Debris blocking pedestrian passage",
    ],
  },
];
