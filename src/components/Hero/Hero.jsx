import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Kanhaiya </h1>
        
        <p className={styles.description}>
          I'm a frontend developer with 1 years of experience using HTML, CSS, TailWind, JavaScript and React. 
          Reach out if you would like to learn more!
        </p>
        {/* <p className={styles.socialLinks}>
        <img
            src={getImageUrl("contact/linkedinIcon.png")}
            alt="LinkedIn icon"
          />
          <a href="https://www.linkedin.com/in/kanhaiyakumar01">Linked</a>
          <img src={getImageUrl("contact/githubIcon.png")} alt="Github icon" />
          <a href="https://github.com/iamkanhaiyakumar"></a>
          </p> */}
          <p className="btn">
        <a href="mailto:kanhaiyak0104@gmail.com" className={styles.contactBtn}>
          Contact Me
        </a>
        <a href="https://drive.google.com/file/d/1PVvgTZ91y5TQyor0zLcoEaPXeFv52DMd/view?usp=drivesdk" target="blank" className={styles.resumeBtn}>
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
