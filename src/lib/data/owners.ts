import { Owner } from "@/types";

export const MOCK_OWNERS: Owner[] = [
  {
    id: "o1",
    name: "Alex Jensen",
    firm: "Apex Wealth Partners",
    ownershipPercentage: 55,
    role: "Founder & CEO",
    age: 52,
    tenure: 18,
    location: "New York, NY"
  },
  {
    id: "o2",
    name: "Maria Gonzalez",
    firm: "Summit Financial",
    ownershipPercentage: 35,
    role: "Managing Partner",
    age: 46,
    tenure: 10,
    location: "Chicago, IL"
  },
  {
    id: "o3",
    name: "David Chen",
    firm: "Pacific Horizons LLC",
    ownershipPercentage: 80,
    role: "Founder",
    age: 61,
    tenure: 25,
    location: "San Francisco, CA"
  },
  {
    id: "o4",
    name: "Sarah Williams",
    firm: "Evergreen Capital",
    ownershipPercentage: 20,
    role: "Partner",
    age: 39,
    tenure: 5,
    location: "Austin, TX"
  },
  {
    id: "o5",
    name: "James Robert",
    firm: "Beacon Advisory Group",
    ownershipPercentage: 100,
    role: "President",
    age: 58,
    tenure: 20,
    location: "Boston, MA"
  },
  {
    id: "o6",
    name: "Linda Taylor",
    firm: "Vanguard Asset Management",
    ownershipPercentage: 15,
    role: "Senior Partner",
    age: 48,
    tenure: 8,
    location: "Miami, FL"
  },
  {
    id: "o7",
    name: "Michael Brown",
    firm: "NorthStar Wealth",
    ownershipPercentage: 60,
    role: "CEO",
    age: 55,
    tenure: 15,
    location: "Seattle, WA"
  },
  {
    id: "o8",
    name: "Emily Davis",
    firm: "Pioneer Financial",
    ownershipPercentage: 40,
    role: "Co-Founder",
    age: 42,
    tenure: 12,
    location: "Denver, CO"
  },
  {
    id: "o9",
    name: "Robert Miller",
    firm: "Horizon Capital",
    ownershipPercentage: 25,
    role: "Managing Director",
    age: 50,
    tenure: 9,
    location: "Atlanta, GA"
  },
  {
    id: "o10",
    name: "Jessica Wilson",
    firm: "Crestview Wealth",
    ownershipPercentage: 75,
    role: "Founder & President",
    age: 63,
    tenure: 22,
    location: "Dallas, TX"
  }
];

export const OWNER_FILTER_OPTIONS = {
  ownershipRanges: [
    { label: "0-20%", value: "0-20%" },
    { label: "21-50%", value: "21-50%" },
    { label: "51-99%", value: "51-99%" },
    { label: "100%", value: "100%" }
  ],
  roles: ["Founder & CEO", "Managing Partner", "Founder", "Partner", "President", "Senior Partner", "CEO", "Co-Founder", "Managing Director", "Founder & President"],
  ageRanges: [
    { label: "Under 40", value: "Under 40" },
    { label: "40-49", value: "40-49" },
    { label: "50-59", value: "50-59" },
    { label: "60-69", value: "60-69" },
    { label: "70+", value: "70+" }
  ],
  tenureRanges: [
    { label: "0-5 years", value: "0-5 years" },
    { label: "6-10 years", value: "6-10 years" },
    { label: "11-20 years", value: "11-20 years" },
    { label: "20+ years", value: "20+ years" }
  ]
};
