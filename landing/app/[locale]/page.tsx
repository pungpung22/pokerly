import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import CashGameShowcase from './components/CashGameShowcase';
import TournamentShowcase from './components/TournamentShowcase';
import StatsPreview from './components/StatsPreview';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <HowItWorks />
      <CashGameShowcase />
      <TournamentShowcase />
      <StatsPreview />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
