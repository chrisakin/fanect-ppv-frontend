import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "../../components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";


export const PaginationIndex = (): JSX.Element => {  
    return (
        <div className="flex items-center justify-center w-full py-8">
        <Pagination>
          <PaginationContent className="flex items-center gap-2 flex-wrap justify-center">
            <PaginationItem>
              <PaginationPrevious
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md border border-solid border-[#d5d7da] text-foreground"
              >
                <ChevronLeftIcon className="w-3 h-3" />
              </PaginationPrevious>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground"
                href="#"
              >
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground"
                href="#"
              >
                2
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground"
                href="#"
              >
                3
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground" />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground"
                href="#"
              >
                50
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md border border-solid border-[#d5d7da] text-foreground"
              >
                <ChevronRightIcon className="w-3 h-3" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );  
    }