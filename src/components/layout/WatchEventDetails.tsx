import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const WatchEventDetails = (): JSX.Element => {
  // Event description data
  const eventDescription = {
    intro:
      "Fido has taken the Nigerian music scene by storm with his unique blend of Afrobeats, catchy melodies, and energetic performances. This is your chance to witness his incredible talent.",
    expectations: [
      "A high-energy performance featuring Fido's biggest hits.",
      "An immersive Afrobeats experience with vibrant sounds and rhythms.",
      "A night of dancing, celebration, and pure entertainment.",
    ],
  };

  return (
    <Card className="border-none shadow-none w-full">
      <CardContent className="flex flex-col items-start gap-3 p-0 w-full">
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
            <h1 className="font-display-lg-bold font-[number:var(--display-lg-semibold-font-weight)] text-gray-400 text-3xl md:text-4xl lg:text-5xl tracking-[var(--display-lg-semibold-letter-spacing)] leading-[var(--display-lg-semibold-line-height)] [font-style:var(--display-lg-semibold-font-style)]">
              Fido in Lagos
            </h1>

            <Button className="h-10 bg-green-600 text-gray-50 rounded-[10px] border border-solid border-[#1aaa65] hover:bg-green-700 w-full sm:w-auto">
              <span className="[font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-lg tracking-[-0.36px] leading-7">
                Follow
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2.5 w-full">
          <div className="flex flex-col items-start gap-[18px]">
            <p className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-gray-400 text-base md:text-lg text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)]">
              {eventDescription.intro}
            </p>

            <p className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-gray-400 text-base md:text-lg text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)]">
              What to Expect:
            </p>

            {eventDescription.expectations.map((expectation, index) => (
              <p
                key={index}
                className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-gray-400 text-base md:text-lg text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)]"
              >
                {expectation}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};