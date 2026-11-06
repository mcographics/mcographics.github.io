import { PolicyDocument } from "../legal/PolicyDocument";

export const metadata = {
  title: "Privacy Policy | Majestic Creations",
  description: "How Majestic Creations collects, uses, shares, protects, and retains personal information through its website.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPolicyPage() {
  return <PolicyDocument title="Privacy Policy" intro="This policy explains what information Majestic Creations receives through mcographics.github.io, why it is used, which service providers may handle it, and the choices available to visitors." sections={[
    { heading: "Who is responsible", paragraphs: [
      "Majestic Creations is an independent creative studio operated by Kenneth Salmon in Gatineau, Québec, Canada. Kenneth Salmon is the privacy contact for questions, access or correction requests, withdrawal of consent, and privacy complaints.",
      "Contact: majesticcreationsottawa@outlook.com. Please put “Privacy request” in the subject line and describe the request. Do not send passwords or highly sensitive information."
    ]},
    { heading: "Information the website receives", paragraphs: [
      "Contact form: if you send a message, the form asks for your name, email address, the type of request, and your message. The form is sent through FormSubmit, which receives the submission and forwards it to the Majestic Creations Outlook inbox. You can also contact the studio directly by email.",
      "Website operation: GitHub Pages and related delivery infrastructure may process technical request data such as an IP address, browser and device details, requested page, and date and time to deliver and protect the site. The site does not require a visitor account and does not store contact form submissions in its own database.",
      "Preferences: the site stores theme, accessibility, and privacy-choice settings in your browser’s local storage so those choices can be remembered. These settings are not used to identify you.",
      "Analytics: Google Analytics is loaded only if it is configured for the site and you choose to allow analytics. If enabled, Google may receive information about site usage and use cookies or similar technologies for measurement. Analytics is off until you opt in.",
      "External services: the community page offers a Discord preview that loads only after you select its load button. If you load it or follow a link to Discord, GitHub, Ko-fi, PayPal, Linktree, FormSubmit, or another external service, that service may receive technical data from your browser and may use its own cookies under its own privacy terms."
    ]},
    { heading: "Why information is used", bullets: [
      "To read and respond to questions, collaboration requests, support requests, and access requests.",
      "To operate, secure, maintain, and improve the website and its accessibility.",
      "To measure site use only when you have enabled optional analytics.",
      "To meet legal obligations, resolve disputes, and protect the rights and security of the studio and visitors."
    ]},
    { heading: "Sharing and service providers", paragraphs: [
      "Majestic Creations does not sell personal information or use this website for targeted advertising. Information is shared only as needed with service providers that operate the relevant feature: GitHub Pages for hosting, FormSubmit for contact-form delivery, Google Analytics when you opt in, and Discord when you choose to load its preview or visit Discord. Donation links lead to Ko-fi or PayPal; any donation or payment is handled directly by the provider, not by this website.",
      "These providers may process information outside Québec or Canada, under the laws that apply where they operate. Review each provider’s privacy information before using its service. Majestic Creations does not control a provider’s independent processing or retention."
    ]},
    { heading: "Cookies and similar technologies", paragraphs: [
      "The site uses browser local storage for display and accessibility preferences. Optional Google Analytics may use measurement cookies only after you opt in. The Discord preview is not requested until you choose to load it; Discord may then use its own cookies or similar technologies.",
      "You can change your optional analytics choice at any time using “Privacy settings” at the bottom of the site. You can also clear local storage and cookies in your browser. Blocking local storage may mean the site cannot remember your preferences."
    ]},
    { heading: "Retention and safeguards", paragraphs: [
      "Contact messages are kept only as long as needed to answer and manage the request. The studio’s current administrative target is to delete or securely dispose of a resolved contact message within 24 months, unless the matter remains active or a legal obligation requires longer retention. Hosting and analytics providers may retain their own technical records under their separate retention practices.",
      "Reasonable administrative and technical safeguards are used to protect information handled by the studio. No internet transmission or storage method can be guaranteed completely secure."
    ]},
    { heading: "Your choices and rights", paragraphs: [
      "You may ask to access or correct personal information held by Majestic Creations, withdraw consent where processing relies on consent, or ask a question or make a complaint. Some information may need to be retained or processed where the law requires it. Requests can be sent to the privacy contact above.",
      "If you are not satisfied with how a privacy matter is handled, you may contact the Commission d’accès à l’information du Québec or, where applicable, the Office of the Privacy Commissioner of Canada."
    ]},
    { heading: "Children", paragraphs: [
      "This website is not designed to collect personal information from children. Please contact the privacy contact if you believe a child has sent personal information through the contact form so the studio can review and address the request."
    ]},
    { heading: "Changes to this policy", paragraphs: [
      "This policy may be updated when the site or its privacy practices change. The current version and its revision date will be posted on this page. Material changes will be highlighted on the site where appropriate."
    ]}
  ]} />;
}
