import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { StreampassPaymentButton } from "../utils/StreampassPayment";
import { Event } from "@/store/eventStore";
import { getUser } from "@/lib/auth";

/**
 * Props for StreampassPurchaseCard component
 * @typedef {Object} StreampassPurchaseProps
 * @property {Event} event - Event object with pricing details
 */
type StreampassPurchaseProps = {
  event: Event;
};

/**
 * StreampassPurchaseCard Component - Purchase form for personal streampass
 * 
 * Displays:
 * - "Purchase my Streampass" heading
 * - Email where streampass will be sent (current user email)
 * - Event price
 * - Payment button
 * - Alternative: Gift streampass link
 * 
 * Features:
 * - Dark/Light theme support
 * - Responsive card sizing
 * - Terms agreement text
 * 
 * @param {StreampassPurchaseProps} props - Component props
 * @returns {JSX.Element} Purchase streampass card
 */
export const StreampassPurchaseCard = ({ event }: StreampassPurchaseProps): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    // Card wrapper - Gray background with theme support
    <Card className="w-full md:w-[571px] bg-gray-100 dark:bg-[#092D1B] rounded-[10px] border-[0.5px] border-solid border-[#a4a7ae] dark:border-[#1AAA65]">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-8">
          {/* Card title */}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-[#CCCCCC]">
            Purchase my Streampass
          </h2>
          
          <div className="flex flex-col gap-6">
            {/* Email and price details section */}
            <div className="space-y-4">
              {/* Recipient email */}
              <div className="space-y-1.5">
                <p className="text-gray-500 dark:text-[#CCCCCC]">
                  Streampass will be sent to
                </p>
                <p className="text-lg font-medium text-gray-800 dark:text-[#CCCCCC]">
                  {getUser().email}
                </p>
              </div>
              {/* Price display */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-[#CCCCCC]">Price</p>
                <p className="text-xl font-medium text-gray-800 dark:text-[#CCCCCC]">
                  {event.price?.currency} {Number(event.price?.amount).toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Payment section */}
            <div className="space-y-4">
              {/* Payment button component */}
              <StreampassPaymentButton 
                currency={event.price?.currency}
              />
              {/* Terms agreement text */}
              <p className="text-sm text-center text-[#717680]">
                By clicking 'Pay Now', you agree with FaNect's terms and condition
              </p>
            </div>
            
            {/* Gift alternative link */}
            <div className="text-center">
              <Button
                variant="link"
                className="text-green-600 hover:text-green-700"
                onClick={() => navigate(`/dashboard/tickets/event/gift/${id}`)}
              >
                Gift Streampass to a friend
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};