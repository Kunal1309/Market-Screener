import type { Firm, FirmProfile } from "@/types";

export const MOCK_FIRMS: Firm[] = [
  { id:"1",  name:"Bright Future Solutions",   location:"Riverside, CA",    totalAUM:2.48, advisors:42, hnwAUMPercent:42, acquisitionScore:71,  decisionMaker:"Alex Johnson",       custodian:["Schwab"],                  officeCount:3, aumPerAdvisor:0.059, clients:320,  employees:65,  secRegistrationDate:"2005-03-15", aumCAGR:8.2,  pastAcquisitions:2, ownerTenure:18, ownerAge:52, familyOwned:false, adv:true  },
  { id:"2",  name:"Nexus Technologies",        location:"Cedar Falls, IA",  totalAUM:2.60, advisors:50, hnwAUMPercent:50, acquisitionScore:95,  decisionMaker:"Michael Brown",      custodian:["Fidelity","Schwab"],       officeCount:4, aumPerAdvisor:0.052, clients:410,  employees:78,  secRegistrationDate:"2002-07-22", aumCAGR:12.5, pastAcquisitions:3, ownerTenure:22, ownerAge:58, familyOwned:true,  adv:true  },
  { id:"3",  name:"Pinnacle Consulting Group", location:"Fairfield, OH",    totalAUM:2.90, advisors:60, hnwAUMPercent:60, acquisitionScore:32,  decisionMaker:"Daniel Anderson",    custodian:["Pershing"],                officeCount:5, aumPerAdvisor:0.048, clients:520,  employees:95,  secRegistrationDate:"1998-11-30", aumCAGR:3.1,  pastAcquisitions:1, ownerTenure:25, ownerAge:62, familyOwned:false, adv:true  },
  { id:"4",  name:"Quantum Dynamics",          location:"Salem, OR",        totalAUM:3.10, advisors:70, hnwAUMPercent:70, acquisitionScore:98,  decisionMaker:"James Jackson",      custodian:["Schwab","TD Ameritrade"],  officeCount:6, aumPerAdvisor:0.044, clients:630,  employees:112, secRegistrationDate:"2000-05-18", aumCAGR:15.8, pastAcquisitions:5, ownerTenure:20, ownerAge:55, familyOwned:false, adv:true  },
  { id:"5",  name:"Synergy Enterprises",       location:"Harrisonburg, VA", totalAUM:3.00, advisors:65, hnwAUMPercent:65, acquisitionScore:41,  decisionMaker:"Laura Thomas",       custodian:["Fidelity"],                officeCount:4, aumPerAdvisor:0.046, clients:580,  employees:100, secRegistrationDate:"2003-09-12", aumCAGR:5.4,  pastAcquisitions:0, ownerTenure:16, ownerAge:49, familyOwned:true,  adv:false },
  { id:"6",  name:"Vertex Strategies",         location:"Springfield, IL",  totalAUM:2.55, advisors:30, hnwAUMPercent:30, acquisitionScore:92,  decisionMaker:"David Wilson",       custodian:["Schwab"],                  officeCount:2, aumPerAdvisor:0.085, clients:245,  employees:42,  secRegistrationDate:"2008-02-28", aumCAGR:14.2, pastAcquisitions:4, ownerTenure:15, ownerAge:46, familyOwned:false, adv:true  },
  { id:"7",  name:"Elysium Ventures",          location:"Dover, DE",        totalAUM:3.20, advisors:75, hnwAUMPercent:75, acquisitionScore:22,  decisionMaker:"Megan White",        custodian:["Pershing","Schwab"],       officeCount:7, aumPerAdvisor:0.043, clients:720,  employees:125, secRegistrationDate:"1995-06-15", aumCAGR:2.8,  pastAcquisitions:0, ownerTenure:28, ownerAge:65, familyOwned:false, adv:true  },
  { id:"8",  name:"Horizon Analytics",         location:"Burlington, VT",   totalAUM:2.80, advisors:35, hnwAUMPercent:35, acquisitionScore:99,  decisionMaker:"Sarah Davis",        custodian:["Fidelity"],                officeCount:3, aumPerAdvisor:0.080, clients:280,  employees:52,  secRegistrationDate:"2010-04-05", aumCAGR:18.6, pastAcquisitions:6, ownerTenure:13, ownerAge:44, familyOwned:false, adv:true  },
  { id:"9",  name:"Catalyst Innovations",      location:"Lakewood, CO",     totalAUM:2.65, advisors:55, hnwAUMPercent:55, acquisitionScore:97,  decisionMaker:"Jessica Taylor",     custodian:["Schwab","Fidelity"],       officeCount:4, aumPerAdvisor:0.048, clients:490,  employees:85,  secRegistrationDate:"2006-08-20", aumCAGR:13.9, pastAcquisitions:3, ownerTenure:17, ownerAge:51, familyOwned:true,  adv:true  },
  { id:"10", name:"Summit Solutions",          location:"Maplewood, NJ",    totalAUM:2.75, advisors:45, hnwAUMPercent:45, acquisitionScore:70,  decisionMaker:"Emily Smith",        custodian:["TD Ameritrade"],           officeCount:3, aumPerAdvisor:0.061, clients:380,  employees:68,  secRegistrationDate:"2004-01-10", aumCAGR:7.5,  pastAcquisitions:1, ownerTenure:19, ownerAge:53, familyOwned:false, adv:true  },
  { id:"11", name:"Infinity Group",            location:"Troy, MI",         totalAUM:3.30, advisors:80, hnwAUMPercent:80, acquisitionScore:69,  decisionMaker:"Christopher Harris", custodian:["Schwab"],                  officeCount:8, aumPerAdvisor:0.041, clients:850,  employees:140, secRegistrationDate:"1997-12-01", aumCAGR:6.8,  pastAcquisitions:2, ownerTenure:26, ownerAge:63, familyOwned:false, adv:true  },
  { id:"12", name:"Elemental Technologies",    location:"Glenview, IL",     totalAUM:3.40, advisors:85, hnwAUMPercent:85, acquisitionScore:97,  decisionMaker:"Ashley Martin",      custodian:["Fidelity","Schwab"],       officeCount:7, aumPerAdvisor:0.040, clients:920,  employees:155, secRegistrationDate:"2001-03-25", aumCAGR:11.4, pastAcquisitions:4, ownerTenure:22, ownerAge:57, familyOwned:true,  adv:true  },
  { id:"13", name:"Apex Strategies",           location:"Glenview, IL",     totalAUM:3.40, advisors:85, hnwAUMPercent:85, acquisitionScore:97,  decisionMaker:"Ashley Martin",      custodian:["Pershing"],                officeCount:6, aumPerAdvisor:0.040, clients:900,  employees:148, secRegistrationDate:"2001-05-14", aumCAGR:11.2, pastAcquisitions:3, ownerTenure:21, ownerAge:56, familyOwned:false, adv:true  },
];

export const FIRM_FILTER_OPTIONS = {
  totalAUM: [
    { label:"$0M - $50M",    value:"0-50",      count:3245 },
    { label:"$50M - $100M",  value:"50-100",    count:2840 },
    { label:"$250M - $500M", value:"250-500",   count:4120 },
    { label:"$500M - $1B",   value:"500-1000",  count:2650 },
    { label:"$1B - $2.5B",   value:"1000-2500", count:1890 },
  ],
  hnwClientAUM: [
    { label:"85% to 100%", value:"85-100", count:3245 },
    { label:"65% to 85%",  value:"65-85",  count:4120 },
    { label:"45% to 65%",  value:"45-65",  count:2650 },
    { label:"0% to 45%",   value:"0-45",   count:1890 },
  ],
  acquisitionScore: [
    { label:"70+",          value:"70+",  level:"HIGH"     },
    { label:"50 to 70",     value:"50-70",level:"MODERATE" },
    { label:"Less than 50", value:"0-50", level:"LOW"      },
  ],
  custodians: ["Schwab","Fidelity","Pershing","TD Ameritrade","Raymond James","LPL Financial"],
  ownerTenure: [
    { label:"10+ years", value:"10+", count:3245 },
    { label:"15+ years", value:"15+", count:4120 },
    { label:"20+ years", value:"20+", count:2650 },
    { label:"23+ years", value:"23+", count:1890 },
    { label:"25+ years", value:"25+", count:1890 },
  ],
};

export const MOCK_FIRM_PROFILE: FirmProfile = {
  id: "aurora-wealth",
  name: "Aurora Wealth Management",
  established: 2010,
  location: "Dallas, Texas",
  website: "https://aurorawealth.com",
  linkedin: "https://linkedin.com/company/aurora-wealth",
  advisorCount: 3,
  officeCount: 3,
  lastFiling: "Dec 3, 2025",
  acquisitionScore: 93,
  acquisitionScoreChange: 2,
  totalAUM: 5.5,
  aumComposition: [
    { name:"HNW",                percentage:58, color:"#4F46E5" },
    { name:"Non-HNW Individuals", percentage:33, color:"#A5B4FC" },
    { name:"Institutional",       percentage:9,  color:"#E0E7FF" },
  ],
  aumGrowthTrend: [
    { year:2020, firmAUM:3.8, marketAverage:3.9 },
    { year:2021, firmAUM:4.2, marketAverage:4.0 },
    { year:2022, firmAUM:3.5, marketAverage:3.2 },
    { year:2023, firmAUM:4.8, marketAverage:3.0 },
    { year:2024, firmAUM:5.5, marketAverage:2.1 },
  ],
  aiSummary: {
    title: "High Growth on Several Fronts",
    trend: "up",
    bullets: [
      "Good concentration in HNW clients (58%) with an average AUM per client of about $701K (35th ptile).",
      "Strong recent growth 23% 1 yr CAGR (but flat over a 5 year period).",
      "Client numbers have fluctuated but show a slight decline from 744 five years ago to 425 today.",
      "Operationally, AUM per employee is above average at ~$59.6M (59th ptile), and per advisor about $74.6M (49th ptile).",
      "Ownership is split among 4 owners (3 internal, 1 external).",
    ],
  },
  acquisitionHistory: {
    totalAcquiredAUM: "$300M",
    totalAcquisitions: 5,
  },
  benchmark: {
    regionRank: "Top 10%",
    region: "Northeast region",
    higherThanAverage: "12% higher than average",
    aumRange: "$4-5B AUM",
  },
};

export const LEADERBOARD_DATA = {
  largestAUM: [
    { rank:1, name:"Vanguard Group",       value:"$8.1T" },
    { rank:2, name:"BlackRock",            value:"$7.4T" },
    { rank:3, name:"Fidelity Investments", value:"$7.2T" },
    { rank:4, name:"State Street Global",  value:"$6.5T" },
    { rank:5, name:"Invesco",              value:"$5.1T" },
  ],
  topGrowing: [
    { rank:1, name:"Vanguard Group",       aum:"$235B AUM", growth:"+42.2%" },
    { rank:2, name:"BlackRock",            aum:"$58B AUM",  growth:"+38.2%" },
    { rank:3, name:"Fidelity Investments", aum:"$130B AUM", growth:"+35.1%" },
    { rank:4, name:"State Street Global",  aum:"$62B AUM",  growth:"+30.2%" },
    { rank:5, name:"Invesco",              aum:"$95B AUM",  growth:"+28.5%" },
  ],
  topAcquisitionScore: [
    { rank:1, name:"Vanguard Group",       score:5357 },
    { rank:2, name:"BlackRock",            score:5357 },
    { rank:3, name:"Fidelity Investments", score:5357 },
    { rank:4, name:"State Street Global",  score:5357 },
    { rank:5, name:"Invesco",              score:5357 },
  ],
};
