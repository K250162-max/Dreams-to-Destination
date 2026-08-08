import { destinations } from "@/data/siteData";
import {
  calculateEligibility,
  emptyEligibilityAnswers,
  type EligibilityAnswers,
  type EligibilityResult,
} from "@/lib/eligibility";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

type Option = { value: string; label: string; note?: string };

const stepFields: Array<Array<keyof EligibilityAnswers>> = [
  ["goal", "destination"],
  ["ageBand", "education"],
  ["experience", "language"],
  ["funds", "passportValidity"],
];

const optionSets: Record<string, Option[]> = {
  goal: [
    { value: "study", label: "Study abroad", note: "Education and study permits" },
    { value: "work", label: "Work abroad", note: "Professional and sponsored routes" },
    { value: "visit", label: "Visit or travel", note: "Tourism and family visits" },
    { value: "settle", label: "Settle long term", note: "Skilled and permanent routes" },
  ],
  ageBand: [
    { value: "18-24", label: "18–24" },
    { value: "25-34", label: "25–34" },
    { value: "35-44", label: "35–44" },
    { value: "45+", label: "45+" },
  ],
  education: [
    { value: "secondary", label: "Secondary school" },
    { value: "diploma", label: "Diploma / technical" },
    { value: "bachelor", label: "Bachelor’s degree" },
    { value: "postgraduate", label: "Postgraduate degree" },
  ],
  experience: [
    { value: "none", label: "Not yet" },
    { value: "1-2", label: "1–2 years" },
    { value: "3-5", label: "3–5 years" },
    { value: "6+", label: "6+ years" },
  ],
  language: [
    { value: "not_tested", label: "Not tested" },
    { value: "basic", label: "Basic" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced / tested" },
  ],
  funds: [
    { value: "uncertain", label: "Not confirmed", note: "I need a funding plan" },
    { value: "partial", label: "Partially prepared", note: "Some funds or sponsorship" },
    { value: "ready", label: "Well prepared", note: "Evidence is likely available" },
  ],
  passportValidity: [
    { value: "under_6", label: "Under 6 months" },
    { value: "6-12", label: "6–12 months" },
    { value: "over_12", label: "More than 12 months" },
  ],
};

function OptionGroup({
  label,
  field,
  value,
  onChange,
}: {
  label: string;
  field: keyof EligibilityAnswers;
  value: string;
  onChange: (field: keyof EligibilityAnswers, value: string) => void;
}) {
  return (
    <fieldset className="checker-fieldset">
      <legend>{label}</legend>
      <div className={`checker-options checker-options--${optionSets[field].length}`}>
        {optionSets[field].map(option => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? "selected" : ""}
            onClick={() => onChange(field, option.value)}
          >
            <span className="option-check">{value === option.value && <Check size={14} />}</span>
            <strong>{option.label}</strong>
            {option.note && <small>{option.note}</small>}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function EligibilityChecker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<EligibilityAnswers>(emptyEligibilityAnswers);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState("");

  const update = (field: keyof EligibilityAnswers, value: string) => {
    setAnswers(current => ({ ...current, [field]: value }));
    setError("");
  };

  const next = () => {
    const missing = stepFields[step]?.some(field => !answers[field]);
    if (missing) {
      setError("Choose an answer for each question before continuing.");
      return;
    }
    if (step === 3) {
      setResult(calculateEligibility(answers));
      setStep(4);
      return;
    }
    setStep(current => current + 1);
  };

  const reset = () => {
    setAnswers(emptyEligibilityAnswers);
    setResult(null);
    setStep(0);
    setError("");
  };

  return (
    <div className="eligibility-shell">
      <div className="checker-sidebar">
        <span className="checker-mark"><Sparkles size={22} /></span>
        <span className="checker-kicker">Eligibility snapshot</span>
        <h3>A clearer starting point in four thoughtful steps.</h3>
        <p>Answer a few profile questions to receive an educational readiness snapshot and practical next steps.</p>
        <div className="checker-steps" aria-label="Eligibility checker progress">
          {["Goal", "Profile", "Readiness", "Practical", "Result"].map((label, index) => (
            <div key={label} className={index === step ? "active" : index < step ? "complete" : ""}>
              <span>{index < step ? <Check size={13} /> : index + 1}</span><small>{label}</small>
            </div>
          ))}
        </div>
        <div className="checker-privacy"><ShieldCheck size={17} /><span>No account required. Your answers stay in this browser.</span></div>
      </div>

      <div className="checker-main">
        <div className="checker-progress"><span style={{ width: `${Math.min(100, ((step + 1) / 5) * 100)}%` }} /></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="checker-panel"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <>
                <span className="step-label">Step 01 · Your direction</span>
                <h4>Where should the journey begin?</h4>
                <OptionGroup label="What is your primary goal?" field="goal" value={answers.goal} onChange={update} />
                <label className="checker-select">
                  <span>Preferred destination</span>
                  <select value={answers.destination} onChange={event => update("destination", event.target.value)}>
                    <option value="">Select a destination</option>
                    {destinations.map(destination => <option key={destination.id} value={destination.id}>{destination.name}</option>)}
                  </select>
                </label>
              </>
            )}
            {step === 1 && (
              <>
                <span className="step-label">Step 02 · Your profile</span>
                <h4>Tell us about your current foundation.</h4>
                <OptionGroup label="Your age range" field="ageBand" value={answers.ageBand} onChange={update} />
                <OptionGroup label="Highest completed education" field="education" value={answers.education} onChange={update} />
              </>
            )}
            {step === 2 && (
              <>
                <span className="step-label">Step 03 · Your readiness</span>
                <h4>What experience and language readiness do you bring?</h4>
                <OptionGroup label="Relevant professional experience" field="experience" value={answers.experience} onChange={update} />
                <OptionGroup label="English or destination-language level" field="language" value={answers.language} onChange={update} />
              </>
            )}
            {step === 3 && (
              <>
                <span className="step-label">Step 04 · Practical preparation</span>
                <h4>Two final details before your snapshot.</h4>
                <OptionGroup label="How prepared are your funds or sponsorship?" field="funds" value={answers.funds} onChange={update} />
                <OptionGroup label="Current passport validity" field="passportValidity" value={answers.passportValidity} onChange={update} />
              </>
            )}
            {step === 4 && result && (
              <div className="checker-result">
                <span className="result-icon"><Sparkles size={26} /></span>
                <span className="step-label">Your educational snapshot</span>
                <div className="score-line">
                  <div className="score-ring" style={{ "--score": `${result.score * 3.6}deg` } as React.CSSProperties}><span>{result.score}<small>/100</small></span></div>
                  <div><h4>{result.label}</h4><p>{result.summary}</p></div>
                </div>
                <div className="result-columns">
                  <div><strong>Profile signals</strong><ul>{(result.strengths.length ? result.strengths : ["A clear destination and route goal"]).map(item => <li key={item}><Check size={14} />{item}</li>)}</ul></div>
                  <div><strong>Recommended next steps</strong><ul>{result.nextSteps.map(item => <li key={item}><ArrowRight size={14} />{item}</li>)}</ul></div>
                </div>
                <div className="result-actions">
                  <a className="primary-button" href="#consultation">Discuss my profile <ArrowRight size={16} /></a>
                  <button className="ghost-button" type="button" onClick={reset}><RefreshCw size={15} />Start again</button>
                </div>
                <p className="result-disclaimer">This is a basic educational screen, not legal advice, a formal assessment, or a guarantee of visa approval.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
          <div className="checker-footer">
            <div>{error && <span className="form-error" role="alert">{error}</span>}</div>
            <div className="checker-buttons">
              {step > 0 && <button className="ghost-button" type="button" onClick={() => { setStep(value => value - 1); setError(""); }}><ArrowLeft size={15} />Back</button>}
              <button className="primary-button" type="button" onClick={next}>{step === 3 ? "View my snapshot" : "Continue"}<ArrowRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
