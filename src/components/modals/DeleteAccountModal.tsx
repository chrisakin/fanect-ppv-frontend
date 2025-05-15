import { AlertCircleIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const DeleteAccountModal = (): JSX.Element => {
  return (
    <Card className="flex flex-col w-[600px] items-center gap-20 relative border-none">
      <CardContent className="flex flex-col w-full items-center gap-11 pt-6">
        <div className="flex flex-col w-full items-center gap-[30px] relative">
          {/* Using AlertCircleIcon icon from lucide-react instead of the image */}
          <AlertCircleIcon className="w-[100px] h-[100px] text-[#dddddd]" />

          <div className="flex flex-col items-center w-full">
            <h1 className="font-display-lg-semibold font-[number:var(--display-lg-semibold-font-weight)] text-[#dddddd] text-[length:var(--display-lg-semibold-font-size)] text-center tracking-[var(--display-lg-semibold-letter-spacing)] leading-[var(--display-lg-semibold-line-height)] [font-style:var(--display-lg-semibold-font-style)]">
              Delete Account
            </h1>

            <p className="w-[456px] font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#cccccc] text-[length:var(--text-xl-regular-font-size)] text-center tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)]">
              If you delete your account, you will not be able to access it
              anymore and your active Streampasses will be lost
            </p>
          </div>
        </div>
      </CardContent>

      <div className="flex items-start justify-center gap-5 self-stretch w-full mb-6">
        <Button
          variant="outline"
          className="h-[62px] flex-1 rounded-[10px] border border-solid border-[#a4a7ae]"
        >
          <span className="font-text-lg-semibold font-[number:var(--text-lg-semibold-font-weight)] text-gray-400 text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] whitespace-nowrap [font-style:var(--text-lg-semibold-font-style)]">
            No, Cancel
          </span>
        </Button>

        <Button
          variant="destructive"
          className="h-[60px] flex-1 bg-red-600 rounded-[10px]"
        >
          <span className="font-text-lg-semibold font-[number:var(--text-lg-semibold-font-weight)] text-whitewhite text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] whitespace-nowrap [font-style:var(--text-lg-semibold-font-style)]">
            Yes, Delete my Account
          </span>
        </Button>
      </div>
    </Card>
  );
};
