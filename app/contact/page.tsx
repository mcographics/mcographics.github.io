import type { Metadata } from "next";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Contact Us | Majestic Creations",
  description: "Contact Majestic Creations about FieroLink GT access, project questions, collaborations, and new ideas.",
};

export default function ContactPage() {
  return (
    <main className="contact-page" id="top">
      <SiteHeader className="contact-header" activePage="about" />

      <section className="contact-hero" aria-labelledby="contact-heading">
        <div className="about-grid" aria-hidden="true" />
        <div className="contact-page-intro">
          <p className="eyebrow"><span /> A direct line to Majestic Creations</p>
          <h1 id="contact-heading">Contact<br /><em>us.</em></h1>
          <p>Have a question about a project, need to request access, or want to explore a collaboration? Send a message and it will be delivered directly to the Majestic Creations inbox.</p>
        </div>
      </section>

      <section className="contact-page-body" aria-labelledby="contact-form-heading">
        <div className="contact-copy">
          <p className="section-kicker">Request required · Contact us</p>
          <h2 id="contact-form-heading">Open a<br /><em>line.</em></h2>
          <p>For FieroLink GT, choose the access-request option and include the Fiero year, model, and what you would like to evaluate. For everything else, give us enough context to reply usefully.</p>
          <a className="contact-email" href="mailto:majesticcreationsottawa@outlook.com">majesticcreationsottawa@outlook.com <span>↗</span></a>
        </div>
        <form className="contact-form" action="https://formsubmit.co/majesticcreationsottawa@outlook.com" method="POST">
          <input type="hidden" name="_subject" value="Majestic Creations contact form submission" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value="https://mcographics.github.io/contact?sent=1#contact-form-heading" />
          <input className="contact-honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="contact-form-row">
            <div className="contact-field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Your name" required />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
          </div>
          <div className="contact-field">
            <label htmlFor="contact-project">What can we help with?</label>
            <select id="contact-project" name="project" defaultValue="FieroLink GT access request" required>
              <option>FieroLink GT access request</option>
              <option>Project question</option>
              <option>Collaboration or partnership</option>
              <option>General message</option>
            </select>
          </div>
          <div className="contact-field">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" placeholder="Tell us what you have in mind…" rows={7} required />
          </div>
          <button className="button primary" type="submit">Send message <span>↗</span></button>
          <p className="contact-form-note">Your message will be delivered to <span className="contact-form-note-recipient">majesticcreationsottawa@outlook.com</span>. Please do not include passwords or other sensitive information.</p>
        </form>
      </section>

      <footer className="about-footer">
        <a className="brand" href="/"><img className="brand-logo" src="/brand/majestic-lion.png" alt="" /><span>MAJESTIC <b>CREATIONS</b></span></a>
        <p>Apps · Games · Worlds · Ideas</p>
        <div><a href="/">Home</a><a href="/blog">Blog</a><a href="/community">Community</a><a href="/about">About Me</a><a href="/contact">Contact Us</a></div>
        <small>© {new Date().getFullYear()} Majestic Creations. Built independently in Gatineau, Québec.</small>
      </footer>
    </main>
  );
}
