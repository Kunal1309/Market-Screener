"use client";
import AdvisorsView from "@/components/views/AdvisorsView";
import { useRouter } from "next/navigation";

export default function AdvisorsPage() {
  const router = useRouter();
  
  return <AdvisorsView onTabChange={(tab) => {
    if (tab === "firms") router.push("/market-insights");
    if (tab === "owners") router.push("/owners");
  }} />;
}
