'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/all';
import Link from 'next/link';
import styles from './LandingPage.module.css';

gsap.registerPlugin(Flip);

const LandingPage: React.FC = () => {
  // Refs and state setup
  const gridRef = useRef<HTMLDivElement>(null);
  const fullviewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const [winsize, setWinsize] = useState({ width: 0, height: 0 });
  const [mousepos, setMousepos] = useState({ x: 0, y: 0 });

  // Grid configuration
  const numRows = 5;
  const numItemsPerRow = 7;
  const middleRowIndex = Math.floor(numRows / 2);
  const middleItemIndex = Math.floor(numItemsPerRow / 2);

  // Image paths
  const images = Array.from({ length: numRows * numItemsPerRow }, (_, i) => `/lp-images/image${(i % 20) + 1}.png`);

  // Window size and mouse position update handlers
  const updateWinsize = useCallback(() => setWinsize({ width: window.innerWidth, height: window.innerHeight }), []);
  const updateMousepos = useCallback((ev: MouseEvent) => setMousepos({ x: ev.clientX, y: ev.clientY }), []);

  // Event listeners setup
  useEffect(() => {
    updateWinsize();
    window.addEventListener('resize', updateWinsize);
    window.addEventListener('mousemove', updateMousepos);
    return () => {
      window.removeEventListener('resize', updateWinsize);
      window.removeEventListener('mousemove', updateMousepos);
    };
  }, [updateWinsize, updateMousepos]);

  // Main animation effect
  useEffect(() => {
    if (!gridRef.current) return;

    const gridRows = gridRef.current.querySelectorAll(`.${styles.row}`);
    const middleRowItemInner = gridRows[middleRowIndex].querySelectorAll(`.${styles.row__item}`)[middleItemIndex].querySelector(`.${styles.row__item_inner}`);

    // Animation parameters
    const baseAmt = 0.1;
    const minAmt = 0.05;
    const maxAmt = 0.1;

    // Initialize styles for each row
    const renderedStyles = Array.from({ length: numRows }, (_, index) => {
      const distanceFromMiddle = Math.abs(index - middleRowIndex);
      const amt = Math.max(baseAmt - distanceFromMiddle * 0.03, minAmt);
      const scaleAmt = Math.min(baseAmt + distanceFromMiddle * 0.03, maxAmt);
      return { amt, scaleAmt, translateX: { previous: 0, current: 0 }, contrast: { previous: 100, current: 100 }, brightness: { previous: 100, current: 100 } };
    });

    // Animation render loop
    let rafId: number;
    const render = () => {
      const mappedX = (((mousepos.x / winsize.width) * 2 - 1) * 40 * winsize.width) / 100;
      const mappedContrast = 100 - Math.pow(Math.abs((mousepos.x / winsize.width) * 2 - 1), 2) * (100 - 330);
      const mappedBrightness = 100 - Math.pow(Math.abs((mousepos.x / winsize.width) * 2 - 1), 2) * (100 - 15);

      gridRows.forEach((row, index) => {
        const style = renderedStyles[index];
        style.translateX.current = mappedX;
        style.contrast.current = mappedContrast;
        style.brightness.current = mappedBrightness;

        style.translateX.previous = gsap.utils.interpolate(style.translateX.previous, style.translateX.current, style.amt);
        style.contrast.previous = gsap.utils.interpolate(style.contrast.previous, style.contrast.current, style.amt);
        style.brightness.previous = gsap.utils.interpolate(style.brightness.previous, style.brightness.current, style.amt);

        gsap.set(row, {
          x: style.translateX.previous,
          filter: `contrast(${style.contrast.previous}%) brightness(${style.brightness.previous}%)`
        });
      });

      rafId = requestAnimationFrame(render);
    };

    render();

    // Fullview transition
    const enterFullview = () => {
      if (!middleRowItemInner || !fullviewRef.current || !contentRef.current || !gridRef.current) return;

      const flipstate = Flip.getState(middleRowItemInner);
      fullviewRef.current.appendChild(middleRowItemInner);

      const tl = gsap.timeline();

      tl.add(Flip.from(flipstate, {
        duration: 0.9,
        ease: "power4",
        absolute: true,
        onComplete: () => cancelAnimationFrame(rafId)
      }))
        .to(gridRef.current, {
          duration: 0.9,
          ease: "power4",
          opacity: 0.01
        }, 0)
        .to(middleRowItemInner.querySelector(`.${styles.row__item_img}`), {
          scale: 1.2,
          duration: 3,
          ease: "sine"
        }, "<-=0.45")
        .to(contentRef.current, {
          y: '-30vh',
          duration: 0.9,
          ease: "power4"
        });

      if (enterButtonRef.current) {
        enterButtonRef.current.classList.add(styles.hidden);
      }
      document.body.classList.remove(styles.noscroll);
    };

    // Button event listener
    const enterButton = enterButtonRef.current;
    if (enterButton) {
      enterButton.addEventListener('click', enterFullview);
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      if (enterButton) {
        enterButton.removeEventListener('click', enterFullview);
      }
    };
  }, [mousepos, winsize]);

  return (
    
    <div className={styles.app}>
        
      <main>
        <section className={styles.intro}>

          <div className={styles.grid} ref={gridRef}>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
              <div className={styles.row} key={rowIndex}>
                {Array.from({ length: numItemsPerRow }).map((_, itemIndex) => (
                  <div className={styles.row__item} key={itemIndex}>
                    <div className={styles.row__item_inner}>
                      <div
                        className={`${styles.row__item_img} ${rowIndex === middleRowIndex && itemIndex === middleItemIndex ? styles.row__item_img_large : ''}`}
                        style={{ 
                          backgroundImage: `url(${images[rowIndex * numItemsPerRow + itemIndex]})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.fullview} ref={fullviewRef}></div>
        </section>
        <section className={styles.content} ref={contentRef}>
          <div className={styles.content__nav}>
            <Link href="/dashboard">
              <button className={styles.enter}>Go to Dashboard</button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;