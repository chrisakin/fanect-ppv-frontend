import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { ButtonProps, buttonVariants } from "./button";

/**
 * Pagination - page navigation navigation
 * @component
 * Use: Pagination (nav), PaginationContent, PaginationItem, PaginationLink, etc.
 */
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

/**
 * PaginationContent - ul wrapper for pagination items
 * @component
 * Flex row with gap-1
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

/**
 * PaginationItem - li wrapper for individual pagination item
 * @component
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

/**
 * PaginationLink - page link button
 * @component
 * Props: isActive (highlights current page). Icon size
 */
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

/**
 * PaginationPrevious - "Previous" button with left chevron
 * @component
 * Navigates to previous page. Gap-1 padding
 */
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

/**
 * PaginationNext - "Next" button with right chevron
 * @component
 * Navigates to next page. Gap-1 padding
 */
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

/**
 * PaginationEllipsis - "..." separator between page numbers
 * @component
 * MoreHorizontalIcon. Aria-hidden
 */
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
