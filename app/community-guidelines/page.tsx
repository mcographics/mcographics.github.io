import { PolicyDocument } from "../legal/PolicyDocument";

export const metadata = {
  title: "Community Guidelines | Majestic Creations",
  description: "Community standards for the Majestic Creations Discord community.",
  alternates: { canonical: "/community-guidelines/" },
};

export default function CommunityGuidelinesPage() {
  return <PolicyDocument title="Community Guidelines" intro="These guidelines apply to participation in the Majestic Creations community spaces linked from this website, including the official Discord server. Our goal is a welcoming place to learn, share work, ask questions, and build together." sections={[
    { heading: "Treat people with respect", bullets: [
      "Be courteous, patient, and constructive, including when you disagree.",
      "Harassment, hate speech, threats, targeted insults, discrimination, and intimidation are not allowed.",
      "Do not publish another person’s private information or encourage others to contact them without permission."
    ]},
    { heading: "Keep the community useful and safe", bullets: [
      "Post in the channel that best fits your topic and keep discussion relevant.",
      "Do not spam, run unsolicited promotions, impersonate others, or post scams, phishing links, malware, or deceptive downloads.",
      "Do not request or share passwords, payment details, private access keys, or confidential information.",
      "Share only content you own or are allowed to share, and respect copyright, licenses, and attribution."
    ]},
    { heading: "Project feedback and support", paragraphs: [
      "Make bug reports and feedback specific, respectful, and useful. Avoid posting private information in public channels. Community discussion is not a promise of official technical support, a response time, or a particular product change.",
      "Do not present community discussion as professional legal, financial, medical, or safety advice."
    ]},
    { heading: "Moderation", paragraphs: [
      "Majestic Creations may remove content, redirect conversations, restrict participation, or remove a member when needed to protect the community or enforce these guidelines. Discord also applies its own Terms of Service and Community Guidelines.",
      "If you have a concern about moderation, contact majesticcreationsottawa@outlook.com with the Discord username, relevant channel, and a brief description. Do not send passwords or sensitive personal information."
    ]},
    { heading: "Updates", paragraphs: [
      "These guidelines may be updated as the community grows. The current version is posted on this page. By participating, you agree to follow these guidelines and the rules of the platform you use."
    ]}
  ]} />;
}
