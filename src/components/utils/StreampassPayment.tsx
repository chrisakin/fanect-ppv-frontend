import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import intaxios from "../../lib/axios"

type StreampassPaymentButtonProps = {
  friends?: any[] | null;
  totalPrice?: number;
  currency?: string;
};

export function StreampassPaymentButton({ 
  friends = [], 
  totalPrice,
  currency 
}: StreampassPaymentButtonProps): JSX.Element | null {
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"flutterwave" | "stripe" | null>(null);

  // Detect location to select payment method
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        setPaymentMethod(response.data.country === "NG" ? "flutterwave" : "stripe");
      } catch {
        setPaymentMethod("flutterwave");
      }
    };
    detectLocation();
  }, []);

  // Validate friends data before payment (for gift flow)
  const validateFriendsData = () => {
    if (friends === null) {
      // Validation failed in parent component
      return false;
    }
    return true;
  };

  // Flutterwave config
  const handleFlutterwavePayment = async () => {
    // Validate friends data if this is a gift payment
    if (friends && friends.length > 0 && !validateFriendsData()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = { 
        eventId: id, 
        currency: currency || 'NGN'
      };

      // Add friends data if this is a gift payment
      if (friends && friends.length > 0) {
        payload.friends = friends;
      }

      const { data } = await intaxios.post('streampass/payments/flutterwave/initialize', payload);
      window.location.href = data.link;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Payment initialization failed",
      });
      setIsLoading(false);
    }
  };

  // Stripe handler
  const handleStripePayment = async () => {
    // Validate friends data if this is a gift payment
    if (friends && friends.length > 0 && !validateFriendsData()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = { 
        eventId: id, 
        currency: currency || 'usd'
      };

      // Add friends data if this is a gift payment
      if (friends && friends.length > 0) {
        payload.friends = friends;
      }

      const { data } = await intaxios.post("streampass/payments/stripe/create-checkout-session", payload);
      window.location.href = data.url;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Payment initialization failed",
      });
      setIsLoading(false);
    }
  };

  if (!paymentMethod) {
    return (
      <Button disabled className="w-full bg-green-600 rounded-[10px] p-2.5 h-12">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  // Determine button text and price display
  const isGiftPayment = friends && friends.length > 0;
  const displayPrice = totalPrice || "Price";
  const buttonText = isGiftPayment 
    ? `Pay Now (${currency} ${typeof displayPrice === 'number' ? displayPrice.toLocaleString() : displayPrice})`
    : paymentMethod === "flutterwave" 
      ? "Pay with Flutterwave" 
      : "Pay with Stripe";

  if (paymentMethod === "flutterwave") {
    return (
      <Button
        onClick={handleFlutterwavePayment}
        className="w-full bg-green-600 hover:bg-green-700 rounded-[10px] p-2.5 h-12"
        disabled={!!isLoading || (!!isGiftPayment && friends === null)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="font-medium text-white">{buttonText}</span>
        )}
      </Button>
    );
  }

  // Stripe
  if (paymentMethod === "stripe") {
    return (
      <Button
        onClick={handleStripePayment}
        className="w-full bg-green-600 hover:bg-green-700 rounded-[10px] p-2.5 h-12"
        disabled={Boolean(isLoading) || (Boolean(isGiftPayment) && friends === null)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="font-medium text-white">{buttonText}</span>
        )}
      </Button>
    );
  }

  return null;
}