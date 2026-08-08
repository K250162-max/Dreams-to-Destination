import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CheckCircle2, Stamp } from "lucide-react";
import { AtlasGlobe } from "./AtlasGlobe";

const CinematicGlobeCanvas = lazy(() => import("./CinematicGlobeCanvas"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function CinematicGlobeStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [canRender, setCanRender] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanRender(!reducedMotion && supportsWebGL());
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.01 });
    observer.observe(stage);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  if (!canRender) return <AtlasGlobe />;

  return (
    <div ref={stageRef} className="cinematic-globe-stage">
      <Suspense fallback={<AtlasGlobe />}>
        <CinematicGlobeCanvas active={active} />
        <div className="cinematic-lens cinematic-lens--one" aria-hidden="true" />
        <div className="cinematic-lens cinematic-lens--two" aria-hidden="true" />
        <div className="passport-card cinematic-passport" aria-hidden="true">
          <div className="passport-top"><span>PASSPORT</span><small>D2D</small></div>
          <div className="passport-emblem"><span>✦</span><i /><b>✦</b></div>
          <div className="passport-bottom"><span>WORLD</span><small>READY</small></div>
        </div>
        <div className="approval-chip cinematic-approval"><CheckCircle2 size={18} /><span><small>Live route scan</small>Destinations connected</span></div>
        <div className="visa-stamp cinematic-stamp"><Stamp size={24} /><span>Journey<br />authorized</span></div>
      </Suspense>
    </div>
  );
}
