import styles from "./App.module.css";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { Experience } from "./components/Experience/Experience";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Projects } from "./components/Projects/Projects";
import { Achievements } from "./components/Achievements/Achievements";
// import { Toggle } from "./components/Toggle/Toggle";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
function App() {
  
  return (
    
    <div className={styles.App}>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
      <ScrollToTop />
      {/* <Toggle /> */}
    </div>
    
  );
}

export default App;



