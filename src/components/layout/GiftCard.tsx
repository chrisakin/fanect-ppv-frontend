
import { Card, CardContent } from "../../components/ui/card";

export const GiftCard = (): JSX.Element => {
  return (
    <div className="flex  p-4">
      <Card className="relative w-full max-w-lg mx-auto rounded-[10px] overflow-hidden border border-dashed border-[#1aaa65] bg-transparent shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold dark:text-white text-gray-800 text-center leading-tight px-2">
              Streampass successfully sent to your friends 🎉🎉
            </h1>

            {/* Main visual container */}
            <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
              {/* Background celebration elements */}
             <img src="/gift.svg" alt="" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};