import React, { useState, useEffect } from "react";
import { getImageUrl } from "../../utils";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

const ROLES = [
  "AI & Machine Learning Engineer",
  "Computer Vision Specialist",
  "Full-Stack Web Developer",
  "Generative AI Builder",
];

export const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout;

    if (!isDeleting && text === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else {
      timeout = setTimeout(
        () => {
          setText(
            isDeleting
              ? currentRole.substring(0, text.length - 1)
              : currentRole.substring(0, text.length + 1)
          );
        },
        isDeleting ? 30 : 60
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section className={styles.hero}>
      {/* Left */}
      <motion.div
        className={styles.left}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          Open to opportunities
        </div>

        <h1 className={styles.name}>
          Hi, I'm{" "}
          <span className={styles.highlight}>Kanhaiya</span>
          <motion.span
            className={styles.wave}
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            👋
          </motion.span>
        </h1>

        <div className={styles.typewriterLine}>
          <span className={styles.typewriter}>
            {text}
            <span className={styles.caret}>|</span>
          </span>
        </div>

        <p className={styles.bio}>
          Passionate about building scalable AI solutions and real-time
          computer vision systems. Published IEEE researcher with experience
          in YOLO-based detection, LLM applications, and full-stack web
          development.
        </p>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>49+</span>
            <span className={styles.statLabel}>Projects</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNum}>1</span>
            <span className={styles.statLabel}>IEEE Paper</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNum}>150+</span>
            <span className={styles.statLabel}>Students Mentored</span>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <a href="#contact" className={styles.primaryBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Get in Touch
          </a>
          <a
            href="https://drive.google.com/file/d/1li4Sca2cabe92whgVI4L2hQFZ43haJ3C/view"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
          >
            View Resume →
          </a>
        </div>
      </motion.div>

      {/* Right */}
      <motion.div
        className={styles.right}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className={styles.imgContainer}>
          <motion.img
            src={getImageUrl("hero/Heroimage1.png")}
            alt="Kanhaiya Kumar"
            className={styles.heroImg}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className={styles.imgGlow}></div>
        </div>
      </motion.div>

      {/* Background blurs */}
      <div className={styles.blur1}></div>
      <div className={styles.blur2}></div>
    </section>
  );
};
