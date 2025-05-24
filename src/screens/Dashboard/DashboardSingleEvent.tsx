import { StreampassPurchaseCard } from "@/components/layout/StreampassPurchase";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { GiftFriend } from "@/components/layout/GiftFriendForm";
import { RegisteredCard } from "@/components/layout/RegisteredCard";
import { useParams } from "react-router-dom";

export const DashboardSingleEvent = (): JSX.Element => {

  const { type } = useParams<{ type: string }>();
  // Event details data
  const eventDetails = [
    "Fido Live in Atlanta! Experience the Afrobeats Sensation!",
    "Get ready for an unforgettable night of electrifying music and pure vibes as Nigeria's very own Fido brings his chart-topping hits to Atlanta!",
    "Time: 24th December, 2025 | 8PM",
    "Fido has taken the Nigerian music scene by storm with his unique blend of Afrobeats, catchy melodies, and energetic performances. This is your chance to witness his incredible talent.",
    "What to Expect:",
    "A high-energy performance featuring Fido's biggest hits.",
    "An immersive Afrobeats experience with vibrant sounds and rhythms.",
    "A night of dancing, celebration, and pure entertainment.",
  ];

  return (
    <div className="flex flex-col w-full items-start gap-[30px]">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="flex items-center">
        <BreadcrumbItem>
          <BreadcrumbLink className="font-text-lg-medium text-gray-400">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
         /
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-text-lg-semibold text-gray-800">
            Event Details
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col items-start gap-[50px] w-full">
        {/* Event banner image */}
        <img
          className="w-full h-[400px] object-cover"
          alt="Event banner"
          src="/image.png"
        />

        <div className="flex items-start justify-between w-full gap-6">
          {/* Left column - Event details */}
          <div className="flex flex-col items-start gap-[30px] flex-1">
            {/* Event title and price */}
            <div className="flex flex-col items-start gap-2 max-w-[534px] w-full">
              <h1 className="font-display-lg-semibold text-gray-900 w-full">
                Fido in Lagos
              </h1>
              <h2 className="font-display-sm-medium text-[#414651] w-full">
                NGN 45,000.00
              </h2>
            </div>

            {/* About this event section */}
            <div className="flex flex-col max-w-[534px] w-full items-start gap-2.5">
              <h3 className="font-display-md-bold text-[30px] text-black w-full">
                About this event
              </h3>
              <div className="flex flex-col items-start gap-[18px] w-full">
                {eventDetails.map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-text-lg-regular text-black w-full"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Purchase card */}
         {type == 'streampass' && ( <StreampassPurchaseCard />)}
         {type == 'gift' && ( <GiftFriend />)}
          {type == 'paid' && ( <RegisteredCard />)}
        </div>
      </div>
    </div>
  );
};
