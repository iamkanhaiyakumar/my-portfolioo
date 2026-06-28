import React from "react";
import styles from "./Certificates.module.css";
import certificates from "../../data/certificates.json";
import { getImageUrl } from "../../utils";
import { motion } from "framer-motion";

export const Certificates = () => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className={styles.container}>
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.sectionTag}>🎓 Credentials</span>
        <h2 className={styles.title}>Certificates & Training</h2>
        <p className={styles.subtitle}>
          Technical courses, cloud training, and industry certifications
        </p>
      </motion.div>

      <div className={styles.grid}>
        {certificates.map((cert, index) => (
          <motion.div
            key={index}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6, boxShadow: "var(--shadow-md), 0 0 25px rgba(99, 102, 241, 0.15)" }}
          >
            <div className={styles.cardAccent}></div>
            <img
              src={getImageUrl(cert.imageSrc)}
              alt={cert.title}
              className={styles.icon}
            />
            <h3>{cert.title}</h3>
            <p className={styles.issuer}>{cert.issuer}</p>
            {cert.year && <p className={styles.detail}>Year: {cert.year}</p>}
            {cert.hours && <p className={styles.detail}>Duration: {cert.hours}</p>}

            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.button}
                onClick={(e) => {
                  if (cert.link.endsWith(".pdf") && window.showCertificate) {
                    e.preventDefault();
                    window.showCertificate(cert.link, cert.title);
                  }
                }}
              >
                View Certificate
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
