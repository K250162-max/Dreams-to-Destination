import { destinations } from "@/data/siteData";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Clock3, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

const regions = ["All", "Americas", "Europe", "Oceania", "Middle East", "Asia"] as const;
const routeOptions = ["All routes", "Study", "Visit", "Work", "PR", "Family", "Business"];

export function DestinationExplorer() {
  const [region, setRegion] = useState<(typeof regions)[number]>("All");
  const [route, setRoute] = useState("All routes");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    return destinations.filter(destination => {
      const regionMatch = region === "All" || destination.region === region;
      const routeMatch = route === "All routes" || destination.routes.includes(route);
      const queryMatch = destination.name.toLowerCase().includes(query.trim().toLowerCase());
      return regionMatch && routeMatch && queryMatch;
    });
  }, [region, route, query]);

  const visible = expanded ? filtered : filtered.slice(0, 8);

  return (
    <div className="destination-explorer">
      <div className="destination-toolbar">
        <label className="search-box">
          <Search size={18} />
          <span className="sr-only">Search destinations</span>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a country" />
        </label>
        <label className="route-filter">
          <SlidersHorizontal size={17} />
          <span className="sr-only">Filter by route</span>
          <select value={route} onChange={event => setRoute(event.target.value)}>
            {routeOptions.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <div className="region-tabs" aria-label="Filter destinations by region">
          {regions.map(option => (
            <button key={option} type="button" className={region === option ? "active" : ""} onClick={() => setRegion(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="destination-grid">
        <AnimatePresence mode="popLayout">
          {visible.map((destination, index) => (
            <motion.article
              layout
              key={destination.id}
              className="destination-card"
              style={{ "--country-accent": destination.accent } as React.CSSProperties}
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: index * 0.025, duration: 0.32 }}
            >
              <div className="country-top">
                <span className="country-flag" aria-hidden="true">{destination.flag}</span>
                <span className="country-region">{destination.region}</span>
              </div>
              <h3>{destination.name}</h3>
              <div className="route-chips">{destination.routes.map(item => <span key={item}>{item}</span>)}</div>
              <div className="processing-time">
                <Clock3 size={17} />
                <span><small>Planning window</small>{destination.planningWindow}</span>
              </div>
              <ul>{destination.requirements.map(item => <li key={item}><Check size={14} />{item}</li>)}</ul>
              <a href={destination.officialUrl} target="_blank" rel="noreferrer">
                Official immigration portal <ArrowUpRight size={15} />
              </a>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {!visible.length && <div className="empty-filter"><Search size={24} /><strong>No destinations matched</strong><p>Try clearing a filter or searching another country.</p></div>}

      {filtered.length > 8 && (
        <button className="text-button" type="button" onClick={() => setExpanded(value => !value)}>
          {expanded ? "Show fewer destinations" : `Explore all ${filtered.length} destinations`} <ArrowUpRight size={16} />
        </button>
      )}

      <p className="data-disclaimer">
        Planning windows are broad orientation ranges, not guarantees. Timelines and evidence vary by visa stream, nationality, application location, demand, and case complexity. Always confirm current information on the linked official portal.
      </p>
    </div>
  );
}
