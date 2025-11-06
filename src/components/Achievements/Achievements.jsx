import React from "react";
import styles from "./Achievements.module.css";
import { getImageUrl } from "../../utils";
import achievements from "../../data/achievements.json";

export const Achievements = () => {
  return (
    <section className={styles.container} id="achievements">
      <h2 className={styles.title}>Achievements</h2>

      <div className={styles.history}>
        {achievements.map((achievement, index) => (
          <div key={index} className={styles.historyItem}>
            <img
              src={getImageUrl(achievement.imageSrc)}
              alt={`${achievement.organisation} logo`}
            />
            <div className={styles.historyItemDetails}>
              <h3>{`${achievement.role}, ${achievement.organisation}`}</h3>
              {achievement.startDate && achievement.endDate && (
                <p>{`${achievement.startDate} - ${achievement.endDate}`}</p>
              )}
              <ul>
                {achievement.experiences.map((exp, i) => (
                  <li key={i}>{exp}</li>
                ))}
              </ul>

              {achievement.links && (
                <div className={styles.buttons}>
                  {achievement.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewButton}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
