import { StreamingProvider } from "@/components/utils/StreamingProvider";
import { WatchEventDetails } from "@/components/layout/WatchEventDetails";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useEventStore } from "@/store/eventStore";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const DashboardWatchEvent = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { singleEvent, isLoading, fetchPurchasedEvent } = useEventStore();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id ) {
        navigate('/not-found');
        return;
      }

      try {
        await fetchPurchasedEvent(id);
      } catch (error) {
        navigate('/not-found');
      }
    };

    fetchEvent();
  }, [id,  fetchPurchasedEvent, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!singleEvent) {
    return <></>;
  }

  return (
    <div>
      <Breadcrumb className="flex items-center">
        <BreadcrumbItem>
          <BreadcrumbLink className="font-text-lg-medium text-gray-400">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
         /
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-text-lg-semibold text-gray-800">
            Event Details
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="flex flex-col w-full px-4 md:px-6 lg:px-8 mx-auto items-start py-6 md:py-8 lg:py-10">
        <div className="flex flex-col w-full items-start gap-8 md:gap-10 lg:gap-14">
          <StreamingProvider />
          <WatchEventDetails event={singleEvent} />
        </div>
      </div>
    </div>
  );
};