import { BookOpenCheck, FileCheck2, Plane, ScanLine, Stamp } from "lucide-react";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function PortalDivider({ tone = "blue" }: { tone?: "blue" | "gold" }) {
  const portalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: portalRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.055, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.68, 1, 1, 0.68]);
  const y = useTransform(scrollYProgress, [0, 1], [18, -18]);

  return (
    <motion.div ref={portalRef} className={`scene-portal scene-portal--${tone}`} style={{ scale, rotateX, opacity, y }} aria-hidden="true">
      <div className="portal-ring portal-ring--outer" />
      <div className="portal-ring portal-ring--middle" />
      <div className="portal-ring portal-ring--inner" />
      <span>D</span><i>→</i><b>D</b>
      <em>ENTER NEXT CHAPTER</em>
    </motion.div>
  );
}

export function DestinationOrbit() {
  return (
    <div className="destination-orbit" aria-hidden="true">
      <div className="destination-orbit__sphere"><span /><i /><b /></div>
      <div className="destination-orbit__ring destination-orbit__ring--one"><span /></div>
      <div className="destination-orbit__ring destination-orbit__ring--two"><i /></div>
      <small>LIVE ROUTE MATRIX</small>
    </div>
  );
}

export function ProcessConveyor() {
  const items = [
    { label: "Profile", icon: <ScanLine size={17} /> },
    { label: "Documents", icon: <FileCheck2 size={17} /> },
    { label: "Admission", icon: <BookOpenCheck size={17} /> },
    { label: "Approval", icon: <Stamp size={17} /> },
    { label: "Departure", icon: <Plane size={17} /> },
  ];
  return (
    <div className="process-conveyor" aria-label="Animated visa preparation journey">
      <div className="conveyor-light" />
      <div className="conveyor-belt"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="conveyor-items">
        {items.map((item, index) => (
          <div key={item.label} className="conveyor-item" style={{ "--item-index": index } as CSSProperties}>
            <span>{item.icon}</span><small>{item.label}</small>
          </div>
        ))}
      </div>
      <div className="conveyor-scanner"><span /><small>QUALITY<br />SCAN</small></div>
    </div>
  );
}

export function ContactCity() {
  const buildings = [32, 58, 44, 76, 50, 92, 64, 42, 81, 55, 70, 38];
  return (
    <div className="contact-city" aria-hidden="true">
      <div className="city-sky"><span /><i /><b /></div>
      <div className="city-route city-route--one" /><div className="city-route city-route--two" />
      <div className="city-buildings">
        {buildings.map((height, index) => (
          <span key={`${height}-${index}`} style={{ "--building-height": `${height}px`, "--building-index": index } as CSSProperties}><i /><b /></span>
        ))}
      </div>
      <div className="city-pin city-pin--one"><span />ISB</div>
      <div className="city-pin city-pin--two"><span />KHI</div>
      <div className="city-pin city-pin--three"><span />LHE</div>
      <small>PAKISTAN ADVISORY NETWORK</small>
    </div>
  );
}
