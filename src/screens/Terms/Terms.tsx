import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const Terms = (): JSX.Element => {
  const termsSections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using FaNect, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.`,
    },
    {
      title: "2. User Accounts",
      content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.`,
    },
    {
      title: "3. Content and Conduct",
      content: `Users must not post or share content that is illegal, harmful, or violates others' rights. FaNect reserves the right to remove any content that violates these terms.`,
    },
    {
      title: "4. Changes to Service",
      content: `We may modify or discontinue any part of our service at any time. We will notify users of significant changes to our service or these terms.`,
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
                Terms of Service
              </h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="space-y-8">
            {termsSections.map((section, index) => (
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