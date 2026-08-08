import { motion } from "framer-motion";
import { CheckCircle2, Plane, Stamp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const routeDots = [
  { left: "23%", top: "35%", delay: 0 },
  { left: "64%", top: "27%", delay: 0.8 },
  { left: "72%", top: "60%", delay: 1.6 },
  { left: "38%", top: "67%", delay: 2.4 },
];

const particles = [
  ["10%", "18%", "0s"], ["88%", "16%", "1.2s"], ["93%", "48%", "2.4s"], ["83%", "84%", ".7s"],
  ["18%", "85%", "1.8s"], ["4%", "54%", "3s"], ["72%", "6%", "2.1s"], ["48%", "94%", ".3s"],
];

export function AtlasGlobe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let inViewport = true;
    const update = () => setIsActive(inViewport && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      update();
    }, { threshold: 0.02 });
    observer.observe(stage);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={stageRef} className={`atlas-stage${isActive ? "" : " atlas-stage--paused"}`} aria-label="Animated global destination network">
      <div className="atlas-particles" aria-hidden="true">
        {particles.map(([left, top, delay]) => <i key={`${left}-${top}`} style={{ left, top, animationDelay: delay }} />)}
      </div>
      <div className="atlas-halo" />
      <div className="atlas-orbit atlas-orbit--one"><span className="orbit-plane"><Plane size={18} /></span></div>
      <div className="atlas-orbit atlas-orbit--two"><span className="orbit-plane orbit-plane--secondary"><Plane size={13} /></span><i /></div>
      <motion.div
        className="atlas-sphere"
        initial={{ opacity: 0, scale: 0.92, rotateY: -18 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.15, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="sphere-grid sphere-grid--latitude" />
        <div className="sphere-grid sphere-grid--longitude" />
        <svg className="sphere-land" viewBox="0 0 420 420" aria-hidden="true">
          <g className="sphere-land-track">
            {[0, 420].map(offset => (
              <g key={offset} transform={`translate(${offset} 0)`}>
                <path d="M62 145c25-13 47-38 73-38 18 0 26 19 43 20 15 1 30-14 45-8 11 5 8 18 18 24 12 7 31-4 40 7 12 14-6 31-2 48 3 14 25 20 22 35-3 17-25 17-37 29-14 14-11 39-27 49-14 9-33-4-48-1-21 4-36 31-58 24-16-5-11-28-23-39-12-11-36-5-44-20-9-17 14-34 12-53-2-16-29-25-14-42Z" />
                <path d="M278 83c22-8 50 4 62 25 8 14-3 29 6 42 8 12 29 15 30 29 1 18-28 20-39 34-10 12-5 32-19 40-11 6-22-5-34-3-13 3-23 18-36 14-16-5-20-25-17-41 3-14 19-23 20-38 1-15-14-28-9-43 5-16 21-24 36-29Z" />
                <path d="M254 286c17-7 38 3 47 18 7 12 0 27 8 38 7 9 24 13 23 25-1 14-20 18-33 18-16 1-33-2-43-14-9-11-7-27-15-39-6-9-19-16-15-27 4-10 17-14 28-19Z" />
              </g>
            ))}
          </g>
          <g className="route-network">
            <path d="M88 182C150 108 242 111 333 174" />
            <path d="M112 286C190 225 248 245 319 308" />
            <path d="M165 102C190 187 253 238 331 256" />
          </g>
        </svg>
        {routeDots.map(dot => (
          <span key={`${dot.left}-${dot.top}`} className="route-dot" style={{ left: dot.left, top: dot.top, animationDelay: `${dot.delay}s` }} />
        ))}
        <div className="sphere-shine" />
      </motion.div>

      <motion.div
        className="passport-card"
        initial={{ opacity: 0, y: 30, rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 4 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="passport-top"><span>PASSPORT</span><small>D2D</small></div>
        <div className="passport-emblem"><span>✦</span><i /><b>✦</b></div>
        <div className="passport-bottom"><span>WORLD</span><small>READY</small></div>
      </motion.div>

      <motion.div
        className="approval-chip"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.75, duration: 0.7 }}
      >
        <CheckCircle2 size={18} />
        <span><small>File status</small>Ready for review</span>
      </motion.div>

      <motion.div
        className="visa-stamp"
        initial={{ opacity: 0, scale: 0.94, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={{ delay: 0.95, duration: 0.55 }}
      >
        <Stamp size={24} /><span>Destination<br />approved</span>
      </motion.div>
    </div>
  );
}
