import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "../../components/ui/button";
import axios from "@/lib/axios";
import { Header } from "@/components/layout/Header";

export const PaymentSuccess = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [giftStatus, setGiftStatus] = useState(false)
  const [message, setMessage] = useState("");
  const [eventId, setEventId] = useState("")
  const [searchParams] = useSearchParams();
   const [countdown, setCountdown] = useState(30);
   const { method } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setStatus("loading")
        // Collect possible params from Stripe or Flutterwave
         let payload: Record<string, string | null> = {
          paymentMethod: method || "",
        };

        if (method === "flutterwave") {
          payload.paymentReference = searchParams.get("tx_ref");
        } else if (method === "stripe") {
          payload.paymentReference = searchParams.get("session_id");
        }
        if(!searchParams.get("session_id") && !searchParams.get("tx_ref")) {
          setStatus("error");
          setMessage("Unable to verify payment or payment cancelled");
          return
        }
        const { data } = await axios.post("/streampass/payments/verify-payment", payload);
        if (data.streampass) {
          setStatus("success");
          setMessage(data.message || "Payment verified successfully!");
          setEventId(data.streampass.event)
          setGiftStatus(data.streampass.isGift)
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed.");
        }
        return
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "An error occurred while verifying your payment."
        );
      }
    };

    if (!hasRun.current) {
    verifyPayment();
    hasRun.current = true;
  }
  }, []);

    useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "success" && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    if (status === "success" && countdown === 0) {
      navigate(giftStatus == true ? `/dashboard/tickets/event/giftpaid/${eventId}` :`/dashboard/tickets/event/paid/${eventId}`);
    }
    return () => clearTimeout(timer);
  }, [status, countdown, navigate]);

  return (
    <>
    <Header />
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          <p className="text-lg font-medium">Verifying your payment...</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-600" />
          <h2 className="text-2xl font-semibold">Payment Successful!</h2>
          <p className="text-base text-gray-700">{message}</p>
          <p className="text-sm text-gray-500">
              Redirecting to ticket page in {countdown} second{countdown !== 1 ? "s" : ""}...
            </p>
            <Button onClick={() => navigate(giftStatus == true ? `/dashboard/tickets/event/giftpaid/${eventId}` :`/dashboard/tickets/event/paid/${eventId}`)}>Go to Streampass Page</Button>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="h-16 w-16 text-red-600" />
          <h2 className="text-2xl font-semibold">Payment Verification Failed</h2>
          <p className="text-base text-gray-700">{message}</p>
          <Button onClick={() => navigate("/dashboard/home")}>Go to Dashboard</Button>
        </>
      )}
    </div>
     </>
  );
};