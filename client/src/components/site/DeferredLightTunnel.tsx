import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { LightTunnelProps } from "./LightTunnel";

const LightTunnel = lazy(() => import("./LightTunnel"));

export default function DeferredLightTunnel(props: LightTunnelProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={triggerRef} className="deferred-light-tunnel">
      {shouldLoad && (
        <Suspense fallback={<div className="light-tunnel-fallback" aria-hidden="true" />}>
          <LightTunnel {...props} />
        </Suspense>
      )}
    </div>
  );
}
