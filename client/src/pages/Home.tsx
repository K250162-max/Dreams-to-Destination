import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CinematicGlobeStage } from "@/components/site/CinematicGlobeStage";
import { DestinationExplorer } from "@/components/site/DestinationExplorer";
import { EligibilityChecker } from "@/components/site/EligibilityChecker";
import { ConsultationForm, EnquiryForm, NewsletterForm } from "@/components/site/LeadForms";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceExplorer } from "@/components/site/ServiceExplorer";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SuccessStories } from "@/components/site/SuccessStories";
import DeferredLightTunnel from "@/components/site/DeferredLightTunnel";
import { AnimatedCounter, JourneyRail, PointerAura } from "@/components/site/MotionAccents";
import { ContactCity, DestinationOrbit, PortalDivider, ProcessConveyor } from "@/components/site/CinematicDecor";
import { CinematicExperience } from "@/components/site/CinematicExperience";
import {
  advisoryTeam,
  contactDetails,
  faqs,
  processSteps,
  services,
  trustStats,
} from "@/data/siteData";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const expertiseSignals = [
  ["Transparent process", "Clear scope, milestones, and communication at every stage."],
  ["Personal guidance", "A strategy shaped around your profile rather than a generic checklist."],
  ["Document precision", "Structured reviews designed to surface gaps before submission."],
  ["End-to-end care", "From first assessment and admissions to interviews and departure."],
];

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <CinematicExperience />
      <PointerAura />
      <JourneyRail />
      <SiteHeader />

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-grid-pattern" aria-hidden="true" />
          <div className="hero-aurora hero-aurora--one" aria-hidden="true" />
          <div className="hero-aurora hero-aurora--two" aria-hidden="true" />
          <div className="page-container hero-layout">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="hero-badge"><Sparkles size={14} /> Visa · Immigration · Admissions <i>Global guidance</i></span>
              <h1 id="hero-title">Your Dreams.<br /><span>Our Mission.</span></h1>
              <p>Trusted visa and immigration consultants helping students, professionals, families, and travelers move forward with clarity, confidence, and a carefully prepared plan.</p>
              <div className="hero-actions">
                <a className="primary-button primary-button--gold" href="#consultation">Book free consultation <ArrowRight size={17} /></a>
                <a className="hero-text-link" href="#services">Explore our services <ArrowUpRight size={16} /></a>
              </div>
              <div className="hero-trust-line">
                <span className="trust-seal"><ShieldCheck size={19} /></span>
                <span><strong>Profile-first guidance</strong><small>Clear advice before commitment</small></span>
                <i />
                <span><strong>Worldwide pathways</strong><small>Study, work, visit, and settle</small></span>
              </div>
            </motion.div>

            <div className="hero-visual"><CinematicGlobeStage /></div>
          </div>

          <div className="page-container hero-stats" aria-label="Company trust indicators">
            {trustStats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + index * 0.08 }}>
                <strong><AnimatedCounter value={stat.value} /></strong><span>{stat.label}</span>
              </motion.div>
            ))}
            <p>Performance indicators supplied by Dreams To Destination.</p>
          </div>
        </section>

        <div className="journey-marquee" aria-hidden="true">
          <div>
            {[...services, ...services].map((service, index) => <span key={`${service.id}-${index}`}><CircleDot size={10} />{service.title}</span>)}
          </div>
        </div>

        <section className="section section--ivory" id="services">
          <div className="page-container">
            <div className="section-intro-row">
              <SectionHeading
                eyebrow="What we navigate"
                title="Expert guidance for every kind of journey."
                body="Choose the route closest to your goal. Each service opens into a clear overview of where our specialists can add structure, clarity, and confidence."
              />
              <div className="section-side-note"><span>08</span><p>Dedicated advisory pathways, designed around real decisions rather than paperwork alone.</p></div>
            </div>
            <ServiceExplorer />
          </div>
        </section>

        <section className="section section--blueprint" id="destinations">
          <div className="page-container">
            <div className="destination-heading-stage">
              <SectionHeading
                eyebrow="Destination intelligence"
                title="Compare possibilities. Find your direction."
                body="Filter by region or pathway, review a high-level readiness checklist, and continue to each country’s official immigration portal for current rules."
                light
              />
              <DestinationOrbit />
            </div>
            <DestinationExplorer />
          </div>
        </section>

        <PortalDivider tone="blue" />

        <section className="section section--paper" id="eligibility">
          <div className="page-container">
            <div className="section-intro-row">
              <SectionHeading
                eyebrow="Visa eligibility checker"
                title="Turn uncertainty into a practical first step."
                body="A guided, four-step snapshot helps you understand profile signals, preparation gaps, and what to discuss with a consultant next."
              />
              <div className="section-side-note section-side-note--blue"><Target size={25} /><p>Educational guidance only. No algorithm can guarantee an immigration outcome.</p></div>
            </div>
            <EligibilityChecker />
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="page-container about-grid">
            <motion.div
              className="about-visual"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75 }}
            >
              <img src="/manus-storage/d2d-airport-sunset_46f94748.jpg" alt="Airport terminal overlooking the runway at sunset" />
              <div className="about-visual-overlay">
                <span>Since</span><strong>10+</strong><small>years of guided journeys</small>
              </div>
              <div className="about-image-caption"><span>ISB</span><i /><span>WORLDWIDE</span></div>
              <div className="about-hud" aria-hidden="true"><span><small>Profile scan</small><strong>READY</strong></span><i /><span><small>Route signal</small><strong>GLOBAL</strong></span></div>
            </motion.div>

            <div className="about-copy">
              <SectionHeading
                eyebrow="Our purpose"
                title="Every dream deserves the right destination."
                body="Dreams To Destination is a visa consultancy dedicated to helping individuals and families study, work, visit, and build a future abroad through personal, transparent guidance."
                light
              />
              <p className="about-lead">Our work begins before the application. We listen to the ambition behind it, identify a route that fits, explain the trade-offs clearly, and organize the journey into manageable decisions.</p>
              <div className="expertise-signals">
                {expertiseSignals.map(([title, body]) => <div key={title}><Check size={15} /><span><strong>{title}</strong><small>{body}</small></span></div>)}
              </div>
              <a className="outline-button" href="#consultation">Meet your next step <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="section section--ivory team-section">
          <div className="page-container">
            <div className="team-heading-row">
              <SectionHeading
                eyebrow="A joined-up advisory team"
                title="Three specialist desks. One coherent journey."
                body="Instead of inventing individual biographies, we show the specialist roles that shape a complete client experience from first assessment to final preparation."
              />
              <span className="team-monogram">D<span>→</span>D</span>
            </div>
            <div className="team-grid">
              {advisoryTeam.map((member, index) => (
                <motion.article key={member.code} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                  <div className="team-card-top"><span>{member.code}</span><BadgeCheck size={20} /></div>
                  <div className="team-avatar" aria-hidden="true"><span>{member.title.split(" ").map(word => word[0]).join("")}</span><i /></div>
                  <h3>{member.title}</h3><p>{member.description}</p>
                  <div className="team-skills">{member.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="process-light-tunnel" aria-hidden="true">
            <DeferredLightTunnel
              cableColor="#4A8AFF"
              pulseColor="#F4C756"
              tunnelColor="#12366F"
              tunnelOpacity={0.035}
              speed={0.075}
              flowDirection="outward"
              pulseSpeed={2.2}
              pulseLength={0.22}
              pulseBlend={0.9}
              cableCount={18}
              thickness={0.22}
              rimWidth={0.11}
              waviness={0.2}
              sway={0.3}
              size={1.04}
              centerX={0.28}
              glow={0.85}
              brightness={0.82}
              grainIntensity={0.018}
              opacity={0.42}
              mouseStrength={0.035}
            />
          </div>
          <div className="page-container">
            <div className="section-intro-row">
              <SectionHeading
                eyebrow="How the journey works"
                title="A calm process for a high-stakes decision."
                body="We replace guesswork with a visible sequence: discover the goal, assess the route, prepare the evidence, coordinate the application, and plan the move."
                light
              />
              <a className="process-link" href="#consultation">Start at step one <ArrowUpRight size={17} /></a>
            </div>
            <ProcessConveyor />
            <div className="process-track">
              {processSteps.map(([number, title, body], index) => (
                <motion.article key={number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.07 }}>
                  <div className="process-number"><span>{number}</span>{index < processSteps.length - 1 && <i />}</div>
                  <h3>{title}</h3><p>{body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <PortalDivider tone="gold" />

        <section className="section section--paper stories-section" id="stories">
          <div className="page-container stories-grid">
            <SectionHeading
              eyebrow="Success stories"
              title="Trust should be earned—and verifiable."
              body="The testimonial carousel is ready for authentic, permissioned client outcomes. Until those are supplied, this section remains deliberately transparent."
            />
            <SuccessStories />
          </div>
        </section>

        <section className="section consultation-section" id="consultation">
          <div className="consultation-orb consultation-orb--one" aria-hidden="true" />
          <div className="consultation-orb consultation-orb--two" aria-hidden="true" />
          <div className="page-container consultation-grid">
            <div className="consultation-copy">
              <span className="eyebrow eyebrow--light"><span />Your first conversation</span>
              <h2>Bring the profile.<br /><em>We’ll help define the route.</em></h2>
              <p>Tell us what you want to achieve and when. Your request is saved securely so our team can review the facts, priorities, and practical next steps before confirming a consultation.</p>
              <div className="consultation-points">
                <div><span><Clock3 size={17} /></span><strong>Focused 30-minute review</strong><small>Goal, profile, route, and next steps.</small></div>
                <div><span><ShieldCheck size={17} /></span><strong>No-obligation guidance</strong><small>Understand your options before committing.</small></div>
                <div><span><MessageCircleMore size={17} /></span><strong>Clear follow-up</strong><small>Availability is confirmed using your chosen details.</small></div>
              </div>
              <div className="consultation-contact"><span>Prefer to call?</span><a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>{contactDetails.phone}</a></div>
            </div>
            <div className="consultation-form-card">
              <div className="form-card-heading"><span><CalendarDaysIcon /></span><div><small>Consultation request</small><h3>Choose a time that works.</h3></div></div>
              <ConsultationForm />
            </div>
          </div>
        </section>

        <section className="section section--ivory" id="faq">
          <div className="page-container faq-grid">
            <div>
              <SectionHeading
                eyebrow="Frequently asked"
                title="Clear answers before you begin."
                body="Visa rules can feel complex. These answers explain our process and help you prepare for a more useful first conversation."
              />
              <div className="faq-aside"><span>Still deciding?</span><p>Send us the question that is holding you back.</p><a href="#contact">Ask the team <ArrowRight size={15} /></a></div>
            </div>
            <Accordion type="single" collapsible className="faq-accordion">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                  <AccordionTrigger><span className="faq-number">0{index + 1}</span><span>{faq.question}</span></AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="page-container contact-grid">
            <div className="contact-copy">
              <span className="eyebrow eyebrow--light"><span />Direct contact</span>
              <h2>Let’s make the next move feel clear.</h2>
              <p>Contact the team for a service question, a document review request, or a conversation about the most realistic next step.</p>
              <div className="contact-list">
                <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}><span><Phone size={18} /></span><small>Call our team</small><strong>{contactDetails.phone}</strong><ChevronRight size={17} /></a>
                <a href={`mailto:${contactDetails.email}`}><span><Mail size={18} /></span><small>Email enquiries</small><strong>{contactDetails.email}</strong><ChevronRight size={17} /></a>
              </div>
              <div className="location-panel">
                <div className="location-grid-art" aria-hidden="true"><span /><i /><b /></div>
                <small>Advisory locations</small>
                <div>{contactDetails.locations.map(location => <span key={location}><MapPin size={14} />{location}</span>)}</div>
              </div>
              <div className="social-row">
                <span>Follow the journey</span>
                <a href={contactDetails.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
                <a href={contactDetails.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
              </div>
              <ContactCity />
            </div>
            <div className="enquiry-card">
              <span className="enquiry-kicker">General enquiry</span><h3>How can we help?</h3><p>Share a little context and the team will respond by email.</p>
              <EnquiryForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-station" aria-hidden="true">
          <div className="footer-planet" />
          <div className="footer-station-ring"><span /><i /><b /></div>
          <div className="footer-docking-light footer-docking-light--one" /><div className="footer-docking-light footer-docking-light--two" />
        </div>
        <div className="page-container footer-main">
          <div className="footer-brand">
            <a className="brand brand--footer" href="#top"><span className="brand-mark"><span>D</span><i /><span>D</span></span><span className="brand-copy"><strong>Dreams To</strong><small>Destination</small></span></a>
            <p>Personal visa, immigration, and admissions guidance for international dreams that deserve a well-prepared route.</p>
            <a className="footer-email" href={`mailto:${contactDetails.email}`}>{contactDetails.email}<ArrowUpRight size={16} /></a>
          </div>
          <div className="footer-column"><strong>Explore</strong><a href="#services">Services</a><a href="#destinations">Destinations</a><a href="#eligibility">Eligibility checker</a><a href="#about">About us</a></div>
          <div className="footer-column"><strong>Popular routes</strong><a href="#services">Student visas</a><a href="#services">Visit visas</a><a href="#services">Work visas</a><a href="#services">Permanent residency</a></div>
          <div className="footer-cta">
            <small>Destination notes</small><h3>Useful guidance, thoughtfully sent.</h3>
            <NewsletterForm />
            <div className="footer-socials">
              <a href={contactDetails.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
              <a href={contactDetails.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
              <a href={contactDetails.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircleMore size={16} /></a>
            </div>
          </div>
        </div>
        <div className="page-container footer-bottom"><span>© {new Date().getFullYear()} Dreams To Destination. All rights reserved.</span><div><a href="#faq">Privacy</a><a href="#faq">Terms</a><a href="#faq">Disclaimer</a></div><span>Guidance, not guarantees.</span></div>
      </footer>

      <div className="floating-actions">
        <a href={contactDetails.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircleMore size={20} /></a>
        <a href="#top" aria-label="Back to top"><ArrowUp size={19} /></a>
      </div>
    </div>
  );
}

function CalendarDaysIcon() {
  return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}
