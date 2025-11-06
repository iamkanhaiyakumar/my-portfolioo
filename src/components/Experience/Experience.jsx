import React from "react";

import styles from "./Experience.module.css";
import skills from "../../data/skills.json";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";

export const Experience = () => {
  return (
    <section className={styles.container} id="experience">
      {/* ===== Skills Section ===== */}
      <h2 className={styles.title}>Skills</h2>
      <div className={styles.skillsContainer}>
        <div className={styles.skills}>
          {skills.map((skill, id) => {
            return (
              <div key={id} className={styles.skill}>
                {/* ✅ Wrap logo inside a clickable link */}
                <a
                  href={skill.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.skillLink}
                >
                  <div className={styles.skillImageContainer}>
                    <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
                  </div>
                </a>
                <p>{skill.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Experience Section ===== */}
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.experienceContainer}>
        <ul className={styles.history}>
          {history.map((historyItem, id) => {
            return (
              <li key={id} className={styles.historyItem}>
                <img
                  src={getImageUrl(historyItem.imageSrc)}
                  alt={`${historyItem.organisation} Logo`}
                />
                <div className={styles.historyItemDetails}>
                  <h3>{`${historyItem.role}, ${historyItem.organisation}`}</h3>
                  <p>{`${historyItem.startDate} - ${historyItem.endDate}`}</p>
                  <ul>
                    {historyItem.experiences.map((experience, index) => (
                      <li key={index}>{experience}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
