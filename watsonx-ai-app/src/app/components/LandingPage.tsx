'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setTargetPos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  useEffect(() => {
    if (!gridRef.current) return;

    const grid = gridRef.current;
    const items = Array.from(grid.children) as HTMLElement[];
    const rows = 5;
    const cols = 7;

    let animationFrameId: number;

    const animate = () => {
      setMousePos(prevPos => ({
        x: lerp(prevPos.x, targetPos.x, 0.1),
        y: lerp(prevPos.y, targetPos.y, 0.1)
      }));

      const { x, y } = mousePos;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      items.forEach((item, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const itemX = (col + 0.5) * (window.innerWidth / cols);
        const itemY = (row + 0.5) * (window.innerHeight / rows);

        const distX = x - itemX;
        const distY = y - itemY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

        const scale = 1 + (1 - Math.min(distance / maxDistance, 1)) * 0.2;
        const translateX = distX * 0.02;
        const translateY = distY * 0.02;

        item.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        item.style.opacity = (1 - distance / maxDistance).toString();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos, targetPos]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className="flex items-center">
          <span className="w-11 h-11 bg-blue-500 rounded-lg flex items-center justify-center text-xl font-bold mr-3">
            <Image
              src="/granix5.png"
              alt="Granite"
              width={40}
              height={40}
            />
          </span>
          <span className="app-name">granix</span>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.hero}>
            <h2 className={`${styles.hero_title} flex items-center`}>
              <span className="app-name font-extrabold text-3xl">manage</span>
              <span className="app-name font-extrabold text-7xl text-white ml-2">PROJECTS</span>
              <span className="w-11 h-11 bg-blue-500 rounded-lg flex items-center justify-center text-xl font-bold ml-3">
                <Image
                  src="/granix5.png"
                  alt="Granite"
                  width={40}
                  height={40}
                />
              </span>
            </h2>
            <p className={styles.hero_description}>
              <span>Elevate your coding projects with </span><span className='app-name'>granix</span>, powered by IBM&apos;s Granite models. Seamlessly integrate AI-driven insights, collaborative tools, and intuitive project management to revolutionize your development workflow.
            </p>
            
            <div className={styles.cta_container}>
              <Link href="/dashboard">
                <button className={styles.cta_button}>Try Now</button>
              </Link>
              <Link href="/about">
                <button className={styles.cta_button_secondary}>About</button>
              </Link>
            </div>
          </div>
          <div className={styles.image_grid}>
            <Image src="/cloud.svg" alt="Cloud" width={100} height={100} />
            <Image src="/tags.svg" alt="Tags" width={100} height={100} />
            <Image src="/apps.svg" alt="Apps" width={100} height={100} />
            <Image src="/folder.svg" alt="Folder" width={100} height={100} />
          </div>
        </div>
        <div className={styles.grid} ref={gridRef}>
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className={styles.grid_item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;