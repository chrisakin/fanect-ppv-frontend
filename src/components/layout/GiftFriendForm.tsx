import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Event } from "@/store/eventStore";

type GiftFriendProps = {
  event: Event;
};

export const GiftFriend = ({ event }: GiftFriendProps): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams();

  function giftPass() {
    navigate(`/dashboard/tickets/event/paid/${id}`);
  }

  const formFields = [
    {
      id: "firstName",
      label: "Friend's First Name",
      defaultValue: "Wunmi",
    },
    {
      id: "lastName",
      label: "Friend's Last Name",
      defaultValue: "Adeola",
    },
    {
      id: "email",
      label: "Friend's Email Address",
      defaultValue: "wunmi@gmail.com",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-50 dark:bg-[#092D1B] border border-dashed border-[#a4a7ae] dark:border-[#1AAA65] rounded-[10px] p-6 sm:p-8 md:p-10">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-[#CCCCCC] mb-8">
        Gift Streampass to a Friend
      </h1>

      <div className="space-y-8">
        {/* Form Fields */}
        {formFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label
              htmlFor={field.id}
              className="block text-gray-800 dark:text-[#CCCCCC] text-lg font-medium"
            >
              {field.label}
            </label>
            <Input
              id={field.id}
              defaultValue={field.defaultValue}
              className="h-14 w-full px-4 text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        {/* Price */}
        <div className="space-y-1">
          <div className="text-sm text-gray-800 dark:text-[#CCCCCC] font-medium">
            Price
          </div>
          <div className="text-xl text-gray-800 dark:text-[#CCCCCC] font-semibold">
            NGN {Number(event.price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Pay Now Button */}
        <div className="space-y-4">
          <Button
            onClick={giftPass}
            className="w-full h-12 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition"
          >
            Pay Now
          </Button>

          <p className="text-center text-sm text-gray-800 dark:text-[#CCCCCC]">
            By clicking 'Pay Now', you agree with FaNect's terms and condition
          </p>
        </div>

        {/* Link to Purchase for Self */}
        <div className="text-center">
          <button
            onClick={() =>
              navigate(`/dashboard/tickets/event/streampass/${id}`)
            }
            className="text-green-600 text-base underline hover:text-green-700 transition"
          >
            Purchase Streampass for myself
          </button>
        </div>
      </div>
    </div>
  );
};
