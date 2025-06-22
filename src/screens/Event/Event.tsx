import { GiftIcon, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoginModal } from "../../components/modals/LoginModal";
import { useAuthStore } from "../../store/authStore";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useEventStore } from "@/store/eventStore";

export const Event = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { singleEvent, isLoading, fetchSingleEvent } = useEventStore();

  useEffect(() => {
    if (id) {
      fetchSingleEvent(id);
    }
  }, [id, fetchSingleEvent]);

  const handleActionClick = (type: string) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectUrl', `/dashboard/tickets/event/${type}/${id}`)
      setIsLoginModalOpen(true);
    } else {
      navigate(`/dashboard/tickets/event/${type}/${id}`);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!singleEvent) {
    return <div className="min-h-screen flex items-center justify-center">Event not found</div>;
  }

  const EventContent = () => (
    <>
      {/* Banner Section */}
      <section className="w-full flex flex-col items-center justify-center gap-5 pb-[30px]">
        <img
          className="w-full h-[200px] sm:h-[250px] md:h-[350px] object-cover rounded-lg"
          alt="Event banner"
          src={singleEvent.bannerUrl}
        />
      </section>

      {/* Event Details Section */}
      <section className="w-full max-w-[1280px] mx-auto flex flex-col">
        <div className="flex flex-col items-start gap-8 md:gap-12">
          <div className="w-full flex flex-col items-start gap-4 md:gap-6">
            {/* Event Title and Price */}
            <div className="w-full flex flex-col items-start gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {singleEvent.name}
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
                {singleEvent.price?.currency} {Number(singleEvent.price?.amount).toLocaleString()}
              </h2>

              {/* Action Buttons */}
              <div className="lg:w-[80%] w-full flex flex-col sm:flex-row items-start justify-between gap-4">
                 <Button 
                  className="w-full sm:flex-1 md:w-[400px] h-[45px] md:h-[50px] bg-green-600 hover:bg-green-700 rounded-[10px] text-white"
                  onClick={() => !singleEvent.hasStreamPass && handleActionClick('streampass')}
                  disabled={singleEvent.hasStreamPass}
                >
                  <span className="text-sm md:text-base font-semibold">
                    Buy Streampass
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full sm:flex-1 md:w-[400px] h-[45px] md:h-[50px] rounded-[10px] border border-solid border-green-600 text-green-600 hover:bg-green-600/10"
                  onClick={() => handleActionClick('gift')}
                >
                  <GiftIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="text-sm md:text-base font-semibold">
                    Gift a Friend
                  </span>
                </Button>
              </div>
            </div>

            {/* Event Description */}
            <Card className="w-full border-none shadow-none">
              <CardContent className="p-0 flex flex-col gap-2">
                <div className="flex flex-col gap-3 md:gap-4">
                  <h3 className="text-lg md:text-xl font-medium">
                    About this event
                  </h3>
                  <div className="whitespace-pre-wrap text-sm md:text-base">
                    {singleEvent.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <Button
          variant="ghost"
          className="mb-6 hover:bg-transparent p-0 h-auto text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back</span>
        </Button>
        <EventContent />
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-16 py-8">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-transparent p-0 h-auto text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back</span>
        </Button>
        <EventContent />
      </main>
      <Footer />
    </div>
  );
};