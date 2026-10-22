import Hero from "@/components/Hero";
import DutyCostCalculator from "@/components/DutyCostCalculator";
import StatsBar from "@/components/StatsBar";
import ServicesGrid from "@/components/ServicesGrid";
import ToolsSection from "@/components/ToolsSection";
import CustomsNetwork from "@/components/CustomsNetwork";
import SirkulerPreview from "@/components/SirkulerPreview";
import CustomsMultiStepForm from "@/components/CustomsMultiStepForm";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DutyCostCalculator />
      <StatsBar />
      <ServicesGrid />
      <ToolsSection />
      <CustomsNetwork />
      <SirkulerPreview />
      <CustomsMultiStepForm />
    </>
  );
}
