"use client";
import { useState } from "react";
import FirmsView from "@/components/views/FirmsView";
import AdvisorsView from "@/components/views/AdvisorsView";
import OwnersView from "@/components/views/OwnersView";

export default function MarketInsightsPage() {
  const [activeTab, setActiveTab] = useState<"owners" | "firms" | "advisors">("firms");

  if (activeTab === "advisors") {
    return <AdvisorsView onTabChange={setActiveTab} title="Market Insights" />;
  }

  if (activeTab === "owners") {
    return <OwnersView onTabChange={setActiveTab} title="Market Insights" />;
  }

  return <FirmsView onTabChange={setActiveTab} />;
}
