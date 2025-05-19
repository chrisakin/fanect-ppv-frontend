import { GiftIcon, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginModal } from "../../components/modals/LoginModal";
import { useAuthStore } from "../../store/authStore";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

// This would typically come from an API or database
const eventData = {
  id: "1",
  title: "Fido Live in Atlanta",
  price: "$29.99",
  date: "Saturday, 26th December, 2025",
  attendees: 156,
  description: {
    headline: "Experience the Magic of Fido Live",
    intro: "Join us for an unforgettable evening of music and entertainment as Fido takes the stage in Atlanta.",
    time: "Doors open at 7:00 PM EST | Show starts at 8:00 PM EST",
    about: "Fido, the chart-topping artist known for their electrifying performances, brings their spectacular show to Atlanta. This is more than just a concert - it's an immersive experience that will leave you breathless.",
    expectations: [
      "• High-quality live stream with multiple camera angles",
      "• Interactive chat with other fans",
      "• Exclusive behind-the-scenes content",
      "• Virtual meet and greet opportunities",
      "• Digital merchandise options"
    ]
  },
  images: {
    banner: "/image.png",
    attendees: ["/image.png", "/image-6.png", "/image.png"]
  }
};

export const Event = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const eventDetails = eventData;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleActionClick = (type: string) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      navigate(`/dashboard/tickets/event/${type}/${id}`);
    }
  };

  const EventContent = () => (
    <>
      {/* Banner Section */}
      <section className="w-full flex flex-col items-center justify-center gap-5 pb-[30px]">
        <img
          className="w-full h-[200px] sm:h-[250px] md:h-[350px] object-cover rounded-lg"
          alt="Event banner"
          src={eventDetails.images.banner}
        />

        {/* Pagination Dots */}
        <div className="flex w-[72px] items-center justify-between">
          <div className="bg-green-600 w-4 h-4 rounded-lg" />
          <div className="bg-gray-300 dark:bg-gray-700 w-4 h-4 rounded-lg" />
          <div className="bg-gray-300 dark:bg-gray-700 w-4 h-4 rounded-lg" />
        </div>
      </section>

      {/* Event Details Section */}
      <section className="w-full max-w-[1280px] mx-auto flex flex-col">
        <div className="flex flex-col items-start gap-8 md:gap-12">
          <div className="w-full flex flex-col items-start gap-4 md:gap-6">
            {/* Event Title and Price */}
            <div className="w-full flex flex-col items-start gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {eventDetails.title}
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
                {eventDetails.price}
              </h2>

              {/* Action Buttons */}
              <div className="lg:w-[80%] w-full flex flex-col sm:flex-row items-start justify-between gap-4">
                <Button 
                  className="w-full sm:flex-1 md:w-[400px] h-[45px] md:h-[50px] bg-green-600 hover:bg-green-700 rounded-[10px] text-white"
                  onClick={() => handleActionClick('streampass')}
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

            {/* Attendees */}
            <div className="flex w-full sm:w-auto items-center gap-4">
              <div className="text-xs md:text-sm">
                Join
              </div>
              <div className="relative w-[67px] h-[30px]">
                {eventDetails.images.attendees.map((img, index) => (
                  <img
                    key={index}
                    className="absolute w-[30px] h-[30px] top-0 object-cover rounded-full"
                    style={{ left: `${index * 15}px` }}
                    alt={`Attendee ${index + 1}`}
                    src={img}
                  />
                ))}
              </div>
              <div className="text-xs md:text-sm">
                and {eventDetails.attendees} others
              </div>
            </div>

            {/* Event Description */}
            <Card className="w-full border-none shadow-none">
              <CardContent className="p-0 flex flex-col gap-2">
                <div className="flex flex-col gap-3 md:gap-4">
                  <h3 className="text-lg md:text-xl font-medium">
                    {eventDetails.description.headline}
                  </h3>

                  <p className="text-sm md:text-base">
                    {eventDetails.description.intro}
                  </p>

                  <p className="text-sm md:text-base">
                    {eventDetails.description.time}
                  </p>

                  <p className="text-sm md:text-base">
                    {eventDetails.description.about}
                  </p>

                  <p className="text-sm md:text-base font-medium">
                    What to Expect:
                  </p>

                  {eventDetails.description.expectations.map(
                    (expectation, index) => (
                      <p
                        key={index}
                        className="text-sm md:text-base"
                      >
                        {expectation}
                      </p>
                    )
                  )}
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
      <main className="flex-1 px-4 md:px-8 lg:px-16 py-8">
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