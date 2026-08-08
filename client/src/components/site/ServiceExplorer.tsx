import { services, type Service } from "@/data/siteData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import type { MouseEvent } from "react";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Plane,
  BriefcaseBusiness,
  Building2,
  HeartHandshake,
  Landmark,
  BookOpenCheck,
  FileCheck2,
};

export function ServiceExplorer() {
  const [selected, setSelected] = useState<Service | null>(null);

  const tiltCard = (event: MouseEvent<HTMLButtonElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 9}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 10}deg`);
    card.style.setProperty("--glare-x", `${x * 100}%`);
    card.style.setProperty("--glare-y", `${y * 100}%`);
  };

  const resetTilt = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <>
      <div className="service-grid">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon] ?? FileCheck2;
          return (
            <motion.button
              type="button"
              key={service.id}
              className="service-card"
              onClick={() => setSelected(service)}
              onMouseMove={tiltCard}
              onMouseLeave={resetTilt}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ delay: (index % 4) * 0.055, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -7 }}
            >
              <span className="service-surface">
                <span className="service-index">0{index + 1}</span>
                <span className="service-icon"><Icon size={25} strokeWidth={1.6} /></span>
                <span className="service-copy">
                  <strong>{service.title}</strong>
                  <small>{service.short}</small>
                </span>
                <span className="service-link">Explore service <ArrowRight size={15} /></span>
                <span className="service-particles" aria-hidden="true">{Array.from({ length: 7 }, (_, particle) => <i key={particle} />)}</span>
                <span className="service-glare" />
                <span className="service-glow" />
              </span>
            </motion.button>
          );
        })}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="service-modal sm:max-w-3xl">
          {selected && (
            <div className="service-modal-grid">
              <div className="service-modal-aside">
                <span className="modal-kicker">Advisory service</span>
                <span className="modal-icon">
                  {(() => {
                    const Icon = iconMap[selected.icon] ?? FileCheck2;
                    return <Icon size={32} strokeWidth={1.5} />;
                  })()}
                </span>
                <p>{selected.bestFor}</p>
                <a href="#consultation" onClick={() => setSelected(null)}>
                  Discuss this route <ArrowRight size={16} />
                </a>
              </div>
              <div className="service-modal-main">
                <DialogHeader>
                  <DialogTitle>{selected.title}</DialogTitle>
                  <DialogDescription>{selected.description}</DialogDescription>
                </DialogHeader>
                <div className="modal-columns">
                  <div>
                    <h4>What we can cover</h4>
                    <ul>{selected.highlights.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>
                  </div>
                  <div>
                    <h4>A clear route forward</h4>
                    <ol>{selected.steps.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol>
                  </div>
                </div>
                <p className="modal-note">Route availability and requirements depend on your profile and current government rules. A consultation is required before any recommendation.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
