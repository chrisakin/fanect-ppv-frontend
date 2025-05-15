import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

export const DashboardHelp = (): JSX.Element => {
  // Data for tabs
  const tabs = ["General", "General", "General", "General", "General"];

  // Data for FAQ items
  const faqItems = [
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we will provide you with a free 30 minute onboarding call to get yo up and running.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, you can try us for free for 30 days. If you want, we will provide you with a free 30 minute onboarding call to get yo up and running.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, you can try us for free for 30 days. If you want, we will provide you with a free 30 minute onboarding call to get yo up and running.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, you can try us for free for 30 days. If you want, we will provide you with a free 30 minute onboarding call to get yo up and running.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, you can try us for free for 30 days. If you want, we will provide you with a free 30 minute onboarding call to get yo up and running.",
    },
  ];

  return (
    <div className="flex flex-col gap-20">
      <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Help & Support</h1>
      <p className="text-gray-500 dark:text-gray-400">Get help and get answers to questions you may have</p>
    </div>
    <div className="flex flex-col items-start gap-20">
      <div className="flex flex-col items-start gap-10 self-stretch w-full">
        <div className="flex flex-col items-center gap-5 self-stretch w-full">
          {/* Tabs navigation */}
          <ToggleGroup
            type="single"
            defaultValue="0"
            className="inline-flex items-start gap-5"
          >
            {tabs.map((tab, index) => (
              <ToggleGroupItem
                key={index}
                value={index.toString()}
                className={`flex w-[133px] items-center justify-center gap-2.5 p-2.5 rounded-[10px] ${
                  index === 0
                    ? "bg-green-600"
                    : "border border-solid border-[#2e483a]"
                }`}
              >
                <span
                  className={`font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] whitespace-nowrap [font-style:var(--text-lg-medium-font-style)] ${
                    index === 0 ? "text-gray-50" : "text-[#828b86]"
                  }`}
                >
                  {tab}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {/* FAQ Accordion */}
          <div className="flex flex-col w-[700px] items-start justify-center gap-10 py-[50px]">
            <Accordion type="single" defaultValue="0" className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={index.toString()}
                  className={`${
                    index === 0
                      ? "dark:bg-[#032313] bg-[#F5F5F5] rounded-[10px] p-5 mb-10"
                      : "mb-10"
                  }`}
                >
                  <AccordionTrigger className="flex justify-between w-full">
                    <span className="font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] dark:text-[#828b86] text-gray-600 text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] [font-style:var(--text-lg-medium-font-style)] text-left w-[616px]">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] dark:text-[#828b86] text-gray-600 text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)]">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
