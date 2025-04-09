import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}