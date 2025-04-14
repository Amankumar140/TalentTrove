import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    { icon: <FaEnvelope />, label: "Email", value: "support@talenttrove.com", gradient: "from-purple-500 to-indigo-600" },
    { icon: <FaMapMarkerAlt />, label: "Location", value: "Remote — Worldwide", gradient: "from-blue-500 to-cyan-600" },
    { icon: <FaPhoneAlt />, label: "Phone", value: "+1 (555) 123-4567", gradient: "from-emerald-500 to-teal-600" },
  ];

  return (
    <div className="min-h-screen bg-surface text-white overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-accent-purple/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-10">
          <h3
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/")}
          >
            TalentTrove
          </h3>
          <button
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative pt-32 pb-12 px-6 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold mb-6 tracking-wide animate-fade-in">
          GET IN TOUCH
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto animate-slide-up">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            We'd Love to
          </span>{" "}
          <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
            Hear From You
          </span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg mt-4 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Have questions, feedback, or need support? Reach out and we'll get back to you shortly.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="relative max-w-4xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {contactInfo.map((item, i) => (
            <div key={i} className="glass-card p-5 text-center animate-slide-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-sm mb-3`}>
                {item.icon}
              </div>
              <p className="section-label">{item.label}</p>
              <p className="text-white text-sm font-medium mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="relative max-w-2xl mx-auto px-6 pb-24 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <div className="glass-card gradient-border p-8 md:p-10">
          <h2 className="text-xl font-bold mb-6 text-white">Send us a Message</h2>

          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center animate-scale-in">
              ✅ Thank you! Your message has been sent successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="section-label mb-2 block">Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="section-label mb-2 block">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="section-label mb-2 block">Subject</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="section-label mb-2 block">Message</label>
              <textarea
                name="message"
                className="form-input resize-none"
                placeholder="Tell us more about your inquiry..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-blue w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
