'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import Lenis from '@studio-freight/lenis';
import Chat from '@/components/Chat';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import './LandingPage.css';

gsap.registerPlugin(Flip);

const LandingPage = () => {
  const gridRef = useRef(null);
  const fullviewRef = useRef(null);
  const contentRef = useRef(null);
  const enterButtonRef = useRef(null);
  const [winsize, setWinsize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [mousepos, setMousepos] = useState({ x: winsize.width / 2, y: winsize.height / 2 });

  const config = {
    translateX: true,
    skewX: false,
    contrast: true,
    scale: false,
    brightness: true
  };

  const numRows = 3;
  const numItemsPerRow = 5;
  const middleRowIndex = Math.floor(numRows / 2);
  const middleItemIndex = Math.floor(numItemsPerRow / 2);

  const images = Array.from({ length: numRows * numItemsPerRow }, (_, i) => `/lp-images/image${i + 1}.png`);

  useEffect(() => {
    const updateWinsize = () => {
      setWinsize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateWinsize);
    window.addEventListener('mousemove', (ev) => {
      setMousepos({ x: ev.clientX, y: ev.clientY });
    });

    const lenis = new Lenis({ lerp: 0.15 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('resize', updateWinsize);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const gridRows = gridRef.current.querySelectorAll('.row');
    const middleRowItemInner = gridRows[middleRowIndex].querySelectorAll('.row__item')[middleItemIndex].querySelector('.row__item-inner');

    const baseAmt = 0.1;
    const minAmt = 0.05;
    const maxAmt = 0.1;

    const renderedStyles = Array.from({ length: numRows }, (_, index) => {
      const distanceFromMiddle = Math.abs(index - middleRowIndex);
      const amt = Math.max(baseAmt - distanceFromMiddle * 0.03, minAmt);
      const scaleAmt = Math.min(baseAmt + distanceFromMiddle * 0.03, maxAmt);
      return { amt, scaleAmt, translateX: { previous: 0, current: 0 }, contrast: { previous: 100, current: 100 }, brightness: { previous: 100, current: 100 } };
    });

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

      requestAnimationFrame(render);
    };

    const renderRef = requestAnimationFrame(render);

    const enterFullview = () => {
      const flipstate = Flip.getState(middleRowItemInner);
      fullviewRef.current.appendChild(middleRowItemInner);

      const tl = gsap.timeline();

      tl.add(Flip.from(flipstate, {
        duration: 0.9,
        ease: "power4",
        absolute: true,
        onComplete: () => cancelAnimationFrame(renderRef)
      }))
        .to(gridRef.current, {
          duration: 0.9,
          ease: "power4",
          opacity: 0.01
        }, 0)
        .to(middleRowItemInner.querySelector('.row__item-img'), {
          scale: 1.2,
          duration: 3,
          ease: "sine"
        }, "<-=0.45")
        .to(contentRef.current, {
          y: '-50vh',
          duration: 0.9,
          ease: "power4"
        });

      enterButtonRef.current.classList.add("hidden");
      document.body.classList.remove("noscroll");
    };

    enterButtonRef.current.addEventListener('click', enterFullview);

    return () => {
      cancelAnimationFrame(renderRef);
      enterButtonRef.current.removeEventListener('click', enterFullview);
    };
  }, [mousepos, winsize]);

  return (
    <div className="app">
      <main>
        <section className="intro">
          <div className="grid" ref={gridRef}>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
              <div className="row" key={rowIndex}>
                {Array.from({ length: numItemsPerRow }).map((_, itemIndex) => (
                  <div className="row__item" key={itemIndex}>
                    <div className="row__item-inner">
                      <div
                        className={`row__item-img ${rowIndex === middleRowIndex && itemIndex === middleItemIndex ? 'row__item-img--large' : ''}`}
                        style={{ 
                          backgroundImage: `url(${images[rowIndex * numItemsPerRow + itemIndex]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="fullview" ref={fullviewRef}></div>
          <Card className="enter-card">
            <CardContent>
              <Button className="enter" ref={enterButtonRef}>Explore</Button>
            </CardContent>
          </Card>
        </section>
        <section className="content" ref={contentRef}>
          <div className="content__header">
            <h2>Projects</h2>
          </div>
          <div className="content__text">
            <p className="right">To <strong>accomplish </strong>great things, we must not only act, but also <strong>dream</strong>; not only <strong> plan</strong>, but also <strong>believe</strong>. <br />Creating, learning, and setting goals are fundamental pillars for personal and professional growth. Engaging in continuous creation fosters innovation and keeps the mind active, allowing individuals to explore new ideas and express their unique perspectives. Learning, on the other hand, expands our knowledge base and equips us with the skills necessary to navigate an ever-evolving world. </p>
            <p className="highlight">What you get by achieving your goals is not as important as what you become by achieving your goals.</p>
            <Card className="links-card">
              <CardContent>
                <Link href="/about">
                  <Button>About Us</Button>
                </Link>
                <Link href="/services">
                  <Button>Our Services</Button>
                </Link>
                <Link href="/contact">
                  <Button>Contact</Button>
                </Link>
              </CardContent>
            </Card>
            <p>We are what we repeatedly do. Excellence, then, is not an act, but a habit. It is through learning that we adapt to new challenges and stay relevant in our fields. Setting goals provides direction and motivation, transforming abstract aspirations into achievable milestones. Goals keep us focused, ensuring that our efforts are aligned with our long-term vision. Together, creating, learning, and setting goals form a dynamic cycle of growth that propels us forward, enabling us to reach our fullest potential and make meaningful contributions to the world around us.</p>
          </div>
        </section>
      </main>
      <Chat />
    </div>
  );
};

export default LandingPage;