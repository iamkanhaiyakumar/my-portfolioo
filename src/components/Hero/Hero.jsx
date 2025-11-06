import React from "react";
import { getImageUrl } from "../../utils";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className={styles.container}>
      {/* === Left Section (Text Content) === */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className={styles.title}>
          Hi, I'm <span className={styles.highlight}>Kanhaiya 👋</span>
        </h1>

        <p className={styles.subtitle}>
          <span className={styles.gradientText}>
            AI & Machine Learning Enthusiast
          </span>
        </p>

        <p className={styles.description}>
          Passionate about building scalable AI solutions and real-time computer
          vision systems. Experienced in YOLO-based object detection, full-stack
          web development, and data-driven model optimization. Skilled in{" "}
          <b>Python</b>, <b>C++</b>, and <b>MySQL</b>.
        </p>

        {/* === Buttons === */}
        <div className={styles.btnGroup}>
          <a href="#contact" className={styles.contactBtn}>
            📩 Contact Me
          </a>
          <a
            href="https://drive.google.com/file/d/1li4Sca2cabe92whgVI4L2hQFZ43haJ3C/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeBtn}
          >
            📄 My Resume
          </a>
        </div>
      </motion.div>

      {/* === Right Section (Floating Animated Image) === */}
      <motion.img
        src={getImageUrl("hero/Heroimage1.png")}
        alt="Hero illustration"
        className={styles.heroImg}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -15, 0] }} // Floating effect
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* === Background Glow Effects === */}
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
