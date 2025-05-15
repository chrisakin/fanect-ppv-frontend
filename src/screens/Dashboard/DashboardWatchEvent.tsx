import { VideoPlayer } from "@/components/layout/VideoPlayer";
import { WatchEventDetails } from "@/components/layout/WatchEventDetails";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export const DashboardWatchEvent = (): JSX.Element => {
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
    <div className="flex flex-col w-full px-4 md:px-6 lg:px-8  mx-auto items-start py-6 md:py-8 lg:py-10">
      <div className="flex flex-col w-full items-start gap-8 md:gap-10 lg:gap-14">
        <VideoPlayer />
        <WatchEventDetails />
      </div>
    </div>
    </div>
  );
};