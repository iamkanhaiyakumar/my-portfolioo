import React from "react";
import styles from "./Projects.module.css";
import projects from "../../data/projects.json";
import { ProjectCard } from "./ProjectCard";
import { motion } from "framer-motion";

export const Projects = () => {
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

      <div className={styles.projects}>
        {projects.map((project, id) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: id * 0.08 }}
          >
            <ProjectCard project={project} index={id} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
