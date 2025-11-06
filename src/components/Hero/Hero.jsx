import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Kanhaiya </h1>
        
        <p className={styles.description}>
           AI and Machine Learning enthusiast with hands-on experience in YOLO-based object detection, full-stack web development,
 and data-driven model optimization. Skilled in Python, C++, and MySQL, with a strong focus on building scalable AI
 solutions and deploying real-time computer vision systems.
        </p>
{/*         <p className={styles.socialLinks}>
        <img
            src={getImageUrl("contact/linkedinIcon.png")}
            alt="LinkedIn icon"
          />
          <a href="https://www.linkedin.com/in/kanhaiyakumar01">Linked</a>
          <img src={getImageUrl("contact/githubIcon.png")} alt="Github icon" />
          <a href="https://github.com/iamkanhaiyakumar"></a>
          </p> */}
          <p className="btn">
        <a href="#contact" className={styles.contactBtn}>
          Contact Me
        </a>
        <a href="https://drive.google.com/file/d/1li4Sca2cabe92whgVI4L2hQFZ43haJ3C/view?usp=sharing" target="blank"  rel="noopener noreferrer" className={styles.resumeBtn}>
          My Resume
        </a>
        </p>
      </div>
      <img
        src={getImageUrl("hero/Heroimage1.png")}
        alt="Hero image of me"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
