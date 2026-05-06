import React from "react";
import styles from "./Achievements.module.css";
import { getImageUrl } from "../../utils";
import achievements from "../../data/achievements.json";
import { motion } from "framer-motion";

const CARD_COLORS = [
  { accent: "#fbbf24", bg: "rgba(251, 191, 36, 0.06)", border: "rgba(251, 191, 36, 0.15)" },
  { accent: "#818cf8", bg: "rgba(129, 140, 248, 0.06)", border: "rgba(129, 140, 248, 0.15)" },
  { accent: "#fb7185", bg: "rgba(251, 113, 133, 0.06)", border: "rgba(251, 113, 133, 0.15)" },
  { accent: "#34d399", bg: "rgba(52, 211, 153, 0.06)", border: "rgba(52, 211, 153, 0.15)" },
  { accent: "#a78bfa", bg: "rgba(167, 139, 250, 0.06)", border: "rgba(167, 139, 250, 0.15)" },
];

export const Achievements = () => {
  return (
    <section className={styles.container} id="achievements">
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.sectionTag}>🏆 Achievements</span>
        <h2 className={styles.title}>Awards & Recognition</h2>
        <p className={styles.subtitle}>
          Milestones that shaped my journey in AI, research, and leadership
        </p>
      </motion.div>

      <div className={styles.timeline}>
        <div className={styles.timelineLine}></div>

        {achievements.map((item, index) => {
          const colors = CARD_COLORS[index % CARD_COLORS.length];
          return (
            <motion.div
              key={index}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <div
                className={styles.dot}
                style={{ borderColor: colors.accent }}
              >
                <div
                  className={styles.dotInner}
                  style={{ background: colors.accent }}
                ></div>
              </div>

              <motion.div
                className={styles.card}
                style={{
                  "--accent": colors.accent,
                  "--card-bg": colors.bg,
                  "--card-border": colors.border,
                }}
                whileHover={{
                  y: -8,
                  boxShadow: `0 20px 50px rgba(0,0,0,0.3), 0 0 30px ${colors.accent}15`,
                  borderColor: colors.accent + "40",
                  transition: { duration: 0.3 },
                }}
              >
                <div className={styles.cardAccent}></div>

                <div className={styles.cardHeader}>
                  <div className={styles.iconWrap} style={{ background: colors.bg, borderColor: colors.border }}>
                    <img
                      src={getImageUrl(item.imageSrc)}
                      alt={item.organisation}
                      className={styles.icon}
                    />
                  </div>
                  <div className={styles.headerText}>
                    <h3 className={styles.role}>{item.role}</h3>
                    <p className={styles.org} style={{ color: colors.accent }}>
                      {item.organisation}
                    </p>
                    {item.startDate && item.endDate && (
                      <span className={styles.date}>
                        {item.startDate} — {item.endDate}
                      </span>
                    )}
                  </div>
                </div>

                <ul className={styles.expList}>
                  {item.experiences.map((exp, i) => (
                    <li key={i} style={{ "--bullet-color": colors.accent }}>
                      {exp}
                    </li>
                  ))}
                </ul>

                {item.links && (
                  <div className={styles.links}>
                    {item.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkBtn}
                        style={{
                          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)`,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
