import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2, ChevronLeft, ChevronRight, Filter,
  Gauge, Settings, ShieldCheck, Wind,
} from 'lucide-react';
import promoSlides from '../data/promoSlides';

const AUTOPLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 45;

const benefitIcons = {
  check: CheckCircle2,
  filter: Filter,
  gauge: Gauge,
  settings: Settings,
  shield: ShieldCheck,
  wind: Wind,
};

export default function PromoHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerVersion, setTimerVersion] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return undefined;
    const timer = window.setTimeout(() => {
      setActiveIndex(index => (index + 1) % promoSlides.length);
    }, AUTOPLAY_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, prefersReducedMotion, timerVersion]);

  const navigateTo = index => {
    setActiveIndex((index + promoSlides.length) % promoSlides.length);
    setTimerVersion(version => version + 1);
  };

  const handleTouchStart = event => {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = event => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    navigateTo(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  return (
    <section
      className={`promo-hero${prefersReducedMotion ? ' promo-hero--reduced-motion' : ''}`}
      aria-label="Featured automotive promotions"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="promo-hero__track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {promoSlides.map((slide, index) => (
          <article
            className={`promo-slide promo-slide--${slide.theme}`}
            key={slide.id}
            aria-hidden={index !== activeIndex}
          >
            <div className="container promo-hero__inner">
              <div className="promo-hero__copy">
                <span className="promo-hero__badge">{slide.badge}</span>
                <h1>{slide.title}<strong>{slide.highlight}</strong></h1>
                <div className="promo-hero__benefits">
                  {slide.benefits.map(benefit => {
                    const Icon = benefitIcons[benefit.icon] || CheckCircle2;
                    return (
                      <div className="promo-benefit" key={benefit.lines.join('-')}>
                        <span><Icon size={25} /></span>
                        <p>{benefit.lines[0]}<br />{benefit.lines[1]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`promo-hero__products promo-hero__products--${slide.theme}`} aria-hidden="true">
                {slide.images.map(image => (
                  <img
                    className={`promo-product ${image.className}`}
                    src={image.src}
                    alt=""
                    key={`${slide.id}-${image.src}-${image.className}`}
                    draggable="false"
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        className="promo-hero__arrow promo-hero__arrow--previous"
        type="button"
        aria-label="Previous slide"
        onClick={() => navigateTo(activeIndex - 1)}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        className="promo-hero__arrow promo-hero__arrow--next"
        type="button"
        aria-label="Next slide"
        onClick={() => navigateTo(activeIndex + 1)}
      >
        <ChevronRight aria-hidden="true" />
      </button>

      <div className="promo-hero__pagination" aria-label="Choose promotional slide">
        {promoSlides.map((slide, index) => (
          <button
            className={index === activeIndex ? 'is-active' : ''}
            type="button"
            aria-label={`Show slide ${index + 1}: ${slide.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => navigateTo(index)}
            key={slide.id}
          />
        ))}
      </div>

      <span className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {promoSlides.length}: {promoSlides[activeIndex].title}
      </span>
    </section>
  );
}
