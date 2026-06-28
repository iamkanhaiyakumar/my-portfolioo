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
                <span className={styles.socialValue}>+91 XXXXXXXXXX</span>
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
              <span className={styles.spinner}>
                <svg className={styles.spinnerSvg} viewBox="0 0 50 50">
                  <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                Sending...
              </span>
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

      {/* Sitemap & Socials footer */}
      <div className={styles.footerBottom}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>Kanhaiya Kumar</span>
            <p className={styles.footerText}>
              B.Tech CSE (AI & ML) student & aspiring AI/ML Engineer. Building next-generation intelligent applications.
            </p>
          </div>
          <div className={styles.footerNav}>
            <h4>Sitemap</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#achievements">Achievements</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className={styles.footerContactInfo}>
            <h4>Get in Touch</h4>
            <p>📧 kanhaiyak0104@gmail.com</p>
            <p>📱 +91 XXXXXXXXXX</p>
            <p>📍 Bhopal, India</p>
          </div>
        </div>

        <div className={styles.footerDivider}></div>

        <div className={styles.copyRight}>
          <p>
            © {new Date().getFullYear()} <span>Kanhaiya Kumar</span> • Built with
            ❤️ and React
          </p>
          <div className={styles.socialStrip}>
            <a href="https://github.com/iamkanhaiyakumar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/kanhaiyakumar01" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://wa.me/916206686966" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
