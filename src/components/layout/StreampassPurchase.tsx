import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const StreampassPurchaseCard = (): JSX.Element => {
  return (
    <Card className="w-[571px] bg-gray-100 dark:bg-[#092D1B] rounded-[10px] border-[0.5px] border-solid border-[#a4a7ae] dark:border-[#1AAA65]">
    <CardContent className="p-0">
      <div className="flex flex-col w-full items-start gap-[31px] p-[35px] pt-[47px]">
        <h2 className="font-display-sm-semibold text-gray-800 dark:text-[#CCCCCC] w-full">
          Purchase my Streampass
        </h2>

        <div className="flex flex-col items-start gap-14 w-full">
          {/* Email and price information */}
          <div className="flex flex-col items-start gap-6 w-full">
            <div className="flex flex-col items-start gap-1.5 w-full">
              <div className="flex flex-col items-start gap-1.5 w-full">
                <div className="flex w-full h-4 items-center gap-2">
                  <div className="flex-1 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-500 dark:text-[#CCCCCC] text-base tracking-[-0.32px]">
                    Streampass will be sent to
                  </div>
                </div>
                <div className="font-text-xl-medium text-gray-800 dark:text-[#CCCCCC]">
                  wunmi@gmail.com
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
              <div className="font-text-sm-medium text-gray-700">
                Price
              </div>
              <div className="font-display-sm-medium text-gray-800 dark:text-[#CCCCCC] w-full">
                NGN 45,000.00
              </div>
            </div>
          </div>

          {/* Payment button and terms */}
          <div className="flex flex-col items-center gap-5 w-full">
            <Button className="w-full bg-green-600 rounded-[10px] p-2.5 font-text-lg-medium text-whitewhite">
              Pay Now
            </Button>
            <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-[#717680] text-sm tracking-[-0.28px] leading-5">
              By clicking &apos;Pay Now&apos;, you agree with
              FaNect&apos;s terms and condition
            </div>
          </div>

          {/* Gift option */}
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-green-600 text-lg leading-[18px]">
              <span className="font-text-lg-regular underline">
                Gift Streampass to a friend
              </span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  )}