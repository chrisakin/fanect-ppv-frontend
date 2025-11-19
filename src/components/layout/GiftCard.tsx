
import { Card, CardContent } from "../../components/ui/card";

/**
 * GiftCard Component - Success confirmation card after sending streampass gift
 * @returns {JSX.Element} Centered card with celebration message and gift SVG image
 */
export const GiftCard = (): JSX.Element => {
  return (
    <div className="flex  p-4">
      {/* Card with dashed green border, centered layout */}
      <Card className="relative w-full max-w-lg mx-auto rounded-[10px] overflow-hidden border border-dashed border-[#1aaa65] bg-transparent shadow-lg">
        <CardContent className="p-0">
          {/* Vertical flex container with responsive gap and padding */}
          <div className="flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
            {/* Success message - responsive font sizing (text-xl → text-3xl) */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold dark:text-white text-gray-800 text-center leading-tight px-2">
              Streampass successfully sent to your friends 🎉🎉
            </h1>

            {/* Centered gift image - 1:1 aspect ratio container */}
            <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
              {/* Gift SVG decoration */}
             <img src="/gift.svg" alt="" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};