import React from "react";
import styles from "./Education.module.css";
import education from "../../data/education.json";
import { motion } from "framer-motion";

export const Education = () => {
  return (
    <section id="education" className={styles.container}>
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.sectionTag}>🎓 Academic Journey</span>
        <h2 className={styles.title}>Education History</h2>
        <p className={styles.subtitle}>
          My academic foundation and formal training in computer science
        </p>
      </motion.div>

      <div className={styles.items}>
        {education.map((item, index) => (
          <motion.div
            key={index}
            className={styles.card}
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -6, boxShadow: "var(--shadow-md), 0 0 25px rgba(99, 102, 241, 0.12)" }}
          >
            <div className={styles.cardAccent}></div>
            {/* ===== TOP ROW: College (Left) — Duration (Right) ===== */}
            <div className={styles.row}>
              <h3 className={styles.college}>{item.institution}</h3>
              <span className={styles.duration}>{item.duration}</span>
            </div>

            {/* ===== SECOND ROW: Degree (Left) — Location (Right) ===== */}
            <div className={styles.row}>
              <p className={styles.degree}>{item.degree}</p>
              <span className={styles.location}>{item.location}</span>
            </div>

            {/* ===== SCORE (Separate Row) ===== */}
            <div className={styles.scoreContainer}>
              <span className={styles.scoreLabel}>Performance:</span>
              <p className={styles.score}>{item.score}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
