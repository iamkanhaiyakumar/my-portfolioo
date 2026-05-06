import React from "react";
import styles from "./About.module.css";
import { getImageUrl } from "../../utils";
import { motion } from "framer-motion";

const ABOUT_CARDS = [
  {
    icon: "🎓",
    title: "B.Tech CSE (AI & ML)",
    description:
      "Final year student at LNCT Excellence, Bhopal. Specializing in Artificial Intelligence & Machine Learning with CGPA 7.43.",
  },
  {
    icon: "🤖",
    title: "AI & ML Engineer",
    description:
      "Building intelligent systems with deep learning, computer vision (YOLO), and NLP. Experienced with PyTorch, TensorFlow, and LangChain.",
  },
  {
    icon: "📄",
    title: "IEEE Published Researcher",
    description:
      'Published research on "AI-Driven PPE Detection and Human Access Monitoring in Manufacturing Zones" at IEEE Conference.',
  },
  {
    icon: "🏅",
    title: "NCC Cadet & Mentor",
    description:
      "Dedicated NCC cadet. Mentored 150+ students as GDSC mentor, conducted workshops on Python, Git, and web development.",
  },
];

export const About = () => {
  return (
    <section className={styles.container} id="about">
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.sectionTag}>👤 About Me</span>
        <h2 className={styles.title}>Know Who I Am</h2>
      </motion.div>

      <div className={styles.content}>
        {/* Image */}
        <motion.div
          className={styles.imageCol}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.imageWrapper}>
            <img
              src={getImageUrl("about/aboutImage.png")}
              alt="Kanhaiya Kumar"
              className={styles.aboutImage}
            />
            <div className={styles.imageGlow}></div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className={styles.cardsCol}>
          {ABOUT_CARDS.map((card, idx) => (
            <motion.div
              key={idx}
              className={styles.card}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <span className={styles.cardIcon}>{card.icon}</span>
              <div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
