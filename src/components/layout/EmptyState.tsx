import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../ui/button";

interface EmptyStateProps {
  primaryText: string;
  secondaryText: string;
  hasButton?: boolean;
  buttonText?: string;
  onClickButton?: (open: boolean) => void;
}

export const EmptyState = ({
  primaryText,
  secondaryText,
  hasButton,
  buttonText,
  onClickButton,
}: EmptyStateProps) => {
  return (
    <div className="w-full flex justify-center px-4">
      <Card className="w-full max-w-5xl border-none shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-6 py-10 text-center">
          <div className="w-32 h-auto">
            <img
              src="/icons/search.svg"
              alt="Empty"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="w-full max-w-3xl flex flex-col items-center gap-4">
            <h2 className="text-gray-500 text-lg md:text-xl font-semibold">
              {primaryText}
            </h2>

            <p className="text-gray-400 text-sm md:text-base">
              {secondaryText}
            </p>

            {hasButton && (
              <div className="mt-4 w-full max-w-sm">
                <Button
                  onClick={() => onClickButton?.(true)}
                  className="w-full bg-green-600 hover:bg-green-600/90 rounded-lg py-2.5 px-6"
                >
                  <span className="text-white text-base md:text-lg font-medium">
                    {buttonText}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
