import { verifiedSuccessStories } from "@/data/siteData";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function SuccessStories() {
  const [index, setIndex] = useState(0);

  if (!verifiedSuccessStories.length) {
    return (
      <div className="stories-empty">
        <div className="stories-orbit" aria-hidden="true"><span /><i /><b /></div>
        <div className="stories-hologram-cube" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
        <span className="stories-icon"><ShieldCheck size={26} /></span>
        <small>Trust, without invention</small>
        <h3>Only verified client stories belong here.</h3>
        <p>We do not publish invented names, photos, outcomes, or reviews. Permissioned success stories can be added when supplied by the business; until then, ask our team for relevant references during your consultation.</p>
        <a href="#consultation">Request a consultation <ArrowRight size={16} /></a>
      </div>
    );
  }

  const story = verifiedSuccessStories[index];
  const move = (direction: number) => setIndex(current => (current + direction + verifiedSuccessStories.length) % verifiedSuccessStories.length);

  return (
    <div className="story-carousel">
      <AnimatePresence mode="wait">
        <motion.article key={story.name} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
          <Quote size={28} /><blockquote>{story.quote}</blockquote><div><img src={story.photoUrl} alt="" /><span><strong>{story.name}</strong><small>{story.outcome}</small></span></div>
        </motion.article>
      </AnimatePresence>
      <div className="carousel-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous story"><ArrowLeft size={17} /></button><span>{index + 1} / {verifiedSuccessStories.length}</span><button type="button" onClick={() => move(1)} aria-label="Next story"><ArrowRight size={17} /></button></div>
    </div>
  );
}
