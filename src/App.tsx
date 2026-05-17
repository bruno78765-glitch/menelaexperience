import Hero from './components/Hero';
import EventInfo from './components/EventInfo';
import About from './components/About';
import CEO from './components/CEO';
import Speakers from './components/Speakers';
import Judges from './components/Judges';
import Ambassadors from './components/Ambassadors';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import BetoCarrero from './components/BetoCarrero';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';

export default function App() {
  return (
    <main style={{ background: '#fdf5f7' }}>
      <Hero />
      <EventInfo />
      <About />
      <CEO />
      <Speakers />
      <Judges />
      <Ambassadors />
      <Experience />
      <Testimonials />
      <FinalCTA />
      <BetoCarrero />
      <Footer />
      <ChatWidget />
    </main>
  );
}
