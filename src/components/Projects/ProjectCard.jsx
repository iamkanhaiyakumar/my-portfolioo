import React from "react";
import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";
import { motion } from "framer-motion";

const CATEGORY_COLORS = {
  Python: "#3776ab",
  YOLO: "#ff6f00",
  OpenCV: "#5c3ee8",
  "Machine Learning": "#f59e0b",
  ML: "#f59e0b",
  Flask: "#64748b",
  MySQL: "#00758f",
  Streamlit: "#ff4b4b",
  NLP: "#10b981",
  Pandas: "#150458",
  "React JS": "#61dafb",
  HTML: "#e34f26",
  CSS: "#1572b6",
  JavaScript: "#f7df1e",
  API: "#06b6d4",
  TypeScript: "#3178c6",
  "Next.js": "#a78bfa",
  AI: "#f43f5e",
  LangChain: "#34d399",
};

// Each project card gets a unique accent border color
const CARD_ACCENTS = [
  "#f43f5e", // rose
  "#8b5cf6", // violet
  "#22d3ee", // cyan
  "#fbbf24", // amber
  "#34d399", // emerald
  "#fb923c", // orange
  "#818cf8", // indigo
  "#ec4899", // pink
  "#a3e635", // lime
];

export const ProjectCard = ({
  project: { title, imageSrc, description, skills, demo, source },
  index,
}) => {
  const isFeatured = index < 3;
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  return (
    <motion.div
      className={`${styles.card} ${isFeatured ? styles.featured : ""}`}
      style={{ "--card-accent": accent }}
      whileHover={{
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {/* Image with overlay */}
      <div className={styles.imageWrapper}>
        <img
          src={getImageUrl(imageSrc)}
          alt={title}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          <a href={demo} target="_blank" rel="noopener noreferrer" className={styles.overlayBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live Demo
          </a>
          <a href={source} target="_blank" rel="noopener noreferrer" className={`${styles.overlayBtn} ${styles.outlineBtn}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Source
          </a>
        </div>
        {isFeatured && <span className={styles.featuredBadge}>⭐ Featured</span>}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.techStack}>
          {skills.map((skill, id) => (
            <span
              key={id}
              className={styles.tech}
              style={{
                borderColor: CATEGORY_COLORS[skill] || "#6366f1",
                color: CATEGORY_COLORS[skill] || "#818cf8",
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <a href={demo} className={styles.demoBtn} target="_blank" rel="noopener noreferrer" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            Live Demo
          </a>
          <a href={source} className={styles.sourceBtn} target="_blank" rel="noopener noreferrer">
            Code →
          </a>
        </div>
      </div>
    </motion.div>
  );
};
