import React from "react";

import styles from "./About.module.css";
import { getImageUrl } from "../../utils";

export const About = () => {
  return (
    <section className={styles.container} id="about">
  <h2 className={styles.title}>About</h2>
  <div className={styles.content}>
    <img
      src={getImageUrl("about/aboutImage.png")}
      alt="Me sitting with a laptop"
      className={styles.aboutImage}
    />

    <ul className={styles.aboutItems}>

      <li className={styles.aboutItem}>
        <img src={getImageUrl("about/serverIcon.png")} alt="Server icon" />
        <div className={styles.aboutItemText}>
          <h3>Computer Science Engineering (AI & ML)</h3>
          <p>
            Pursuing a Bachelor's in Computer Science Engineering with a
            specialization in Artificial Intelligence and Machine Learning,
            focusing on modern AI technologies and real-world applications.
          </p>
        </div>
      </li>

      <li className={styles.aboutItem}>
        <img src={getImageUrl("about/cursorIcon.png")} alt="Cursor icon" />
        <div className={styles.aboutItemText}>
           <h3>AI & ML Enthusiast </h3>
          <p>
            Skilled in developing intelligent systems using deep learning,
            machine learning, and computer vision. Experienced with Python,
            TensorFlow, and YOLO-based models for real-world AI solutions.
          </p>
        </div>
      </li>

      <li className={styles.aboutItem}>
        <img src={getImageUrl("about/ncc1.jpg")} alt="NCC icon" />
        <div className={styles.aboutItemText}>
          <h3>NCC Cadet</h3>
          <p>
            Dedicated NCC cadet committed to discipline, leadership, and
            community service through national-level training and volunteer
            initiatives.
          </p>
        </div>
      </li>

    </ul>
  </div>
</section>
  );
};
