import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import ServicesGrid from "@/components/ServicesGrid";
import ToolsSection from "@/components/ToolsSection";
import CustomsNetwork from "@/components/CustomsNetwork";
import SirkulerPreview from "@/components/SirkulerPreview";
import QuickQuoteForm from "@/components/QuickQuoteForm";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <ToolsSection />
      <CustomsNetwork />
      <SirkulerPreview />
      <QuickQuoteForm />
    </>
  );
}
