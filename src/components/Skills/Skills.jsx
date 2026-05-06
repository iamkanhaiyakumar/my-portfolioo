import React from "react";
import styles from "./Skills.module.css";
import skills from "../../data/skills.json";
import { getImageUrl } from "../../utils";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    name: "Languages",
    icon: "💻",
    color: "#818cf8",
    items: ["C++", "Python", "JavaScript"],
  },
  {
    name: "AI & Data Science",
    icon: "🤖",
    color: "#22d3ee",
    items: ["Machine Learning", "OpenCV", "Pandas", "NumPy", "Matplotlib"],
  },
  {
    name: "Web Development",
    icon: "🌐",
    color: "#34d399",
    items: ["HTML", "CSS", "TailWind CSS", "MySQL"],
  },
  {
    name: "Tools & Platforms",
    icon: "🔧",
    color: "#a78bfa",
    items: [
      "Jupyter Notebook",
      "Google Colab",
      "VS Code",
      "Git & GitHub",
      "Cloud Computing",
    ],
  },
];

export const Skills = () => {
  const skillMap = {};
  skills.forEach((s) => {
    skillMap[s.title] = s;
  });

  return (
    <section className={styles.container} id="skills">
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.sectionTag}>🛠️ Tech Stack</span>
        <h2 className={styles.title}>Skills & Technologies</h2>
        <p className={styles.subtitle}>
          Technologies I've been working with across AI/ML, web development, and
          data science
        </p>
      </motion.div>

      <div className={styles.categories}>
        {CATEGORIES.map((cat, catIdx) => (
          <motion.div
            key={catIdx}
            className={styles.category}
            style={{ "--cat-color": cat.color }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIdx * 0.12 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <div className={styles.catGlow}></div>
            <div className={styles.catHeader}>
              <span className={styles.catIcon}>{cat.icon}</span>
              <h3 className={styles.catName}>{cat.name}</h3>
            </div>
            <div className={styles.skillGrid}>
              {cat.items.map((itemName, idx) => {
                const skill = skillMap[itemName];
                if (!skill) return null;
                return (
                  <motion.a
                    key={idx}
                    href={skill.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.skillItem}
                    whileHover={{
                      scale: 1.08,
                      y: -4,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <img
                      src={getImageUrl(skill.imageSrc)}
                      alt={skill.title}
                      className={styles.skillIcon}
                    />
                    <span className={styles.skillName}>{skill.title}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
