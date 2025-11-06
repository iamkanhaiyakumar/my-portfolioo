import React from "react";
import styles from "./WhatsAppButton.module.css";
import { getImageUrl } from "../../utils";

export const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    // Replace with your WhatsApp number (with country code)
    window.open("https://wa.me/916206686966", "_blank");
  };

  return (
    <button className={styles.whatsappBtn} onClick={handleWhatsAppClick}>
      <img
        src={getImageUrl("contact/whatsappIcon.png")}
        alt="WhatsApp"
        className={styles.whatsappIcon}
      />
    </button>
  );
};
