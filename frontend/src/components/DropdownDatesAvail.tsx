import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

interface DropdownDatesAvailProps {
  dates: [string, string, string][];
  selectedDates: string[];
  setSelectedDates: Dispatch<SetStateAction<string[]>>;
  className?: string;
}

export const DropdownDatesAvail = ({
  dates = [],
  selectedDates = [],
  setSelectedDates,
  className,
}: DropdownDatesAvailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <div className="mr-2">
            {isOpen ? (
              <ChevronUp className="text-ilc-yellow" />
            ) : (
              <ChevronDown className="text-ilc-yellow" />
            )}
          </div>
          DATES AVAILABLE
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>DATES AVAILABLE</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dates.length > 0 ? (
          dates.map(([availability, time_from, time_to], index) => {
            const dateKey = `${availability}-${time_from}-${time_to}`;
            return (
              <DropdownMenuCheckboxItem
                key={index}
                checked={selectedDates.includes(dateKey)}
                onCheckedChange={() => toggleDate(dateKey)}
              >
                {availability}
                <span className="text-xs text-gray-500">
                  {time_from} - {time_to}
                </span>
              </DropdownMenuCheckboxItem>
            );
          })
        ) : (
          <div className="px-2 py-1 text-sm">No dates available</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
