import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}

// Ease out cubic for smooth deceleration
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const useAnimatedCounter = (
  endValue: number,
  options: UseAnimatedCounterOptions = {}
) => {
  const { duration = 1500, delay = 0, easing = easeOutCubic } = options;
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        
        setCount(Math.floor(easedProgress * endValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [hasStarted, endValue, duration, delay, easing]);

  return { count, ref: elementRef };
};

export default useAnimatedCounter;
