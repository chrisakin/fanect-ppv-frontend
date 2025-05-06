import { Card, CardContent } from "../../components/ui/card";

interface EmptyStateProps {
   primaryText: string;
   secondaryText: string 
}
export const EmptyState = ({ primaryText, secondaryText }: EmptyStateProps) => {
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
                </div>
              </div>
            </CardContent>
          </Card>
       </div>
    );
}