import React, { useState, useEffect } from "react";
import styles from "./ScrollToTop.module.css";
import { getImageUrl } from "../../utils"; // ✅ if you're using getImageUrl for assets

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  // Show button when scroll position > 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {visible && (
        <button className={styles.scrollToTop} onClick={scrollToTop}>
          <img
            src={getImageUrl("icons/upArrow.jpg")} // 📁 place your arrow icon here
            alt="Scroll to top"
          />
        </button>
      )}
    </>
  );
};
