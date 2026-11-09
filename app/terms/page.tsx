import { PolicyDocument } from "../legal/PolicyDocument";

export const metadata = {
  title: "Terms of Use | Majestic Creations",
  description: "Terms for using the Majestic Creations website, its content, project information, and links to third-party services.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return <PolicyDocument title="Terms of Use" intro="These terms apply when you visit majesticcreations.org and use the information and links provided by Majestic Creations. By using the site, you agree to follow these terms and applicable law." sections={[
    { heading: "About this website", paragraphs: [
      "Majestic Creations is an independent creative studio operated by Kenneth Salmon in Gatineau, Québec, Canada. The website presents studio information, project descriptions, journal articles, community links, and links to software or services.",
      "The website is provided for general information. Project features, compatibility, availability, release status, and download links can change. Contact the studio if you need current information before relying on a project description."
    ]},
    { heading: "Acceptable use", bullets: [
      "Use the website lawfully and do not interfere with its availability, security, or operation.",
      "Do not attempt unauthorized access, distribute malware, submit deceptive or harmful messages, or misuse forms and community links.",
      "Do not impersonate another person or misrepresent your relationship with Majestic Creations.",
      "Follow the Community Guidelines when participating in the linked Majestic Creations Discord community."
    ]},
    { heading: "Intellectual property", paragraphs: [
      "Unless a page or asset says otherwise, the website’s original text, design, branding, artwork, and project materials are owned by Majestic Creations or used with permission. These terms do not transfer ownership or grant a license to copy, distribute, modify, or commercially use those materials.",
      "Software downloads and third-party materials may have their own licenses and terms. Review the applicable project license and notices before using, modifying, or redistributing any software or asset. Third-party names and marks belong to their respective owners."
    ]},
    { heading: "External links, downloads, and donations", paragraphs: [
      "Links to GitHub, Discord, FormSubmit, Google, Ko-fi, PayPal, Linktree, and other services are provided for convenience. They are operated independently, and their terms, privacy practices, availability, products, and transactions are their own responsibility.",
      "Majestic Creations does not process payments through this website. Donations and other transactions are completed directly with the payment provider. A link or project description is not a guarantee that a third-party service or download will remain available."
    ]},
    { heading: "No professional advice or warranty", paragraphs: [
      "Website content is provided for general informational purposes and is not professional, legal, financial, medical, automotive, or other individualized advice. Make your own assessment before using a project, download, or external service.",
      "To the extent permitted by applicable law, the site and its content are provided “as is” and “as available,” without warranties that cannot legally be excluded. Nothing in these terms removes rights or remedies that applicable consumer-protection law does not allow a business to waive."
    ]},
    { heading: "Limits of responsibility", paragraphs: [
      "To the extent permitted by applicable law, Majestic Creations is not responsible for indirect or consequential loss arising from use of the website, interruption, outdated information, or a third-party service. This clause does not limit responsibility where the law does not permit that limitation."
    ]},
    { heading: "Changes and governing law", paragraphs: [
      "These terms may be updated by posting a revised version here. The revision date appears at the top of the page. Québec and Canadian law applicable in Québec governs these terms, subject to any mandatory rights that apply to you."
    ]},
    { heading: "Contact", paragraphs: [
      "Questions about these terms can be sent to majesticcreationsottawa@outlook.com."
    ]}
  ]} />;
}
