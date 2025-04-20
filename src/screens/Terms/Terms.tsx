import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const Terms = (): JSX.Element => {
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
    <div className="bg-background text-foreground max-w-[1440px] mx-auto">
      <Header />
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 max-w-4xl mx-auto">
      <section className="absolute w-full h-[500px] top-0 left-0">
          <div className="relative h-[500px] bg-[url(/about-terms-privacy.svg)] bg-cover bg-[50%_50%]">
            <h1 className="absolute w-[686px] h-[140px] top-[199px] left-[355px] [font-family:'Sofia_Pro-Bold',Helvetica] font-bold text-[#eeeeee] text-[70px] text-center tracking-[-1.40px] leading-[normal]">
              Terms of Service
            </h1>
          </div>
        </section>
        <section className="absolute w-[890px] h-[432px] top-[561px] left-[280px] [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-black text-xl tracking-[-0.40px] leading-9">
        <div className="max-w-[1226px]">
            {policySections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="font-['Sofia_Pro-SemiBold',Helvetica] font-semibold text-black text-xl tracking-[-0.40px] leading-9">
                  {section.title}
                </h2>
                <p className="font-['Sofia_Pro-Regular',Helvetica] text-black text-xl tracking-[-0.40px] leading-9 whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};