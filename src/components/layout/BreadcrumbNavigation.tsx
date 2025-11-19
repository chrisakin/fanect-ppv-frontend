import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

/**
 * BreadcrumbItem
 *
 * Represents a single breadcrumb segment in the navigation trail.
 *  - label: Display text for the breadcrumb item
 *  - href: (optional) Route URL for clickable breadcrumbs. If omitted, item is not clickable.
 *  - isCurrentPage: (optional) If true, displays as current page (bold, non-clickable). Typically the last item.
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

/**
 * BreadcrumbNavigationProps
 *
 * Props for the BreadcrumbNavigation component.
 *  - items: Array of BreadcrumbItem objects defining the breadcrumb trail
 *  - className: (optional) CSS classes to apply to the root Breadcrumb component
 */
interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * BreadcrumbNavigation
 *
 * React component that renders a visual breadcrumb trail (navigation path).
 * Displays a "/" separator between items and styles the current page differently.
 *
 * Features:
 *  - Renders clickable links for non-current items (links to item.href)
 *  - Renders bold text for current page item (no href, no click handler)
 *  - Adds "/" separators between items
 *  - Applies responsive styling with dark mode support
 *
 * Arguments:
 *  - items: BreadcrumbItem[] – Array defining the breadcrumb trail
 *  - className: string (optional) – CSS classes for the root element
 *
 * Returns: JSX.Element
 *
 * Example:
 *   <BreadcrumbNavigation
 *     items={[
 *       { label: 'Home', href: '/dashboard' },
 *       { label: 'Events', href: '/dashboard/events' },
 *       { label: 'Event Details', isCurrentPage: true }
 *     ]}
 *   />
 */
export const BreadcrumbNavigation = ({ items, className }: BreadcrumbNavigationProps) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {/* Current page or no href: render as bold text (not clickable) */}
              {item.isCurrentPage || !item.href ? (
                <BreadcrumbPage className="font-text-lg-semibold text-gray-800 dark:text-gray-200">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                /* Clickable link for navigation to item.href */
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
            {/* Separator: "/" shown between items (not after the last item) */}
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

// ============================================================================
// BREADCRUMB GENERATION HOOK
// ============================================================================

/**
 * useBreadcrumbs
 *
 * React hook that automatically generates breadcrumb items based on the current route.
 * Parses the URL path and returns a BreadcrumbItem array ready for BreadcrumbNavigation.
 *
 * Supported Route Structures:
 *
 * Dashboard Routes:
 *  - /dashboard/home → [Home (current)]
 *  - /dashboard/tickets → [Home, Streampass (current)]
 *  - /dashboard/tickets/event/streampass/{id} → [Home, Streampass, Purchase Streampass (current)]
 *  - /dashboard/tickets/event/gift/{id} → [Home, Streampass, Gift Streampass (current)]
 *  - /dashboard/tickets/event/paid/{id} → [Home, Streampass, Event Ticket (current)]
 *  - /dashboard/tickets/watch-event/live/{id} → [Home, Streampass, Live Event (current)]
 *  - /dashboard/tickets/watch-event/past/{id} → [Home, Streampass, Event Replay (current)]
 *  - /dashboard/organise → [Home, Organise Events (current)]
 *  - /dashboard/organise/analytics/{id} → [Home, Organise Events, Event Analytics (current)]
 *  - /dashboard/settings → [Home, Settings (current)]
 *  - /dashboard/notifications → [Home, Notifications (current)]
 *
 * Public Routes:
 *  - /event/{id} → [Home, Event Details (current)]
 *  - /search → [Home, Search Results (current)]
 *
 * Returns: BreadcrumbItem[] – Array of breadcrumb items ready to render
 *
 * Example:
 *   const breadcrumbs = useBreadcrumbs(); // Auto-generated based on current URL
 *   return <BreadcrumbNavigation items={breadcrumbs} />;
 */
export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  /**
   * generateBreadcrumbs
   *
   * Internal function that parses URL path segments and constructs breadcrumb items.
   * Applies route-specific logic to map path segments to user-friendly breadcrumb labels.
   *
   * Returns: BreadcrumbItem[]
   */
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // ========================================================================
    // DASHBOARD ROUTES
    // ========================================================================
    if (pathSegments[0] === 'dashboard') {
      // Always start with Home for dashboard routes
      breadcrumbs.push({
        label: 'Home',
        href: '/dashboard/home'
      });

      // Handle different dashboard sections
      if (pathSegments.length > 1) {
        const section = pathSegments[1];
        
        switch (section) {
          case 'home':
            // /dashboard/home → Mark Home as current page
            breadcrumbs[0].isCurrentPage = true;
            break;
            
          case 'tickets':
            // /dashboard/tickets routes: Streampass management and event viewing
            if (pathSegments.length === 2) {
              // /dashboard/tickets → [Home, Streampass (current)]
              breadcrumbs.push({
                label: 'Streampass',
                isCurrentPage: true
              });
            } else if (pathSegments[2] === 'event') {
              // /dashboard/tickets/event/* → Purchase/gift flows
              breadcrumbs.push({
                label: 'Streampass',
                href: '/dashboard/tickets'
              });
              
              if (pathSegments[3] && pathSegments[4]) {
                const eventType = pathSegments[3];
                // Map event types to breadcrumb labels
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
              // /dashboard/tickets/watch-event/* → Event watching/replay flows
              breadcrumbs.push({
                label: 'Streampass',
                href: '/dashboard/tickets'
              });
              
              if (pathSegments[3] && pathSegments[4]) {
                const watchType = pathSegments[3];
                // Map watch types (live/past/upcoming) to labels
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
            // /dashboard/organise routes: Event creation and analytics
            if (pathSegments.length === 2) {
              // /dashboard/organise → [Home, Organise Events (current)]
              breadcrumbs.push({
                label: 'Organise Events',
                isCurrentPage: true
              });
            } else if (pathSegments[2] === 'analytics' && pathSegments[3]) {
              // /dashboard/organise/analytics/{id} → [Home, Organise Events, Event Analytics (current)]
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
            // /dashboard/settings → User account and preference settings
            breadcrumbs.push({
              label: 'Settings',
              isCurrentPage: true
            });
            break;
            
          case 'notifications':
            // /dashboard/notifications → User notification center
            breadcrumbs.push({
              label: 'Notifications',
              isCurrentPage: true
            });
            break;
            
          case 'help':
            // /dashboard/help → Help and support resources
            breadcrumbs.push({
              label: 'Help & Support',
              isCurrentPage: true
            });
            break;
            
          default:
            // Fallback for unmapped dashboard sections
            breadcrumbs.push({
              label: section.charAt(0).toUpperCase() + section.slice(1),
              isCurrentPage: true
            });
        }
      }
    } else {
      // ====================================================================
      // PUBLIC ROUTES (non-dashboard)
      // ====================================================================
      if (pathSegments[0] === 'event' && pathSegments[1]) {
        // /event/{id} → Event detail page
        breadcrumbs.push({
          label: 'Home',
          href: '/'
        });
        breadcrumbs.push({
          label: 'Event Details',
          isCurrentPage: true
        });
      } else if (pathSegments[0] === 'search') {
        // /search → Search results page
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