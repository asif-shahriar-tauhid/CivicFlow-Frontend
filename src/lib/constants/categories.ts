import {
  AlertTriangle,
  Building2,
  Droplets,
  HardHat,
  Lightbulb,
  type LucideIcon,
  Trash2,
} from "lucide-react";

export interface CategoryDefinition {
  id: string;
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
    id: "7d9c6036-95b9-4e3b-84ba-7f5b3c7aeec0",
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
    id: "74b45c19-7a5f-4917-9ffc-5d009961eecd",
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
  {
    id: "81e406aa-aa97-49e5-b56e-1bafb74eea24",
    name: "Commercial Construction & Excavation Permit",
    departmentName: "Civil Engineering & Works",
    icon: HardHat,
    description:
      "Municipal inspection and site utility permit for commercial ground excavation and pipe laying.",
    slaHours: 48,
    feeAmount: 500,
    feeCurrency: "BDT",
    quickPrompts: [
      "Commercial road cut permit request",
      "Utility trench excavation inspection",
      "Heavy foundation drilling clearance",
    ],
  },
  {
    id: "77d8c539-1de9-4a74-9f6b-7c7b623a91a7",
    name: "Bulk Demolition & Industrial Waste Haulage",
    departmentName: "Sanitation & Heavy Transport",
    icon: Building2,
    description:
      "Specialized transport and dump site disposal fee for heavy rubble and concrete demolition debris.",
    slaHours: 24,
    feeAmount: 350,
    feeCurrency: "BDT",
    quickPrompts: [
      "Concrete rubble and brick debris transport",
      "Commercial building renovation waste removal",
      "Demolition material haulage dispatch",
    ],
  },
  {
    id: "935e2322-66bb-48ae-a7dd-d586d49f2f0a",
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
    id: "0eda1652-e7e4-4eb5-82cf-c558d96b24dd",
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
];
