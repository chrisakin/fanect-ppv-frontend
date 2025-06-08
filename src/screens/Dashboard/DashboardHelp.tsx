import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

export const DashboardHelp = (): JSX.Element => {
  // Data for tabs
  const tabs = ["General", "Events", "Payments", "Streaming", "Account"];

  // Data for FAQ items organized by category
  const faqCategories = {
    "General": [
      {
        question: "What is FaNect?",
        answer: "FaNect is a live streaming platform that brings exclusive concerts, festivals, DJ sets, and music events directly to your screen in high quality and real-time. Whether you're across the street or across the globe, you can experience live performances as they happen."
      },
      {
        question: "How do I create an account?",
        answer: "You can create an account by clicking the 'Sign Up' button on our homepage. You can register using your email address or sign up with your Google account for quick access."
      },
      {
        question: "Is FaNect free to use?",
        answer: "Creating an account on FaNect is free. However, individual events may require purchasing a Streampass to access the live stream. Event pricing varies depending on the artist and event organizer."
      },
      {
        question: "What devices can I use to watch events?",
        answer: "FaNect works on any device with a modern web browser including desktop computers, laptops, tablets, and smartphones. We recommend using the latest version of Chrome, Firefox, Safari, or Edge for the best experience."
      },
      {
        question: "Do I need to download any software?",
        answer: "No downloads required! FaNect runs entirely in your web browser. Simply visit our website, log in to your account, and you're ready to stream live music events."
      }
    ],
    "Events": [
      {
        question: "How do I find events to watch?",
        answer: "Browse upcoming events on our homepage or use the search function to find specific artists or event types. You can filter events by date, genre, or location to find exactly what you're looking for."
      },
      {
        question: "What is a Streampass?",
        answer: "A Streampass is your digital ticket to access a live music event on FaNect. Once purchased, it gives you access to watch the live stream and any available replay for up to 30 days after the event."
      },
      {
        question: "Can I gift a Streampass to someone?",
        answer: "Yes! You can purchase a Streampass as a gift for friends or family. Simply select the 'Gift a Friend' option when viewing an event, enter their details, and they'll receive access to the event."
      },
      {
        question: "How do I organize my own event?",
        answer: "Click on 'Create an Event' in the header or visit the Organise Events section in your dashboard. You'll need to provide event details, upload a banner and watermark, set pricing, and schedule your stream."
      },
      {
        question: "Can I watch past events?",
        answer: "Yes! If you purchased a Streampass for an event, you can watch the replay for up to 30 days after the live event ended. After 30 days, replays are no longer available."
      }
    ],
    "Payments": [
      {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods through our secure payment partners Stripe and Flutterwave. This includes credit/debit cards, bank transfers, and local payment methods depending on your location."
      },
      {
        question: "Is my payment information secure?",
        answer: "Absolutely! We use industry-standard encryption and work with trusted payment processors. FaNect never stores your complete payment information on our servers."
      },
      {
        question: "Can I get a refund for my Streampass?",
        answer: "Refund policies vary by event and are set by the event organizer. Generally, refunds are available if requested before the event starts. Contact our support team for assistance with refund requests."
      },
      {
        question: "How do event organizers get paid?",
        answer: "Event organizers can withdraw their earnings through the dashboard. Set up your withdrawal details in Settings, including bank account information, and request withdrawals when available."
      },
      {
        question: "Are there any additional fees?",
        answer: "The price you see is the price you pay for most events. Some payment methods may include small processing fees, which will be clearly displayed before you complete your purchase."
      }
    ],
    "Streaming": [
      {
        question: "What internet speed do I need?",
        answer: "We recommend a minimum of 5 Mbps for standard quality streaming and 25 Mbps for the best HD experience. The platform automatically adjusts quality based on your connection speed."
      },
      {
        question: "Can I interact during live events?",
        answer: "Yes! Most events include a live chat feature where you can interact with other viewers and sometimes directly with the performers. Look for the chat panel during live streams."
      },
      {
        question: "What if I experience technical issues during an event?",
        answer: "If you encounter streaming issues, try refreshing your browser, checking your internet connection, or switching to a different device. If problems persist, contact our support team immediately."
      },
      {
        question: "Can I watch with friends?",
        answer: "While each Streampass is for individual use, you can certainly watch together in the same location. For multiple viewers in different locations, each person will need their own Streampass."
      },
      {
        question: "Do events start exactly on time?",
        answer: "Event start times are set by organizers, but like live concerts, there may be slight delays. We recommend joining a few minutes early to ensure you don't miss anything."
      }
    ],
    "Account": [
      {
        question: "How do I change my password?",
        answer: "Go to Settings in your dashboard and click 'Reset Password' next to the password field. You'll need to enter your current password and choose a new one."
      },
      {
        question: "Can I change my email address?",
        answer: "Currently, email addresses cannot be changed after account creation. If you need to use a different email, you'll need to create a new account. Contact support if you need assistance transferring purchases."
      },
      {
        question: "How do I manage my notification preferences?",
        answer: "Visit the Settings page in your dashboard to customize your notification preferences. You can choose to receive notifications via email or in-app for various events like stream starts and ends."
      },
      {
        question: "What happens if I delete my account?",
        answer: "Deleting your account will permanently remove all your data and you'll lose access to any active Streampasses. This action cannot be undone. Make sure to use any purchased Streampasses before deleting your account."
      },
      {
        question: "How do I contact customer support?",
        answer: "You can reach our support team through the Help section in your dashboard or by emailing support@fanect.com. We typically respond within 24 hours during business days."
      }
    ]
  };

  const [selectedCategory, setSelectedCategory] = useState("General");

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
              value={selectedCategory}
              onValueChange={(value) => value && setSelectedCategory(value)}
              className="inline-flex items-start gap-5 flex-wrap"
            >
              {tabs.map((tab, index) => (
                <ToggleGroupItem
                  key={index}
                  value={tab}
                  className={`flex w-[133px] items-center justify-center gap-2.5 p-2.5 rounded-[10px] ${
                    selectedCategory === tab
                      ? "bg-green-600"
                      : "border border-solid border-[#2e483a]"
                  }`}
                >
                  <span
                    className={`font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] whitespace-nowrap [font-style:var(--text-lg-medium-font-style)] ${
                      selectedCategory === tab ? "text-gray-50" : "text-[#828b86]"
                    }`}
                  >
                    {tab}
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {/* FAQ Accordion */}
            <div className="flex flex-col w-full max-w-[700px] items-start justify-center gap-10 py-[50px]">
              <Accordion type="single" defaultValue="0" className="w-full">
                {faqCategories[selectedCategory as keyof typeof faqCategories]?.map((item, index) => (
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
                      <span className="font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] dark:text-[#828b86] text-gray-600 text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] [font-style:var(--text-lg-medium-font-style)] text-left w-full pr-4">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] dark:text-[#828b86] text-gray-600 text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)] whitespace-pre-line">
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