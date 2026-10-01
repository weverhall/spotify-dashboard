'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/dev.module.css';

type RotatingWordProps = {
  words: readonly string[];
  interval?: number;
};

const nextRandomIndex = (current: number, length: number) => {
  const next = Math.floor(Math.random() * (length - 1));
  return next >= current ? next + 1 : next;
};

const RotatingWord = ({ words, interval = 5000 }: RotatingWordProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (words.length < 2 || reduceMotion) return;

    const id = setInterval(() => setIndex((i) => nextRandomIndex(i, words.length)), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <>
      <span className={styles.srOnly}>{words[0]}</span>
      <span key={index} className={styles.word} aria-hidden="true">
        {words[index]}
      </span>
    </>
  );
};

export default RotatingWord;
