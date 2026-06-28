import React, { useState } from "react";
import styles from "./Projects.module.css";
import projects from "../../data/projects.json";
import { ProjectCard } from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "ai-ml", label: "AI / ML & Vision" },
  { id: "web", label: "Web Applications" },
  { id: "utility", label: "Utilities & Tools" }
];

export const Projects = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = activeTab === "all"
    ? projects
    : projects.filter(project => project.category === activeTab);

  return (
    <section className={styles.container} id="projects">
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.sectionTag}>💼 Portfolio</span>
        <h2 className={styles.title}>Featured Projects</h2>
        <p className={styles.subtitle}>
          A collection of projects showcasing expertise in AI/ML, Computer
          Vision, and Full-Stack Development
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className={styles.tabsContainer}>
        {CATEGORIES.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabUnderline"
                className={styles.activeUnderline}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.div layout className={styles.projects}>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
