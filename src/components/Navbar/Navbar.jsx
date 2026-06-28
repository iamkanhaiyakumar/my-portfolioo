import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { getImageUrl } from "../../utils";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Detect scroll to add shadow and background
  useEffect(() => {
    const handleScroll = () => {
      // Background scroll check
      if (window.scrollY > 60) setScrolled(true);
      else setScrolled(false);

      // Scroll progress calculation
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scrollspy (Active Section Highlighting)
  useEffect(() => {
    const sectionIds = ["about", "skills", "experience", "projects", "achievements", "contact"];
    
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // Trigger when section occupies the middle of the screen
      threshold: 0
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "achievements", label: "Achievements" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <a className={styles.logo} href="/">
        <img
          src={getImageUrl("nav/logo.png")}
          alt="Logo"
          className={styles.logoImg}
        />
        <span className={styles.my}>My Portfolio</span>
      </a>

      <div className={styles.menu}>
        {/* Pure CSS Morphing Hamburger Button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerActive : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </button>

        {/* Slide-in Menu */}
        <ul className={`${styles.menuItems} ${menuOpen ? styles.menuOpen : ""}`}>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className={activeSection === link.id ? styles.activeLink : ""}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Optional overlay behind mobile menu */}
        {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
      </div>

      {/* Glowing Scroll Progress Bar */}
      <div 
        className={styles.progressBar} 
        style={{ width: `${scrollProgress}%` }}
      />
    </nav>
  );
};
