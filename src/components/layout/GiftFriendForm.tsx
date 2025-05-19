import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const GiftFriend = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams();
    function giftPass() {
      navigate(`/dashboard/tickets/event/paid/${id}`)
    }
  // Form field data for mapping
  const formFields = [
    {
      id: "firstName",
      label: "Friend's First Name",
      defaultValue: "wunmi@gmail.com",
    },
    {
      id: "lastName",
      label: "Friend's Last Name",
      defaultValue: "wunmi@gmail.com",
    },
    {
      id: "email",
      label: "Friend's Email Address",
      defaultValue: "wunmi@gmail.com",
    },
  ];

  return (
    <div className="relative w-[570px] h-[790px] bg-gray-50 dark:bg-[#092D1B] rounded-[10px] overflow-hidden border border-dashed border-[#a4a7ae] dark:border-[#1AAA65]">
      <div className="flex flex-col w-[500px] items-start gap-[31px] absolute top-[38px] left-[35px]">
        <h1 className="self-stretch mt-[-1.00px] font-display-sm-semibold font-[number:var(--display-sm-semibold-font-weight)] text-gray-800 dark:text-[#CCCCCC] text-[length:var(--display-sm-semibold-font-size)] tracking-[var(--display-sm-semibold-letter-spacing)] leading-[var(--display-sm-semibold-line-height)] [font-style:var(--display-sm-semibold-font-style)]">
          Gift Streampass to a Friend
        </h1>

        <div className="flex flex-col items-start gap-11 self-stretch w-full">
          <div className="flex flex-col items-start gap-6 self-stretch w-full">
            <div className="flex flex-col items-start gap-6 self-stretch w-full">
              {formFields.map((field) => (
                <div
                  key={field.id}
                  className="flex flex-col items-start gap-1.5 self-stretch w-full"
                >
                  <div className="flex flex-col items-start gap-1.5 self-stretch w-full">
                    <label
                      htmlFor={field.id}
                      className="w-fit mt-[-1.00px] font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] whitespace-nowrap [font-style:var(--text-lg-medium-font-style)]"
                    >
                      {field.label}
                    </label>

                    <div className="flex h-[62px] items-center gap-2 px-3.5 py-2.5 self-stretch w-full mb-[-1.00px] ml-[-1.00px] mr-[-1.00px] bg-gray-50 rounded-lg overflow-hidden border border-solid border-[#d5d7da]">
                      <Input
                        id={field.id}
                        className="border-none shadow-none bg-transparent h-full p-0 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-700 text-base tracking-[-0.32px]"
                        defaultValue={field.defaultValue}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-6 self-stretch w-full">
            <div className="flex flex-col items-start gap-2 self-stretch w-full">
              <div className="w-fit mt-[-1.00px] font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap [font-style:var(--text-sm-medium-font-style)]">
                Price
              </div>

              <div className="self-stretch font-display-sm-medium font-[number:var(--display-sm-medium-font-weight)] text-gray-800 dark:text-[#CCCCCC] text-[length:var(--display-sm-medium-font-size)] tracking-[var(--display-sm-medium-letter-spacing)] leading-[var(--display-sm-medium-line-height)] [font-style:var(--display-sm-medium-font-style)]">
                NGN 45,000.00
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 self-stretch w-full">
            <Button onClick={giftPass} className="items-center justify-center gap-2.5 p-2.5 self-stretch w-full h-auto bg-green-600 rounded-[10px] hover:bg-green-600/90">
              <span className="font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-whitewhite text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] whitespace-nowrap [font-style:var(--text-lg-medium-font-style)]">
                Pay Now
              </span>
            </Button>

            <p className="w-fit [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-800 dark:text-[#CCCCCC] text-sm tracking-[-0.28px] leading-5 whitespace-nowrap">
              By clicking &apos;Pay Now&apos;, you agree with FaNect&apos;s
              terms and condition
            </p>
          </div>

          <div className="flex flex-col w-[500px] items-center gap-5">
            <button className="w-fit mt-[-1.00px] [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-green-600 text-lg leading-[18px] bg-transparent border-none cursor-pointer">
              <span className="tracking-[-0.06px] leading-7 underline">
                Purchase Streampass for myself
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
