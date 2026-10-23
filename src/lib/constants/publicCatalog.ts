import type { RequestPriority, RequestStatus } from "@/types/request.types";

export interface PublicCatalogReview {
  id: string;
  author: string;
  ward: string;
  rating: number;
  date: string;
  ticketRef: string;
  comment: string;
}

export interface PublicCatalogSpecification {
  label: string;
  value: string;
}

export interface PublicCatalogItem {
  id: string;
  code: string;
  type: "MUNICIPAL_SERVICE" | "PUBLIC_DOSSIER";
  title: string;
  shortDescription: string;
  overview: string[];
  categoryId: string;
  categoryName: string;
  departmentName: string;
  ward: string;
  address: string;
  coordinates: string;
  slaHours: number;
  slaLabel: string;
  feeAmount: number;
  feeLabel: string;
  status: RequestStatus;
  priority: RequestPriority;
  rating: number;
  reviewCount: number;
  createdAt: string;
  images: {
    url: string;
    caption: string;
  }[];
  specifications: PublicCatalogSpecification[];
  reviews: PublicCatalogReview[];
}

export const PUBLIC_CATALOG_ITEMS: PublicCatalogItem[] = [
  {
    id: "waste",
    code: "SVC-WASTE-01",
    type: "MUNICIPAL_SERVICE",
    title: "Waste & Sanitation Clearance",
    shortDescription:
      "Illegal dumping, overflowing neighborhood bins, street debris, and missed municipal waste collection.",
    overview: [
      "The Municipal Sanitation & Waste Management division operates rapid-response compactor trucks and secondary transfer station crews across Wards 1 through 24. Every submitted sanitation grievance is geo-tagged and dispatched directly to the nearest ward supervisor.",
      "Standard household overflow and illegal roadside dumping complaints carry an enforced 24-hour Service Level Agreement (SLA). Field technicians must upload before-and-after clearance photographs before requesting citizen closure confirmation.",
      "For commercial renovation rubble or bulk demolition haulage, citizens can request a scheduled dump-truck pickup with a transparent 50–350 BDT municipal tariff via tokenized bKash.",
    ],
    categoryId: "74b45c19-7a5f-4917-9ffc-5d009961eecd",
    categoryName: "Waste & Sanitation",
    departmentName: "Sanitation & Waste Management",
    ward: "Wards 01–24",
    address: "Citywide Secondary Transfer Stations",
    coordinates: "23.7806° N, 90.4070° E",
    slaHours: 24,
    slaLabel: "24h SLA",
    feeAmount: 50,
    feeLabel: "50 BDT Haulage",
    status: "IN_PROGRESS",
    priority: "HIGH",
    rating: 4.8,
    reviewCount: 342,
    createdAt: "2026-10-20",
    images: [
      {
        url: "/images/service-waste.webp",
        caption: "Municipal sanitation crew clearing neighborhood transfer point",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Automated ward dispatch & GPS fleet coordination",
      },
      {
        url: "/images/service-roads.webp",
        caption: "Post-clearance street sweeping and curb verification",
      },
    ],
    specifications: [
      { label: "Responsible Division", value: "Sanitation & Waste Management" },
      { label: "Target SLA Window", value: "24 Hours (Mandatory Escalation)" },
      { label: "Municipal Tariff", value: "50 BDT Standard / 350 BDT Bulk" },
      { label: "Operational Coverage", value: "All 24 Municipal Wards" },
      { label: "Verification Gate", value: "Before & After Photo Proof Required" },
      { label: "Citizen Protection", value: "7-Day Unconditional Reopen Right" },
    ],
    reviews: [
      {
        id: "rev-w1",
        author: "Dr. Nusrat Jahan",
        ward: "Ward 04 • Uttara",
        rating: 5,
        date: "Oct 19, 2026",
        ticketRef: "CF-2026-0819",
        comment:
          "Compactor truck cleared the overflowing roadside bins behind our clinic within 14 hours and uploaded clear verification photos.",
      },
      {
        id: "rev-w2",
        author: "Rafiqul Islam",
        ward: "Ward 19 • Banani",
        rating: 5,
        date: "Oct 15, 2026",
        ticketRef: "CF-2026-0762",
        comment:
          "Booked bulk renovation debris haulage using bKash. Instant PDF invoice and prompt morning pickup.",
      },
    ],
  },
  {
    id: "lighting",
    code: "SVC-LIGHT-02",
    type: "MUNICIPAL_SERVICE",
    title: "Public Streetlighting & Grid Safety",
    shortDescription:
      "Extinguished streetlights, dark public pathways, damaged lamp poles, and exposed electrical hazards.",
    overview: [
      "The Electrical Engineering Division maintains over 48,000 LED street poles, high-mast intersection towers, and pedestrian footbridge luminaires across the metropolitan grid.",
      "Because dark corridors directly impact night-time public safety, streetlighting faults carry our fastest 12-hour urgent SLA response benchmark. Emergency bucket trucks are stationed across North and South zones for overnight dispatch.",
      "All public streetlighting and exposed low-voltage wire hazard reports are 100% free of charge for residents.",
    ],
    categoryId: "0eda1652-e7e4-4eb5-82cf-c558d96b24dd",
    categoryName: "Public Streetlighting",
    departmentName: "Electrical Engineering Division",
    ward: "Citywide Grid",
    address: "Arterial & Residential Corridors",
    coordinates: "23.7925° N, 90.4078° E",
    slaHours: 12,
    slaLabel: "12h SLA",
    feeAmount: 0,
    feeLabel: "Free Intake",
    status: "RESOLVED",
    priority: "URGENT",
    rating: 4.9,
    reviewCount: 518,
    createdAt: "2026-10-21",
    images: [
      {
        url: "/images/service-lighting.webp",
        caption: "High-mast LED luminaire maintenance & photocell calibration",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Smart grid telemetry monitoring across city wards",
      },
      {
        url: "/images/auth-skyline.webp",
        caption: "Night-time municipal corridor illumination network",
      },
    ],
    specifications: [
      { label: "Responsible Division", value: "Electrical Engineering Division" },
      { label: "Target SLA Window", value: "12 Hours (Urgent Safety Priority)" },
      { label: "Municipal Tariff", value: "0 BDT (100% Free Public Intake)" },
      { label: "Operational Coverage", value: "Citywide Grid (Wards 01–24)" },
      { label: "Hardware Standard", value: "Smart Photocell LED Luminaires" },
      { label: "Citizen Protection", value: "Night-Time Photo Proof + 7d Reopen" },
    ],
    reviews: [
      {
        id: "rev-l1",
        author: "Mahmudul Hasan",
        ward: "Ward 10 • Mirpur",
        rating: 5,
        date: "Oct 20, 2026",
        ticketRef: "CF-2026-0854",
        comment:
          "Two dark street poles near our market entrance were fixed within 6.5 hours of filing the report.",
      },
      {
        id: "rev-l2",
        author: "Sabrina Karim",
        ward: "Ward 07 • Gulshan",
        rating: 5,
        date: "Oct 16, 2026",
        ticketRef: "CF-2026-0790",
        comment:
          "Flickering high-mast light at the school crossing was replaced the same evening. Great transparency.",
      },
    ],
  },
  {
    id: "roads",
    code: "SVC-ROADS-03",
    type: "MUNICIPAL_SERVICE",
    title: "Road & Pedestrian Hazard Repair",
    shortDescription:
      "Severe potholes, broken sidewalks, missing manhole covers, and damaged traffic safety barriers.",
    overview: [
      "The Roads & Civil Infrastructure Department handles emergency asphalt patching, fractured concrete footpath restoration, dislodged storm manhole covers, and median barrier repairs.",
      "Each submission is triaged by severity and traffic volume. Deep arterial potholes and missing manhole lids are flagged for immediate safety barricading followed by hot-mix or cold-mix resurfacing within 48 hours.",
      "Contractors and commercial entities can also apply for official utility trenching and road-cut permits with automated inspection scheduling.",
    ],
    categoryId: "7d9c6036-95b9-4e3b-84ba-7f5b3c7aeec0",
    categoryName: "Pothole & Pavement",
    departmentName: "Roads & Civil Infrastructure",
    ward: "Arterial & Ward",
    address: "Primary & Secondary Road Network",
    coordinates: "23.7515° N, 90.3860° E",
    slaHours: 48,
    slaLabel: "48h SLA",
    feeAmount: 100,
    feeLabel: "100 BDT Permit",
    status: "ASSIGNED",
    priority: "HIGH",
    rating: 4.7,
    reviewCount: 289,
    createdAt: "2026-10-19",
    images: [
      {
        url: "/images/service-roads.webp",
        caption: "Heavy asphalt resurfacing and pothole compaction crew",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Ward engineering inspection and laser level verification",
      },
      {
        url: "/images/service-drainage.webp",
        caption: "Reinforced concrete manhole collar and curb restoration",
      },
    ],
    specifications: [
      { label: "Responsible Division", value: "Roads & Civil Infrastructure" },
      { label: "Target SLA Window", value: "48 Hours (Cold/Hot-Mix Dispatch)" },
      { label: "Municipal Tariff", value: "100 BDT Inspection / 500 BDT Road Cut" },
      { label: "Operational Coverage", value: "Arterial Highways & Ward Lanes" },
      { label: "Material Specification", value: "Bituminous Dense Asphalt / RCC" },
      { label: "Citizen Protection", value: "7-Day Surface Integrity Guarantee" },
    ],
    reviews: [
      {
        id: "rev-r1",
        author: "Tanvir Ahmed",
        ward: "Ward 19 • Banani",
        rating: 5,
        date: "Oct 18, 2026",
        ticketRef: "CF-2026-0798",
        comment:
          "Road-cut permit and inspection were processed smoothly with a downloadable bKash tax receipt.",
      },
      {
        id: "rev-r2",
        author: "Kamrul Islam",
        ward: "Ward 12 • Tejgaon",
        rating: 4,
        date: "Oct 12, 2026",
        ticketRef: "CF-2026-0741",
        comment:
          "Deep crater near the rail crossing was patched and leveled within 36 hours.",
      },
    ],
  },
  {
    id: "drainage",
    code: "SVC-DRAIN-04",
    type: "MUNICIPAL_SERVICE",
    title: "Water & Drainage Network Operations",
    shortDescription:
      "Severe rainwater stagnation, clogged storm culverts, sewer overflows, and contaminated supply pipes.",
    overview: [
      "The Drainage & Sewerage Department operates high-capacity suction tankers, jetting machines, and emergency dewatering pumps across flood-prone municipal zones.",
      "During monsoon and heavy rainfall events, waterlogging and culvert blockages receive automated 24-hour SLA priority routing to prevent basement flooding and road closures.",
      "All public drainage chokes and stormwater stagnation reports are 100% free for citizens and include full photographic sediment-clearance verification.",
    ],
    categoryId: "935e2322-66bb-48ae-a7dd-d586d49f2f0a",
    categoryName: "Waterlogging & Drainage",
    departmentName: "Drainage & Sewerage Dept",
    ward: "Flood Zones 1–12",
    address: "Stormwater Culverts & Canal Conduits",
    coordinates: "23.7465° N, 90.3762° E",
    slaHours: 24,
    slaLabel: "24h SLA",
    feeAmount: 0,
    feeLabel: "Free Intake",
    status: "RESOLVED",
    priority: "HIGH",
    rating: 4.9,
    reviewCount: 412,
    createdAt: "2026-10-22",
    images: [
      {
        url: "/images/service-drainage.webp",
        caption: "High-capacity suction & storm culvert desilting operation",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Real-time flood sensor and pump station telemetry",
      },
      {
        url: "/images/service-roads.webp",
        caption: "Storm grate replacement and road drainage channel clearance",
      },
    ],
    specifications: [
      { label: "Responsible Division", value: "Drainage & Sewerage Department" },
      { label: "Target SLA Window", value: "24 Hours (Emergency Pump Dispatch)" },
      { label: "Municipal Tariff", value: "0 BDT (100% Free Public Intake)" },
      { label: "Operational Coverage", value: "Flood Zones 1–12 & All Wards" },
      { label: "Equipment Fleet", value: "Vacuum Jetters & Dewatering Pumps" },
      { label: "Citizen Protection", value: "7-Day Flow Verification Guarantee" },
    ],
    reviews: [
      {
        id: "rev-d1",
        author: "Farhana Rahman",
        ward: "Ward 15 • Dhanmondi",
        rating: 5,
        date: "Oct 22, 2026",
        ticketRef: "CF-2026-0892",
        comment:
          "Suction crew arrived the next morning, cleared 150kg of plastic blockage, and water drained within an hour.",
      },
      {
        id: "rev-d2",
        author: "Ashraful Alam",
        ward: "Ward 08 • Mohammadpur",
        rating: 5,
        date: "Oct 14, 2026",
        ticketRef: "CF-2026-0755",
        comment:
          "Fastest municipal response I have ever experienced. The photo proof before closing is a great feature.",
      },
    ],
  },
  {
    id: "demo-1",
    code: "CF-2026-0941",
    type: "PUBLIC_DOSSIER",
    title: "Severe rainwater drainage choke causing road flooding",
    shortDescription:
      "Water accumulated over 18 inches after evening rainfall near City Hospital corner, obstructing pedestrian crossing.",
    overview: [
      "Submitted by a verified resident in Dhanmondi Ward 15 following heavy evening precipitation. Standing water exceeded 18 inches along Road 5, Block B, threatening ground-floor pharmacies and blocking hospital ambulances.",
      "Automated routing rules immediately assigned the dossier to the Drainage & Sewerage Department under a 24-hour High-Priority SLA clock.",
      "Field Officer Engr. Tariqul Islam deployed a heavy vacuum jetting unit, extracted 150kg of compacted plastic and construction sediment from the primary box culvert, and restored normal stormwater runoff within 15 hours.",
    ],
    categoryId: "935e2322-66bb-48ae-a7dd-d586d49f2f0a",
    categoryName: "Waterlogging & Drainage",
    departmentName: "Drainage & Sewerage Dept",
    ward: "Ward 15",
    address: "Road 5, Block B, Dhanmondi, Dhaka",
    coordinates: "23.7465° N, 90.3762° E",
    slaHours: 24,
    slaLabel: "24h SLA • Met",
    feeAmount: 0,
    feeLabel: "Free Intake",
    status: "RESOLVED",
    priority: "HIGH",
    rating: 5.0,
    reviewCount: 14,
    createdAt: "Oct 22, 2026",
    images: [
      {
        url: "/images/service-drainage.webp",
        caption: "Culvert suction & dewatering unit deployed at Road 5, Dhanmondi",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Field crew telemetry verification post-clearance",
      },
      {
        url: "/images/service-roads.webp",
        caption: "Cleared roadway and disinfected storm drain grate",
      },
    ],
    specifications: [
      { label: "Tracking Dossier ID", value: "CF-2026-0941" },
      { label: "Assigned Department", value: "Drainage & Sewerage Department" },
      { label: "Lead Field Officer", value: "Engr. Tariqul Islam" },
      { label: "Ward & Landmark", value: "Ward 15 • Beside City Hospital Corner" },
      { label: "SLA Performance", value: "Resolved in 15h (Target: 24h)" },
      { label: "Current Lifecycle Stage", value: "RESOLVED (Awaiting Citizen Closure)" },
    ],
    reviews: [
      {
        id: "rev-cf1",
        author: "Sarah Khan (Reporting Citizen)",
        ward: "Ward 15 • Dhanmondi",
        rating: 5,
        date: "Oct 22, 2026",
        ticketRef: "CF-2026-0941",
        comment:
          "Drainage crew mobilized high-capacity suction pumps and cleared the culvert completely. Verified on site!",
      },
    ],
  },
  {
    id: "demo-2",
    code: "CF-2026-0938",
    type: "PUBLIC_DOSSIER",
    title: "Extinguished high-mast streetlight at school intersection",
    shortDescription:
      "Three consecutive LED fixtures on the primary school avenue have remained dark for two nights, creating safety hazards.",
    overview: [
      "Reported at Avenue 3, Sector 7, Uttara where three consecutive street poles lost power following a feeder surge, leaving a busy school and pedestrian crossing in complete darkness.",
      "Triaged automatically under the 12-hour Urgent Streetlighting SLA and dispatched to the Electrical Engineering Division.",
      "A mobile hydraulic bucket crew is currently on site replacing the damaged ballast relay and testing the photocell array.",
    ],
    categoryId: "0eda1652-e7e4-4eb5-82cf-c558d96b24dd",
    categoryName: "Public Streetlighting",
    departmentName: "Electrical Engineering",
    ward: "Ward 04",
    address: "Avenue 3, Sector 7, Uttara",
    coordinates: "23.8728° N, 90.3984° E",
    slaHours: 12,
    slaLabel: "12h SLA • Active",
    feeAmount: 0,
    feeLabel: "Free Intake",
    status: "IN_PROGRESS",
    priority: "URGENT",
    rating: 4.9,
    reviewCount: 9,
    createdAt: "Oct 23, 2026",
    images: [
      {
        url: "/images/service-lighting.webp",
        caption: "Electrical bucket crew inspecting Avenue 3 luminaire relay",
      },
      {
        url: "/images/auth-skyline.webp",
        caption: "Sector 7 corridor illumination grid",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Live ward dispatch telemetry feed",
      },
    ],
    specifications: [
      { label: "Tracking Dossier ID", value: "CF-2026-0938" },
      { label: "Assigned Department", value: "Electrical Engineering Division" },
      { label: "Ward & Sector", value: "Ward 04 • Sector 7 School Crossing" },
      { label: "Priority Classification", value: "URGENT (Public Safety Corridor)" },
      { label: "SLA Window", value: "12 Hours (6h Remaining)" },
      { label: "Current Lifecycle Stage", value: "IN_PROGRESS (Crew On Site)" },
    ],
    reviews: [
      {
        id: "rev-cf2",
        author: "Uttara Sector 7 Welfare Assoc.",
        ward: "Ward 04 • Uttara",
        rating: 5,
        date: "Oct 23, 2026",
        ticketRef: "CF-2026-0938",
        comment:
          "Bucket truck arrived within 4 hours of filing the ticket. Appreciate the fast response.",
      },
    ],
  },
  {
    id: "demo-3",
    code: "CF-2026-0929",
    type: "PUBLIC_DOSSIER",
    title: "Deep arterial pothole and fractured concrete curb",
    shortDescription:
      "Heavy commuter bus traffic exposed a 2-foot crater near the metro station entry ramp requiring immediate cold-mix patching.",
    overview: [
      "Located on Begum Rokeya Sarani near the Mirpur 10 metro station access ramp. Repeated heavy axle loads fractured the surface asphalt, creating a severe hazard for rickshaws and two-wheelers.",
      "Assigned to the Roads & Civil Infrastructure Department under a 48-hour SLA window. Safety cones and reflective barriers have been placed around the crater, and the night resurfacing roller unit is scheduled for 11:30 PM.",
    ],
    categoryId: "7d9c6036-95b9-4e3b-84ba-7f5b3c7aeec0",
    categoryName: "Pothole & Pavement",
    departmentName: "Roads & Civil Infrastructure",
    ward: "Ward 10",
    address: "Begum Rokeya Sarani, Mirpur",
    coordinates: "23.8069° N, 90.3687° E",
    slaHours: 48,
    slaLabel: "48h SLA • Active",
    feeAmount: 100,
    feeLabel: "100 BDT Permit",
    status: "ASSIGNED",
    priority: "HIGH",
    rating: 4.7,
    reviewCount: 11,
    createdAt: "Oct 21, 2026",
    images: [
      {
        url: "/images/service-roads.webp",
        caption: "Arterial pothole site marked for hot-mix asphalt patching",
      },
      {
        url: "/images/hero-civic.webp",
        caption: "Civil engineering crew dispatch schedule",
      },
    ],
    specifications: [
      { label: "Tracking Dossier ID", value: "CF-2026-0929" },
      { label: "Assigned Department", value: "Roads & Civil Infrastructure" },
      { label: "Ward & Corridor", value: "Ward 10 • Begum Rokeya Sarani" },
      { label: "Priority Classification", value: "HIGH (Arterial Commuter Route)" },
      { label: "SLA Window", value: "48 Hours (22h Remaining)" },
      { label: "Current Lifecycle Stage", value: "ASSIGNED (Night Resurfacing)" },
    ],
    reviews: [
      {
        id: "rev-cf3",
        author: "Tariqul Amin",
        ward: "Ward 10 • Mirpur",
        rating: 5,
        date: "Oct 22, 2026",
        ticketRef: "CF-2026-0929",
        comment:
          "Safety barricades were placed the same afternoon so bikes don't hit the crater at night.",
      },
    ],
  },
  {
    id: "demo-4",
    code: "CF-2026-0915",
    type: "PUBLIC_DOSSIER",
    title: "Unauthorized construction rubble blocking footpath",
    shortDescription:
      "Discarded brick aggregates and commercial renovation bags left beside the secondary transfer station spilling onto the road.",
    overview: [
      "Reported along Kemal Ataturk Avenue, Banani Ward 19, where approximately 3 tons of broken brick aggregate and cement bags obstructed pedestrian movement.",
      "Cleared by the Solid Waste Management heavy loader team within 18 hours. The reporting citizen inspected the swept sidewalk and confirmed ticket closure with a 5-star rating.",
    ],
    categoryId: "74b45c19-7a5f-4917-9ffc-5d009961eecd",
    categoryName: "Waste & Sanitation",
    departmentName: "Solid Waste Management",
    ward: "Ward 19",
    address: "Kemal Ataturk Ave, Banani",
    coordinates: "23.7940° N, 90.4043° E",
    slaHours: 24,
    slaLabel: "24h SLA • Verified",
    feeAmount: 50,
    feeLabel: "50 BDT Haulage",
    status: "CLOSED",
    priority: "NORMAL",
    rating: 4.9,
    reviewCount: 19,
    createdAt: "Oct 20, 2026",
    images: [
      {
        url: "/images/service-waste.webp",
        caption: "Cleared sidewalk along Kemal Ataturk Avenue after haulage",
      },
      {
        url: "/images/service-roads.webp",
        caption: "Pedestrian footpath restored to unobstructed use",
      },
    ],
    specifications: [
      { label: "Tracking Dossier ID", value: "CF-2026-0915" },
      { label: "Assigned Department", value: "Solid Waste Management" },
      { label: "Ward & Corridor", value: "Ward 19 • Kemal Ataturk Ave" },
      { label: "SLA Performance", value: "Cleared in 18h (Target: 24h)" },
      { label: "Citizen Verification", value: "Confirmed & Closed by Resident" },
      { label: "Current Lifecycle Stage", value: "CLOSED (Verified 5/5 Stars)" },
    ],
    reviews: [
      {
        id: "rev-cf4",
        author: "Zarin Tasnim",
        ward: "Ward 19 • Banani",
        rating: 5,
        date: "Oct 21, 2026",
        ticketRef: "CF-2026-0915",
        comment:
          "Entire footpath was cleared and washed down before morning office hours. Confirmed and closed!",
      },
    ],
  },
];

export function findCatalogItemByIdOrCode(
  idOrCode: string,
): PublicCatalogItem | undefined {
  const normalized = decodeURIComponent(idOrCode).trim().toLowerCase();
  return PUBLIC_CATALOG_ITEMS.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.code.toLowerCase() === normalized,
  );
}
