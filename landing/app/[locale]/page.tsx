export const runtime = 'edge';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import CashGameShowcase from './components/CashGameShowcase';
import TournamentShowcase from './components/TournamentShowcase';
import StatsPreview from './components/StatsPreview';
import LevelShowcase from './components/LevelShowcase';
import MissionShowcase from './components/MissionShowcase';
import Testimonials from './components/Testimonials';
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
      <LevelShowcase />
      <MissionShowcase />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
