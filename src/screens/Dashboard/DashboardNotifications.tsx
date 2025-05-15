import { BellIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";


// Define notification data structure for better maintainability
const notifications = [
  {
    id: 1,
    boldText: "Wizkid Live in Atlanta",
    regularText: " live streaming has begun",
  },
  {
    id: 2,
    boldText: "Sandra Chukwunonso",
    regularText: " just followed you",
  },
  {
    id: 3,
    regularText: "You have successfully registered for ",
    boldText: "Wizkid Live in Atlanta",
    trailingText: "  ",
  },
  {
    id: 4,
    regularText: "You have just followed ",
    boldText: "Asake",
    middleText: " and will be notified on all ",
    secondBoldText: "Asake",
    trailingText: " events",
  },
  {
    id: 5,
    boldText: "Wizkid Live in Atlanta",
    regularText: " live streaming has begun",
  },
  {
    id: 6,
    boldText: "Wizkid Live in Atlanta",
    regularText: " live streaming has begun",
  },
  {
    id: 7,
    boldText: "Wizkid Live in Atlanta",
    regularText: " live streaming has begun",
  },
  {
    id: 8,
    boldText: "Wizkid Live in Atlanta",
    regularText: " live streaming has begun",
  },
  {
    id: 9,
    boldText: "Wizkid Live in Atlanta",
    regularText: " live streaming has begun",
  },
];


export const DashboardNotifications = () => {
  return (
    <div className="flex flex-col gap-16 mb-20">
      <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="text-gray-500 dark:text-gray-400">View your notifications</p>
    </div>
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex-col items-start gap-10 inline-flex">
        <div className="flex-col items-start gap-6 inline-flex">
          {notifications.map((notification, index) => (
            <Card
              key={notification.id}
              className={`w-[907px] border-0 rounded-none border-b dark:border-[#2e483a] border-[#535862] shadow-shadow-xs ${
                index === 0 ? "mt-[-1.00px]" : ""
              } ${index === notifications.length - 1 ? "mb-[-1.00px]" : ""}`}
            >
              <CardContent className="flex items-center gap-2 px-3.5 py-2.5 h-[82px]">
                <div className="flex items-center gap-4 relative flex-1 grow">
                  <div className="items-center justify-center gap-2.5 p-2.5 dark:bg-[#2e483a] rounded-[20px] inline-flex">
                    <BellIcon className="w-6 h-6" />
                  </div>

                  <div className="relative flex-1 [font-family:'Sofia_Pro-Bold',Helvetica] font-normal text-[#bbbbbb] text-base leading-4">
                    {notification.regularText &&
                      !notification.boldText.startsWith(
                        notification.regularText,
                      ) && (
                        <span className="[font-family:'Sofia_Pro-Regular',Helvetica] tracking-[-0.05px]">
                          {notification.regularText}
                        </span>
                      )}

                    {notification.boldText && (
                      <span className="font-bold tracking-[-0.05px]">
                        {notification.boldText}
                      </span>
                    )}

                    {notification.middleText && (
                      <span className="[font-family:'Sofia_Pro-Regular',Helvetica] tracking-[-0.05px]">
                        {notification.middleText}
                      </span>
                    )}

                    {notification.secondBoldText && (
                      <span className="font-bold tracking-[-0.05px]">
                        {notification.secondBoldText}
                      </span>
                    )}

                    {notification.trailingText && (
                      <span className="[font-family:'Sofia_Pro-Regular',Helvetica] tracking-[-0.05px]">
                        {notification.trailingText}
                      </span>
                    )}

                    {notification.regularText &&
                      notification.boldText &&
                      !notification.middleText &&
                      !notification.trailingText && (
                        <span className="[font-family:'Sofia_Pro-Regular',Helvetica] tracking-[-0.05px]">
                          {notification.regularText}
                        </span>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};


