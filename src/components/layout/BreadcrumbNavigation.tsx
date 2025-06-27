import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const BreadcrumbNavigation = ({ items, className }: BreadcrumbNavigationProps) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.isCurrentPage || !item.href ? (
                <BreadcrumbPage className="font-text-lg-semibold text-gray-800 dark:text-gray-200">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    to={item.href} 
                    className="font-text-lg-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="mx-2 text-gray-400 dark:text-gray-500">
                /
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

// Hook to generate breadcrumbs based on current route
export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with Home for dashboard routes
    if (pathSegments[0] === 'dashboard') {
      breadcrumbs.push({
        label: 'Home',
        href: '/dashboard/home'
      });

      // Handle different dashboard sections
      if (pathSegments.length > 1) {
        const section = pathSegments[1];
        
        switch (section) {
          case 'home':
            breadcrumbs[0].isCurrentPage = true;
            break;
            
          case 'tickets':
            if (pathSegments.length === 2) {
              breadcrumbs.push({
                label: 'Streampass',
                isCurrentPage: true
              });
            } else if (pathSegments[2] === 'event') {
              breadcrumbs.push({
                label: 'Streampass',
                href: '/dashboard/tickets'
              });
              
              if (pathSegments[3] && pathSegments[4]) {
                const eventType = pathSegments[3];
                const eventTypeLabels: { [key: string]: string } = {
                  'streampass': 'Purchase Streampass',
                  'gift': 'Gift Streampass',
                  'paid': 'Event Ticket',
                  'giftpaid': 'Gift Confirmation'
                };
                
                breadcrumbs.push({
                  label: eventTypeLabels[eventType] || 'Event Details',
                  isCurrentPage: true
                });
              }
            } else if (pathSegments[2] === 'watch-event') {
              breadcrumbs.push({
                label: 'Streampass',
                href: '/dashboard/tickets'
              });
              
              if (pathSegments[3] && pathSegments[4]) {
                const watchType = pathSegments[3];
                const watchTypeLabels: { [key: string]: string } = {
                  'live': 'Live Event',
                  'past': 'Event Replay',
                  'upcoming': 'Upcoming Event'
                };
                
                breadcrumbs.push({
                  label: watchTypeLabels[watchType] || 'Watch Event',
                  isCurrentPage: true
                });
              }
            }
            break;
            
          case 'organise':
            if (pathSegments.length === 2) {
              breadcrumbs.push({
                label: 'Organise Events',
                isCurrentPage: true
              });
            } else if (pathSegments[2] === 'analytics' && pathSegments[3]) {
              breadcrumbs.push({
                label: 'Organise Events',
                href: '/dashboard/organise'
              });
              breadcrumbs.push({
                label: 'Event Analytics',
                isCurrentPage: true
              });
            }
            break;
            
          case 'settings':
            breadcrumbs.push({
              label: 'Settings',
              isCurrentPage: true
            });
            break;
            
          case 'notifications':
            breadcrumbs.push({
              label: 'Notifications',
              isCurrentPage: true
            });
            break;
            
          case 'help':
            breadcrumbs.push({
              label: 'Help & Support',
              isCurrentPage: true
            });
            break;
            
          default:
            breadcrumbs.push({
              label: section.charAt(0).toUpperCase() + section.slice(1),
              isCurrentPage: true
            });
        }
      }
    } else {
      // Handle non-dashboard routes
      if (pathSegments[0] === 'event' && pathSegments[1]) {
        breadcrumbs.push({
          label: 'Home',
          href: '/'
        });
        breadcrumbs.push({
          label: 'Event Details',
          isCurrentPage: true
        });
      } else if (pathSegments[0] === 'search') {
        breadcrumbs.push({
          label: 'Home',
          href: '/'
        });
        breadcrumbs.push({
          label: 'Search Results',
          isCurrentPage: true
        });
      }
    }

    return breadcrumbs;
  };

  return generateBreadcrumbs();
};