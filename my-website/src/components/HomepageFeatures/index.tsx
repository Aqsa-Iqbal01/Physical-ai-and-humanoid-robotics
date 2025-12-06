import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  img: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Structured Book Chapters',
    img: '/img/features/chapters.png',
    description: (
      <>
        Explore well-organized chapters with illustrations, explanations, and
        real-world AI examples. Each chapter is optimized for clarity and learning.
      </>
    ),
  },
  {
    title: 'Built-in RAG Chatbot',
    img: '/img/features/chatbot.png',
    description: (
      <>
        Ask questions anywhere in the book. The integrated RAG-powered chatbot
        answers using only the content of your book — fast, accurate, interactive.
      </>
    ),
  },
  {
    title: 'AI-Driven Learning Experience',
    img: '/img/features/ai.png',
    description: (
      <>
        Your book is enhanced with intelligent search, contextual help, and
        auto-summaries to improve understanding and retention.
      </>
    ),
  },
];

function Feature({ title , description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
     

      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
