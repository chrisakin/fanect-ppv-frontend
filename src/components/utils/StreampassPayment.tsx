import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import intaxios from "../../lib/axios"
export function StreampassPaymentButton(): JSX.Element | null {
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

  // Flutterwave config
  const handleFlutterwavePayment = async () => {
  setIsLoading(true);
  try {
    const { data } = await intaxios.post('streampass/payments/flutterwave/initialize', { eventId: id, currency: 'NGN' });
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
    setIsLoading(true);
    try {
      const { data } = await intaxios.post("streampass/payments/stripe/create-checkout-session", { eventId: id, currency: 'usd' });
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

  if (paymentMethod === "flutterwave") {
    return (
      <Button
        onClick={handleFlutterwavePayment}
        className="w-full bg-green-600 hover:bg-green-700 rounded-[10px] p-2.5 h-12"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="font-medium text-white">Pay with Flutterwave</span>
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
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <span className="font-medium text-white">Pay with Stripe</span>
      )}
    </Button>
  );
}

return null;
};