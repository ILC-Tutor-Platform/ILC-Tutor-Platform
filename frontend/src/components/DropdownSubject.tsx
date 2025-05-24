import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

interface DropdownSubjectsProps {
  subjects: string[];
  selectedSubject: string | null;
  setSelectedSubject: Dispatch<SetStateAction<string | null>>;
  className?: string;
}

const DropdownSubjects = ({
  subjects = [],
  selectedSubject,
  setSelectedSubject,
  className,
}: DropdownSubjectsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectSubject = (subject: string) => {
    setSelectedSubject(subject);
    setIsOpen(false); // Close dropdown on select — smooth UX
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
          {selectedSubject || 'Select Subject'}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Subjects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {subjects.length > 0 ? (
          subjects.map((subject, idx) => (
            <DropdownMenuItem
              key={idx}
              onSelect={() => selectSubject(subject)}
              className={
                subject === selectedSubject
                  ? 'font-semibold text-ilc-yellow'
                  : ''
              }
            >
              {subject}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-1 text-sm">No subjects available.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownSubjects;
