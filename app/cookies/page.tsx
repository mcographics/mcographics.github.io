import { PolicyDocument } from "../legal/PolicyDocument";

export const metadata = {
  title: "Cookie Notice | Majestic Creations",
  description: "Cookie and browser storage information for the Majestic Creations website, including analytics consent choices.",
  alternates: { canonical: "/cookies/" },
};

export default function CookieNoticePage() {
  return <PolicyDocument title="Cookie Notice" intro="This notice explains the cookies and similar browser storage used by majesticcreations.org and how to change your choices." sections={[
    { heading: "What the site stores", paragraphs: [
      "The site uses local storage, a browser storage feature, to remember your theme, accessibility preferences, and privacy choice. These values stay in your browser and support the features you select.",
      "Optional Google Analytics measurement is not loaded until you allow analytics. If analytics is enabled for the site, Google Analytics may set measurement cookies, commonly named _ga and _ga_*. Google’s own documentation explains its cookies and retention practices.",
      "The Discord community preview does not contact Discord until you select “Load Discord preview.” When loaded, Discord may set or read cookies and receive technical information such as your IP address and browser details. Opening an external service directly can also allow that service to use its own technologies."
    ]},
    { heading: "Your choice", paragraphs: [
      "Essential local storage for display, accessibility, and remembering your privacy choice is used to provide the settings you select. Analytics is optional. You can choose “Reject optional” or “Allow analytics,” and both choices are available with equal prominence.",
      "To review or change your choice, select “Privacy settings” at the bottom of any page. You can also remove browser storage through your browser settings. Removing the saved choice will cause the site to ask again."
    ]},
    { heading: "Third-party services", paragraphs: [
      "Google Analytics and Discord are independent services. Their cookies, storage, and data processing are governed by their own policies. The Privacy Policy identifies the services used by this website and how they receive information."
    ]},
    { heading: "Questions", paragraphs: [
      "For questions about this notice or the site’s privacy practices, email majesticcreationsottawa@outlook.com."
    ]}
  ]} />;
}
