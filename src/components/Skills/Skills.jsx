import React from "react";
import styles from "./Skills.module.css";
import skills from "../../data/skills.json";
import { getImageUrl } from "../../utils";

export const Skills = () => {
  const mid = Math.ceil(skills.length / 2);
  const firstHalf = skills.slice(0, mid);
  const secondHalf = skills.slice(mid);

  return (
    <section className={styles.container} id="skills">
      <h2 className={styles.title}>Skills</h2>

      <div className={styles.skillsContainer}>
        {/* ====================== ROW 1 (Left → Right) ====================== */}
        <div className={`${styles.skills} ${styles.row1}`}>
          {[...firstHalf, ...firstHalf].map((skill, id) => (
            <div key={id} className={styles.skill}>
              <a
                href={skill.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.skillLink}
              >
                <div className={styles.skillImageContainer}>
                  <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
                </div>
              </a>
              <p>{skill.title}</p>
            </div>
          ))}
        </div>

        {/* ====================== ROW 2 (Right → Left) ====================== */}
        <div className={`${styles.skills} ${styles.row2}`}>
          {[...secondHalf, ...secondHalf].map((skill, id) => (
            <div key={id} className={styles.skill}>
              <a
                href={skill.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.skillLink}
              >
                <div className={styles.skillImageContainer}>
                  <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
                </div>
              </a>
              <p>{skill.title}</p>
            </div>
          ))}
        </div>

        {/* ====================== ROW 3 (Left → Right OR opposite) ====================== */}
        {/* <div className={`${styles.skills} ${styles.row3}`}>
        {[...secondHalf, ...secondHalf].map((skill, id) => (
          <div key={id} className={styles.skill}>
            <a
              href={skill.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.skillLink}
            >
              <div className={styles.skillImageContainer}>
                <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
              </div>
            </a>
            <p>{skill.title}</p>
          </div>
        ))}
      </div> */}
      </div>
    </section>
  );
};

//
// import React from "react";
// import styles from "./Skills.module.css";
// import skills from "../../data/skills.json";
// import { getImageUrl } from "../../utils";

// export const Skills = () => {
//   return (
//     <section className={styles.container} id="skills">
//       <h2 className={styles.title}>Skills</h2>

//       <div className={styles.skillsContainer}>
//         <div className={styles.skills}>
//           {skills.map((skill, id) => (
//             <div key={id} className={styles.skill}>
//               <a
//                 href={skill.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={styles.skillLink}
//               >
//                 <div className={styles.skillImageContainer}>
//                   <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
//                 </div>
//               </a>
//               <p>{skill.title}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
// //

// @import "../../vars.css";

// /* ===== Container ===== */
// .container {
//   color: var(--color-text);
//   margin: 80px 10%;
//   text-align: center;
//   animation: fadeIn 0.8s ease-in-out;
// }

// /* ===== Title ===== */
// .title {
//   color: var(--color-text);
//   font-size: 38px;
//   font-weight: 800;
//   letter-spacing: 2px;
//   text-transform: uppercase;
//   margin-bottom: 40px;
//   position: relative;
// }

// .title::after {
//   content: "";
//   display: block;
//   width: 80px;
//   height: 4px;
//   background: var(--color-primary);
//   margin: 14px auto 0;
//   border-radius: 4px;
// }

// /* ===== Skills Grid ===== */
// .skillsContainer {
//   width: 100%;
//   margin-top: 20px;
// }

// .skills {
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
//   gap: 40px;
//   justify-items: center;
//   align-items: center;
//   margin-top: 30px;
//   width: 100%;
//   margin-bottom: 80px;
// }

// /* ===== Skill Card ===== */
// .skill {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 10px;
//   transition: transform 0.3s ease, box-shadow 0.3s ease;
// }

// .skill:hover {
//   transform: translateY(-10px);
//   box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
// }

// /* ===== Skill Icon ===== */
// .skillImageContainer {
//   background-color: var(--color-secondary);
//   border-radius: 50%;
//   width: 120px;
//   height: 120px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: background-color 0.3s ease, transform 0.3s ease;
// }

// .skillImageContainer img {
//   width: 75px;
//   height: 75px;
//   object-fit: contain;
// }

// .skillImageContainer:hover {
//   background-color: var(--color-primary);
//   transform: scale(1.15);
//   cursor: pointer;
// }

// /* ===== Title under icon ===== */
// .skill p {
//   font-size: 20px;
//   font-family: var(--font-roboto);
//   font-weight: 500;
//   color: var(--color-text);
// }

// /* ===== Skill Link Hover ===== */
// .skillLink {
//   display: inline-block;
//   transition: transform 0.3s ease;
// }

// .skillLink:hover {
//   transform: scale(1.1);
//   cursor: pointer;
// }

// /* ===== Responsive: Medium Screens ===== */
// @media screen and (max-width: 768px) {
//   .skills {
//     grid-template-columns: repeat(2, 1fr);
//     gap: 30px;
//   }

//   .skillImageContainer {
//     width: 100px;
//     height: 100px;
//   }

//   .skillImageContainer img {
//     width: 60px;
//     height: 60px;
//   }
// }

// /* ===== Responsive: Small Screens ===== */
// @media screen and (max-width: 300px) {
//   .skills {
//     grid-template-columns: 1fr;
//     gap: 25px;
//   }
// }

// /* ===== Animation ===== */
// @keyframes fadeIn {
//   from {
//     opacity: 0;
//     transform: translateY(30px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
