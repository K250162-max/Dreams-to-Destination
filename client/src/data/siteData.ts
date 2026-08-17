export type Service = {
  id: string;
  title: string;
  short: string;
  icon: string;
  bestFor: string;
  description: string;
  highlights: string[];
  steps: string[];
};

export type Destination = {
  id: string;
  name: string;
  region: "Americas" | "Europe" | "Oceania" | "Middle East" | "Asia";
  routes: string[];
  flag: string;
  accent: string;
  planningWindow: string;
  requirements: string[];
  officialUrl: string;
};

export type SuccessStory = {
  name: string;
  quote: string;
  outcome: string;
  photoUrl: string;
};

export type AdvisoryTeamMember = {
  code: string;
  title: string;
  description: string;
  skills: string[];
  image: string;
};

export type ContactDetails = {
  phone: string;
  email: string;
  locations: string[];
  instagram: string;
  facebook: string;
  whatsapp: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

/* =========================================================
   SERVICES
========================================================= */

export const services: Service[] = [
  {
    id: "study",
    title: "Study Abroad",
    short: "University admissions and study visa guidance.",
    icon: "GraduationCap",
    bestFor: "Students planning an international education journey.",
    description:
      "End-to-end guidance for choosing destinations, preparing applications and planning your study visa route.",
    highlights: [
      "University and course planning",
      "Application preparation",
      "Document guidance",
      "Study visa preparation",
    ],
    steps: [
      "Understand your academic profile",
      "Shortlist suitable destinations",
      "Prepare your application",
      "Prepare for the visa process",
    ],
  },

  {
    id: "visit",
    title: "Visit Visas",
    short: "Travel and family visit planning.",
    icon: "Plane",
    bestFor: "Travellers planning short international visits.",
    description:
      "Practical support for preparing a clear and well-organised visitor visa application.",
    highlights: [
      "Travel planning",
      "Document preparation",
      "Application guidance",
      "Interview preparation",
    ],
    steps: [
      "Understand your travel purpose",
      "Review your supporting documents",
      "Prepare the application",
      "Submit and track the application",
    ],
  },

  {
    id: "work",
    title: "Work Visas",
    short: "Professional routes and employer-sponsored pathways.",
    icon: "BriefcaseBusiness",
    bestFor:
      "Professionals exploring international employment opportunities.",
    description:
      "Guidance around work visa pathways, documentation and application preparation.",
    highlights: [
      "Work route assessment",
      "Document planning",
      "Employer documentation guidance",
      "Application preparation",
    ],
    steps: [
      "Review your professional profile",
      "Identify suitable pathways",
      "Prepare supporting evidence",
      "Complete the application",
    ],
  },

  {
    id: "business",
    title: "Business Immigration",
    short: "Business and investment-related routes.",
    icon: "Building2",
    bestFor: "Entrepreneurs and business professionals.",
    description:
      "Strategic guidance for exploring business-related international mobility options.",
    highlights: [
      "Business route assessment",
      "Eligibility review",
      "Documentation planning",
      "Application guidance",
    ],
    steps: [
      "Review your business profile",
      "Identify potential routes",
      "Prepare supporting documents",
      "Proceed with the relevant application",
    ],
  },

  {
    id: "family",
    title: "Family Routes",
    short: "Guidance for family-related immigration pathways.",
    icon: "HeartHandshake",
    bestFor: "Families exploring international relocation options.",
    description:
      "Guidance for understanding family-related immigration routes and documentation.",
    highlights: [
      "Route assessment",
      "Relationship documentation",
      "Financial evidence planning",
      "Application guidance",
    ],
    steps: [
      "Understand the family relationship",
      "Review eligibility",
      "Prepare evidence",
      "Submit the application",
    ],
  },

  {
    id: "settlement",
    title: "Permanent Residency",
    short: "Long-term settlement and residency planning.",
    icon: "Landmark",
    bestFor: "Applicants exploring long-term residency options.",
    description:
      "Explore potential permanent residency pathways based on your profile and destination.",
    highlights: [
      "Profile assessment",
      "Residency pathway review",
      "Eligibility planning",
      "Documentation guidance",
    ],
    steps: [
      "Review your current profile",
      "Identify possible residency routes",
      "Assess requirements",
      "Plan the next application step",
    ],
  },

  {
    id: "documentation",
    title: "Document Services",
    short: "Application and supporting-document preparation.",
    icon: "FileCheck2",
    bestFor: "Applicants who need help organising their documentation.",
    description:
      "Support with organising and preparing the documentation needed for an immigration application.",
    highlights: [
      "Document checklist",
      "Application review",
      "Supporting evidence",
      "Submission preparation",
    ],
    steps: [
      "Review required documents",
      "Identify missing evidence",
      "Organise your file",
      "Complete the application package",
    ],
  },

  {
    id: "advisory",
    title: "Immigration Advisory",
    short: "Personalised guidance for complex cases.",
    icon: "BookOpenCheck",
    bestFor: "Applicants who need a tailored immigration strategy.",
    description:
      "A consultation-focused service for understanding your options and planning your next steps.",
    highlights: [
      "Profile review",
      "Route comparison",
      "Risk and requirement discussion",
      "Personalised action plan",
    ],
    steps: [
      "Discuss your objectives",
      "Review your profile",
      "Compare potential routes",
      "Create a practical action plan",
    ],
  },
];

/* =========================================================
   DESTINATIONS
========================================================= */

export const destinations: Destination[] = [
  {
    id: "canada",
    name: "Canada",
    region: "Americas",
    routes: ["Study", "Work", "PR", "Family", "Visit"],
    flag: "🇨🇦",
    accent: "#e63946",
    planningWindow: "8–16 weeks",
    requirements: [
      "Valid passport",
      "Financial evidence",
      "Purpose-specific documents",
    ],
    officialUrl:
      "https://www.canada.ca/en/services/immigration-citizenship.html",
  },

  {
    id: "uk",
    name: "United Kingdom",
    region: "Europe",
    routes: ["Study", "Work", "Visit", "Family"],
    flag: "🇬🇧",
    accent: "#2563eb",
    planningWindow: "6–12 weeks",
    requirements: [
      "Valid passport",
      "Financial evidence",
      "Route-specific supporting documents",
    ],
    officialUrl: "https://www.gov.uk/browse/visas-immigration",
  },

  {
    id: "australia",
    name: "Australia",
    region: "Oceania",
    routes: ["Study", "Work", "Visit", "PR"],
    flag: "🇦🇺",
    accent: "#f59e0b",
    planningWindow: "8–20 weeks",
    requirements: [
      "Valid passport",
      "Financial evidence",
      "Relevant visa documentation",
    ],
    officialUrl: "https://immi.homeaffairs.gov.au/",
  },

  {
    id: "usa",
    name: "United States",
    region: "Americas",
    routes: ["Study", "Work", "Visit", "Family", "Business"],
    flag: "🇺🇸",
    accent: "#1d4ed8",
    planningWindow: "6–20 weeks",
    requirements: [
      "Valid passport",
      "Purpose-specific evidence",
      "Financial documentation where required",
    ],
    officialUrl: "https://travel.state.gov/content/travel/en/us-visas.html",
  },

  {
    id: "uae",
    name: "United Arab Emirates",
    region: "Middle East",
    routes: ["Work", "Visit", "Business", "Family"],
    flag: "🇦🇪",
    accent: "#16a34a",
    planningWindow: "2–8 weeks",
    requirements: [
      "Valid passport",
      "Sponsor or route documentation",
      "Supporting evidence",
    ],
    officialUrl:
      "https://u.ae/en/information-and-services/visa-and-emirates-id",
  },

  {
    id: "germany",
    name: "Germany",
    region: "Europe",
    routes: ["Study", "Work", "Visit", "PR"],
    flag: "🇩🇪",
    accent: "#f97316",
    planningWindow: "8–20 weeks",
    requirements: [
      "Valid passport",
      "Financial evidence",
      "Route-specific documentation",
    ],
    officialUrl: "https://www.make-it-in-germany.com/en/",
  },

  {
    id: "new-zealand",
    name: "New Zealand",
    region: "Oceania",
    routes: ["Study", "Work", "Visit", "PR"],
    flag: "🇳🇿",
    accent: "#0f766e",
    planningWindow: "6–16 weeks",
    requirements: [
      "Valid passport",
      "Financial evidence",
      "Visa-specific documents",
    ],
    officialUrl: "https://www.immigration.govt.nz/",
  },

  {
    id: "japan",
    name: "Japan",
    region: "Asia",
    routes: ["Study", "Work", "Visit", "Business"],
    flag: "🇯🇵",
    accent: "#dc2626",
    planningWindow: "4–12 weeks",
    requirements: [
      "Valid passport",
      "Purpose-specific documents",
      "Financial evidence where applicable",
    ],
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/",
  },
];

/* =========================================================
   TRUST / SUCCESS STORIES
========================================================= */

export const verifiedSuccessStories: SuccessStory[] = [];

export const trustStats = [
  {
    value: "8+",
    label: "Destination markets",
  },
  {
    value: "8",
    label: "Advisory services",
  },
  {
    value: "1:1",
    label: "Personal guidance",
  },
  {
    value: "100%",
    label: "Transparent process",
  },
];

/* =========================================================
   ADVISORY TEAM
========================================================= */

export const advisoryTeam: AdvisoryTeamMember[] = [
  {
    code: "VIC",
    title: "Visa & Immigration Consultant",
    description:
      "Experienced guidance for study, visit, work and immigration applications.",
    skills: [
      "Visa strategy",
      "Application guidance",
      "Profile assessment",
    ],
    image: "",
  },

  {
    code: "ADA",
    title: "Admissions Advisor",
    description:
      "Helping students plan their international education journey.",
    skills: [
      "University planning",
      "Course selection",
      "Study applications",
    ],
    image: "",
  },

  {
    code: "DAS",
    title: "Documentation Specialist",
    description:
      "Focused on clear, organised and application-ready documentation.",
    skills: [
      "Document review",
      "Application preparation",
      "Evidence planning",
    ],
    image: "",
  },
];

/* =========================================================
   PROCESS STEPS
========================================================= */

export const processSteps: [string, string, string][] = [
  [
    "01",
    "Understand your profile",
    "We begin by understanding your goals, background and preferred destination.",
  ],

  [
    "02",
    "Explore your options",
    "We review suitable visa, study, work or immigration pathways.",
  ],

  [
    "03",
    "Prepare your application",
    "We help organise the required documents and application information.",
  ],

  [
    "04",
    "Move forward with clarity",
    "You receive practical guidance on the next steps for your chosen route.",
  ],
];

/* =========================================================
   FAQS
========================================================= */

export const faqs: FAQ[] = [
  {
    question: "Do you guarantee visa approval?",
    answer:
      "No. Visa decisions are made by the relevant government authority. We provide guidance to help you prepare a clear and well-organised application.",
  },

  {
    question: "Which destinations do you cover?",
    answer:
      "We currently provide guidance for Canada, the United Kingdom, Australia, the United States, the UAE, Germany, New Zealand and Japan.",
  },

  {
    question: "Can you help me choose the right visa route?",
    answer:
      "Yes. During a consultation, we can review your goals and profile and discuss potential routes and their requirements.",
  },

  {
    question: "Do you provide study visa assistance?",
    answer:
      "Yes. Our study-abroad service covers destination planning, university and course planning, application preparation and study visa guidance.",
  },

  {
    question: "Can you review my documents?",
    answer:
      "Yes. Our documentation service is designed to help organise and review the supporting documents required for an application.",
  },

  {
    question: "How do I start?",
    answer:
      "The easiest way is to request a consultation. Share your basic details and objectives, and the team can discuss the appropriate next steps.",
  },
];

/* =========================================================
   CONTACT DETAILS
========================================================= */

export const contactDetails: ContactDetails = {
  phone: "+92 332 3392590 | +971 56 413 0272 | +92 336 5188711",

  email: "hello@dreamstodestination.com",

  locations: [
    "Islamabad: Twinhub, Interlace Plaza, I-8",
    "Rawalpindi: Peshawar Road",
    "Dubai: Silicon Oasis",
  ],

  instagram: "https://www.instagram.com/",

  facebook: "https://www.facebook.com/",

  whatsapp: "https://wa.me/923323392590",
};