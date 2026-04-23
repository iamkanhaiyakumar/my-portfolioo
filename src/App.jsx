import styles from "./App.module.css";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { Experience } from "./components/Experience/Experience";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Projects } from "./components/Projects/Projects";
import { Achievements } from "./components/Achievements/Achievements";
import { Skills } from "./components/Skills/Skills";
// import { Toggle } from "./components/Toggle/Toggle";

import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import { WhatsAppButton } from "./components/WhatsAppButton/WhatsAppButton";
function App() {
  return (
    <div className={styles.App}>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
      <ScrollToTop />
      <WhatsAppButton />
      {/* <Toggle /> */}
    </div>
  );
}

export default App;
