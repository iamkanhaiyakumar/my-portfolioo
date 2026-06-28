import React, { useEffect } from "react";
import styles from "./Modal.module.css";

export const Modal = ({ isOpen, onClose, pdfUrl, title }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title || "Certificate View"}</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* PDF Content */}
        <div className={styles.body}>
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            title={title || "PDF Viewer"}
            className={styles.iframe}
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
