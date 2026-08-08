import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/*
 * PointerAura
 *
 * The old version created a large mouse-following glow.
 * Since that was causing the cursor to feel buggy/laggy,
 * we completely disable it.
 *
 * The normal browser cursor will be used.
 */
export function PointerAura() {
  return null;
}


/*
 * JourneyRail
 *
 * Creates the vertical progress indicator on the side
 * of the website while the user scrolls.
 */
export function JourneyRail() {
  const { scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3,
  });

  const markerPosition = useTransform(
    progress,
    [0, 1],
    ["0%", "100%"]
  );

  return (
    <div className="journey-rail" aria-hidden="true">
      <span>ISB</span>

      <div className="journey-rail-track">
        <motion.i
          style={{
            scaleY: progress,
            transformOrigin: "top",
          }}
        />

        <motion.b
          style={{
            top: markerPosition,
          }}
        />
      </div>

      <span>WORLD</span>
    </div>
  );
}


/*
 * AnimatedCounter
 *
 * Animates numbers when they enter the viewport.
 *
 * Example:
 * value="10+"
 *
 * Displays:
 * 0 → 1 → 2 → ... → 10+
 */
export function AnimatedCounter({
  value,
}: {
  value: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const inView = useInView(ref, {
    once: true,
    margin: "-80px",
  });

  const numericValue = Number(
    value.replace(/[^0-9.]/g, "")
  );

  const suffix = value.replace(/[0-9,.]/g, "");

  const motionValue = useMotionValue(0);

  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

    const controls = animate(
      motionValue,
      numericValue,
      {
        duration: 1.65,
        ease: [0.23, 1, 0.32, 1],

        onUpdate: (latest) => {
          setDisplay(
            Math.round(latest).toLocaleString()
          );
        },
      }
    );

    return () => {
      controls.stop();
    };
  }, [
    inView,
    motionValue,
    numericValue,
  ]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}