import { useFlutterwave } from "flutterwave-react-v3";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import intaxios from "../../lib/axios"

export const StreampassPaymentButton = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const flutterwaveConfig = {
    public_key: "YOUR_FLUTTERWAVE_PUBLIC_KEY",
    tx_ref: Date.now().toString(),
    amount: 45000,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "wunmi@gmail.com",
      phone_number: "080****4528",
      name: "Wunmi",
    },
    customizations: {
      title: "FaNect Streampass",
      description: "Purchase Streampass",
      logo: "https://yourdomain.com/logo.png",
    },
  };

  const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);

  // Stripe handler
  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      const { data } = await intaxios.post("streampass/payments/stripe/create-checkout-session", { eventId: id });
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
        onClick={() =>
          handleFlutterwavePayment({
            callback: (response) => {
              // Optionally verify payment on your backend here
              if (response.status === "successful") {
                navigate(`/dashboard/tickets/event/paid/${id}`);
              }
            },
            onClose: () => setIsLoading(false),
          })
        }
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
};