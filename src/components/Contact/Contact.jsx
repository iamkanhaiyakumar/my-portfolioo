import React, { useState } from "react";
import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(""); // "", "success", "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");

    try {
      // Web3Forms — free email API (no signup needed for basic usage)
      // To receive emails, create a free access key at https://web3forms.com
      // and replace the key below
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "41eac6b5-c801-4264-93a4-13bea84a60c4",
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "Portfolio Contact Form",
          message: formData.message,
          from_name: "Portfolio Contact",
          to_email: "kanhaiyak0104@gmail.com",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // Fallback: open mailto if Web3Forms key isn't set
        const mailtoLink = `mailto:kanhaiyak0104@gmail.com?subject=${encodeURIComponent(
          formData.subject || "Portfolio Contact"
        )}&body=${encodeURIComponent(
          `From: ${formData.name} (${formData.email})\n\n${formData.message}`
        )}`;
        window.location.href = mailtoLink;
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      // Fallback to mailto on any error
      const mailtoLink = `mailto:kanhaiyak0104@gmail.com?subject=${encodeURIComponent(
        formData.subject || "Portfolio Contact"
      )}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } finally {
      setSending(false);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.inner}>
        {/* Left Column */}
        <div className={styles.infoColumn}>
          <span className={styles.sectionTag}>📬 Get In Touch</span>
          <h2 className={styles.heading}>
            Let's Work <br />
            <span className={styles.gradientWord}>Together</span>
          </h2>
          <p className={styles.tagline}>
            Have a project in mind, want to collaborate, or just want to say
            hello? Drop me a message and I'll get back to you!
          </p>

          {/* Social Links */}
          <div className={styles.socials}>
            <a
              href="mailto:kanhaiyak0104@gmail.com"
              className={styles.socialLink}
            >
              <div className={styles.socialIcon}>
                <img src={getImageUrl("contact/emailIcon.png")} alt="Email" />
              </div>
              <div>
                <span className={styles.socialLabel}>Email</span>
                <span className={styles.socialValue}>
                  kanhaiyak0104@gmail.com
                </span>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/kanhaiyakumar01"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <div className={styles.socialIcon}>
                <img
                  src={getImageUrl("contact/linkedinIcon.png")}
                  alt="LinkedIn"
                />
              </div>
              <div>
                <span className={styles.socialLabel}>LinkedIn</span>
                <span className={styles.socialValue}>kanhaiyakumar01</span>
              </div>
            </a>

            <a
              href="https://github.com/iamkanhaiyakumar"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <div className={styles.socialIcon}>
                <img
                  src={getImageUrl("contact/githubIcon.png")}
                  alt="GitHub"
                />
              </div>
              <div>
                <span className={styles.socialLabel}>GitHub</span>
                <span className={styles.socialValue}>iamkanhaiyakumar</span>
              </div>
            </a>

            <a
              href="https://wa.me/916206686966"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <div className={styles.socialIcon}>
                <span style={{ fontSize: "20px" }}>📱</span>
              </div>
              <div>
                <span className={styles.socialLabel}>WhatsApp</span>
                <span className={styles.socialValue}>+91 6206686966</span>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column — Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Send me a message</h3>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="contact-email">Your Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              placeholder="Project Collaboration"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Tell me about your project or idea..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className={styles.successMsg}>
              ✅ Message sent successfully! I'll get back to you soon.
            </div>
          )}
          {status === "error" && (
            <div className={styles.errorMsg}>
              ❌ Something went wrong. Please try again or email directly.
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={sending}
          >
            {sending ? (
              <span className={styles.spinner}>⏳ Sending...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </form>
      </div>

      {/* Copyright */}
      <div className={styles.copyRight}>
        <p>
          © {new Date().getFullYear()} <span>Kanhaiya Kumar</span> • Built with
          ❤️ and React
        </p>
      </div>
    </footer>
  );
};
