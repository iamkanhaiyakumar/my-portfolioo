import React from "react";
import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.text}>
        <h2>Contact</h2>
        <p>Feel free to reach out!</p>
      </div>

      <ul className={styles.links}>
        <li className={styles.link}>
          <img src={getImageUrl("contact/emailIcon.png")} alt="Email icon" />
          <a href="mailto:kanhaiyak0104@gmail.com">E-mail</a>
        </li>

        <li className={styles.link}>
          <img
            src={getImageUrl("contact/linkedinIcon.png")}
            alt="LinkedIn icon"
          />
          <a
            href="https://www.linkedin.com/in/kanhaiyakumar01"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </li>

        <li className={styles.link}>
          <img src={getImageUrl("contact/githubIcon.png")} alt="Github icon" />
          <a
            href="https://github.com/iamkanhaiyakumar"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
      </ul>

      {/* ✅ Copyright Section */}
      <div className={styles.copyRight}>
        <p>
          © {new Date().getFullYear()} <span>Kanhaiya Kumar</span> • All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};
