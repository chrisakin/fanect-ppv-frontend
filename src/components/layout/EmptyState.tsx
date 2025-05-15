import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../ui/button";

interface EmptyStateProps {
   primaryText: string;
   secondaryText: string;
   hasButton?: boolean;
   buttonText?: string;
   onClickButton?: (open: boolean) => void;
}
export const EmptyState = ({ primaryText, secondaryText, hasButton, buttonText, onClickButton}: EmptyStateProps) => {
    return (
       <div>
        <Card className="border-none shadow-none">
            <CardContent className="inline-flex flex-col h-[535px] items-center justify-center gap-3 px-0 py-[10px]">
              <div className="relative w-[155px] h-[135.83px]">
              <img
                 className=""
                    alt="Documents"
                    src="/icons/search.svg"
                />
              </div>
              <div className="flex flex-col w-[1137px] items-center gap-4">
                <div className="inline-flex flex-col items-center gap-1">
                  <h2 className="font-display-sm-medium font-[number:var(--display-sm-medium-font-weight)] text-[#828b86] text-[length:var(--display-sm-medium-font-size)] tracking-[var(--display-sm-medium-letter-spacing)] leading-[var(--display-sm-medium-line-height)] whitespace-nowrap [font-style:var(--display-sm-medium-font-style)]">
                    {primaryText}
                  </h2>

                  <p className="font-text-sm-regular font-[number:var(--text-sm-regular-font-weight)] text-gray-500 text-[length:var(--text-sm-regular-font-size)] tracking-[var(--text-sm-regular-letter-spacing)] leading-[var(--text-sm-regular-line-height)] whitespace-nowrap [font-style:var(--text-sm-regular-font-style)]">
                    {secondaryText}
                  </p>
                 {(hasButton && <div className="mt-4">
                  <Button onClick={() => {onClickButton && onClickButton(true)}} className="items-center justify-center gap-2.5 py-2.5 px-9 self-stretch w-full h-auto bg-green-600 rounded-[10px] hover:bg-green-600/90">
                  <span className="font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-white text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] whitespace-nowrap [font-style:var(--text-lg-medium-font-style)]">
                   {buttonText}
                   </span>
                  </Button>
                  </div> )}
                </div>
              </div>
            </CardContent>
          </Card>
       </div>
    );
}