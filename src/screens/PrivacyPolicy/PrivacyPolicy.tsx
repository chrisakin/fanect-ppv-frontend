import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const PrivacyPolicy = (): JSX.Element => {
  const policySections = [
    {
      title: "1. Information We Collect",
      content: `We collect information to provide you with the best music streaming experience possible. This includes:
      Personal Information: When you create an account, sign up for events, or contact us, we may collect your name, email address, and other relevant details.
      Usage Data: We collect information about how you use FaNect, including which events you view, your device type, browser, and IP address.
      Payment Info: When you make purchases, our payment partners securely process your payment details. FaNect does not store your full payment information.
      Cookies & Tracking Technologies: We use cookies to personalize content, analyze traffic, and improve your experience.`,
    },
    {
      title: "2. Sharing Your Information",
      content: `We do not sell your personal information. We only share your data with:
      Trusted partners who help us run our platform
      Payment processors to handle transactions securely
      Legal authorities if required by law or to protect FaNect rights
      All partners are required to treat your data with the same level of care as we do.`,
    },
    {
      title: "3. Data Security",
      content: `We use industry-standard encryption and security practices to protect your data. However, no system is 100% secure, and we recommend keeping your login credentials confidential.`,
    },
    {
      title: "4. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. If we make significant changes, we'll notify you through the platform or via email.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="relative">
          <div className="h-[300px] md:h-[500px] bg-[url(/about-terms-privacy.svg)] bg-cover bg-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center max-w-3xl px-4">
                Privacy Policy
              </h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="space-y-8">
            {policySections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-xl md:text-2xl font-semibold">
                  {section.title}
                </h2>
                <p className="text-base md:text-xl whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};