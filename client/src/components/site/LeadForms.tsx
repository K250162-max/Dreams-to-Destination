import { trpc } from "@/lib/trpc";
import { services } from "@/data/siteData";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, Loader2, LockKeyhole, Send } from "lucide-react";
import { type FormEvent, useState } from "react";

const minimumDate = new Date().toISOString().slice(0, 10);

const initialBooking = {
  name: "",
  email: "",
  phone: "",
  visaType: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
  website: "",
};

export function ConsultationForm() {
  const [form, setForm] = useState(initialBooking);
  const [submitted, setSubmitted] = useState(false);
  const mutation = trpc.leads.createConsultation.useMutation();

  const update = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    try {
      await mutation.mutateAsync({ ...form, message: form.message || undefined });
      setForm(initialBooking);
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    }
  };

  if (submitted) {
    return (
      <motion.div className="form-success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <span><CheckCircle2 size={30} /></span>
        <small>Request received</small>
        <h3>Your next destination starts with a conversation.</h3>
        <p>Thank you. Our team will review your request and contact you using the details provided to confirm availability.</p>
        <button className="ghost-button" type="button" onClick={() => setSubmitted(false)}>Book another consultation</button>
      </motion.div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="form-row">
        <label><span>Full name</span><input required minLength={2} maxLength={120} value={form.name} onChange={event => update("name", event.target.value)} placeholder="Your full name" /></label>
        <label><span>Email address</span><input required type="email" maxLength={320} value={form.email} onChange={event => update("email", event.target.value)} placeholder="you@example.com" /></label>
      </div>
      <div className="form-row">
        <label><span>Phone number</span><input required type="tel" minLength={7} maxLength={40} value={form.phone} onChange={event => update("phone", event.target.value)} placeholder="+92 300 0000000" /></label>
        <label><span>Visa interest</span><select required value={form.visaType} onChange={event => update("visaType", event.target.value)}><option value="">Choose a service</option>{services.map(service => <option key={service.id} value={service.title}>{service.title}</option>)}</select></label>
      </div>
      <div className="form-row">
        <label><span>Preferred date</span><input required type="date" min={minimumDate} value={form.preferredDate} onChange={event => update("preferredDate", event.target.value)} /></label>
        <label><span>Preferred time</span><select required value={form.preferredTime} onChange={event => update("preferredTime", event.target.value)}><option value="">Choose a time</option><option>Morning · 09:00–12:00</option><option>Afternoon · 12:00–16:00</option><option>Evening · 16:00–19:00</option></select></label>
      </div>
      <label><span>What would you like to achieve? <small>Optional</small></span><textarea maxLength={2000} value={form.message} onChange={event => update("message", event.target.value)} placeholder="Share your preferred destination, timing, and any questions." rows={4} /></label>
      <label className="honeypot" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={form.website} onChange={event => update("website", event.target.value)} /></label>
      {mutation.error && <p className="form-error" role="alert">We could not save your request. Please review the fields or try again.</p>}
      <div className="form-submit-row">
        <p><LockKeyhole size={14} />Your details are used only to respond to this request.</p>
        <button className="primary-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <><Loader2 className="spin" size={16} />Saving request</> : <>Request consultation <CalendarDays size={16} /></>}
        </button>
      </div>
    </form>
  );
}

const initialEnquiry = { name: "", email: "", phone: "", subject: "", message: "", website: "" };

export function EnquiryForm() {
  const [form, setForm] = useState(initialEnquiry);
  const [submitted, setSubmitted] = useState(false);
  const mutation = trpc.leads.createEnquiry.useMutation();
  const update = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await mutation.mutateAsync(form);
      setForm(initialEnquiry);
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    }
  };

  if (submitted) {
    return (
      <div className="enquiry-success"><CheckCircle2 size={26} /><h3>Message received.</h3><p>Thank you. A member of the team will respond using the email address you provided.</p><button type="button" onClick={() => setSubmitted(false)}>Send another message <ArrowRight size={15} /></button></div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <div className="form-row">
        <label><span>Name</span><input required minLength={2} maxLength={120} value={form.name} onChange={event => update("name", event.target.value)} placeholder="Your name" /></label>
        <label><span>Email</span><input required type="email" maxLength={320} value={form.email} onChange={event => update("email", event.target.value)} placeholder="you@example.com" /></label>
      </div>
      <label><span>Phone <small>Optional</small></span><input type="tel" maxLength={40} value={form.phone} onChange={event => update("phone", event.target.value)} placeholder="+92 300 0000000" /></label>
      <label><span>Subject</span><input required minLength={3} maxLength={160} value={form.subject} onChange={event => update("subject", event.target.value)} placeholder="How can we help?" /></label>
      <label><span>Message</span><textarea required minLength={10} maxLength={2500} rows={5} value={form.message} onChange={event => update("message", event.target.value)} placeholder="Tell us a little about your question." /></label>
      <label className="honeypot" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={form.website} onChange={event => update("website", event.target.value)} /></label>
      {mutation.error && <p className="form-error" role="alert">We could not send your message. Please check the form and try again.</p>}
      <button className="primary-button" type="submit" disabled={mutation.isPending}>{mutation.isPending ? <><Loader2 className="spin" size={16} />Sending</> : <>Send enquiry <Send size={15} /></>}</button>
    </form>
  );
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mutation = trpc.leads.createEnquiry.useMutation();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await mutation.mutateAsync({
        name: "Website newsletter signup",
        email,
        phone: "",
        subject: "Newsletter signup",
        message: "Please add this address to the Dreams To Destination newsletter list.",
        website: "",
      });
      setEmail("");
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    }
  };

  if (submitted) {
    return <p className="newsletter-success"><CheckCircle2 size={14} />You’re on the list.</p>;
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="newsletter-email">Email for newsletter</label>
      <input id="newsletter-email" required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address" />
      <button type="submit" disabled={mutation.isPending} aria-label="Join newsletter">
        {mutation.isPending ? <Loader2 className="spin" size={15} /> : <ArrowRight size={15} />}
      </button>
    </form>
  );
}
