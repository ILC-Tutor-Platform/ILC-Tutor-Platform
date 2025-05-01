import { useState } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

const availableDates = [
  { day: "Monday", time: "10:00 AM - 12:00 PM" },
  { day: "Wednesday", time: "2:00 PM - 4:00 PM" },
  { day: "Friday", time: "1:00 PM - 3:00 PM" },
];

export const DropdownDatesAvail = () => {
  const [isDropped, setIsDropped] = useState(false);
  const [selectedDates, setSelectedDates] = useState<number[]>([]); // holds indices of selected items

  const toggleDate = (index: number) => {
    setSelectedDates((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <DropdownMenu open={isDropped} onOpenChange={setIsDropped}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" onClick={() => setIsDropped(!isDropped)}>
          <div className="mr-2">
            {isDropped ? (
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

        {availableDates.map((date, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={selectedDates.includes(index)}
            onCheckedChange={() => toggleDate(index)}
          >
            {date.day}: {date.time}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};