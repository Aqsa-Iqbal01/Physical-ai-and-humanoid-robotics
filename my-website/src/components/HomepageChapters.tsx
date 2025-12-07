import React from 'react';
import Link from '@docusaurus/Link';

import styles from './HomepageChapters.module.css';

export default function HomepageChapters() {
  const chapters = [
    {
      title: "Introduction Physical AI",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 01 Introduction to physical ai and humanoid robotics",
    },
    {
      title: "Historical context & evo",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 02 Historical context and evolution",
    },
    {
      title: "Kinematics and dynamics",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 03 Kinematics and dynamics",
    },
    {
      title: "Control system actuation",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 04 Control systems and actuation",
    },
     {
      title: "Leading humanoid robot",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 05 Leading humanoid robot platforms",
    },
    {
      title: "Perception systems",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 06 Perception systems",
    },
    {
      title: "Real world applications",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 07 Real world applications",
    },
     {
      title: "Robot adaptation",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 08 Robot learning and adaptation",
    },
    {
      title: "Ethical considerations",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 09 Ethical considerations",
    },
    {
      title: "AI for decision making",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 10 AI for decision making",
    },
     {
      title: "Future trends research",
      img: "/img/robo.avif",
      link: "/docs/chapters/Chapter 01 Introduction to physical ai and humanoid robotics",
    },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
         {/* Render the Chat component here */}
        <h2 className={styles.heading}>📘 Explore Chapters</h2>

        <div className={styles.grid}>
          {chapters.map((chapter, index) => (
            <div key={index} className={styles.card}>
              
              {/* Image */}
              <div className={styles.imageWrapper}>
                <img
                  src={chapter.img}
                  alt={chapter.title}
                  className={styles.image}
                />
              </div>

              {/* Title */}
              <h3 className={styles.title}>{chapter.title}</h3>

              

              {/* Button */}
              <Link className={styles.button} to={chapter.link}>
                Read Chapter →
              </Link>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
