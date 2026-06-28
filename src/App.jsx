import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { Experience } from "./components/Experience/Experience";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Projects } from "./components/Projects/Projects";
import { Achievements } from "./components/Achievements/Achievements";
import { Skills } from "./components/Skills/Skills";
import { Education } from "./components/Education/Education";
import { Certificates } from "./components/Certificates/Certificates";
import Chatbot from "./components/Chatbot/Chatbot";
import { Modal } from "./components/Modal/Modal";

// import { Toggle } from "./components/Toggle/Toggle";

import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop";
import { WhatsAppButton } from "./components/WhatsAppButton/WhatsAppButton";
function App() {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, pdfUrl: "", title: "" });

  useEffect(() => {
    window.showCertificate = (pdfUrl, title) => {
      setModalConfig({ isOpen: true, pdfUrl, title });
    };
    return () => {
      delete window.showCertificate;
    };
  }, []);

  return (
    <div className={styles.App}>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <Achievements />
      <Certificates />
      <Contact />
      <ScrollToTop />
      <WhatsAppButton />
      <Chatbot />
      
      <Modal
        isOpen={modalConfig.isOpen}
        pdfUrl={modalConfig.pdfUrl}
        title={modalConfig.title}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
      {/* <Toggle /> */}
    </div>
  );
}

export default App;
