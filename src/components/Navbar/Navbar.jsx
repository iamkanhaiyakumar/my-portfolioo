import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { getImageUrl } from "../../utils";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to add shadow and background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <a className={styles.logo} href="/">
        <img
          src={getImageUrl("nav/logo.png")}
          alt="Logo"
          className={styles.logoImg}
        />
        <span>My Portfolio</span>
      </a>

      <div className={styles.menu}>
        {/* Hamburger icon */}
        {!menuOpen && (
          <img
            className={styles.menuBtn}
            src={getImageUrl("nav/menuIcon.png")}
            alt="menu-button"
            onClick={() => setMenuOpen(true)}
          />
        )}

        {/* Slide-in Menu */}
        <ul
          className={`${styles.menuItems} ${menuOpen ? styles.menuOpen : ""}`}
        >
          {/* Cross (Close) button inside the menu */}
          {menuOpen && (
            <img
              src={getImageUrl("nav/closeIcon.png")}
              alt="close"
              className={styles.closeBtn}
              onClick={() => setMenuOpen(false)}
            />
          )}

          <li>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          </li>
          <li>
            <a href="#experience" onClick={() => setMenuOpen(false)}>Skills</a>
          </li>
          <li>
            <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
          </li>
          <li>
            <a href="#achievements" onClick={() => setMenuOpen(false)}>Achievements</a>
          </li>
          <li>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
