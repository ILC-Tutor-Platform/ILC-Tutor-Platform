import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type DropdownDegreeProgramProps = {
  selectedProgram: string | null;
  onSelectProgram: (programName: string) => void;
  className?: string;
};

const degreePrograms = [
  { name: 'AA Sports Studies' },
  { name: 'BS Agribusiness Economics' },
  { name: 'BS Anthropology' },
  { name: 'BS Applied Mathematics' },
  { name: 'BS Architecture' },
  { name: 'BS Biology' },
  { name: 'BA Communication and Media Arts' },
  { name: 'BS Computer Science' },
  { name: 'BS Data Science' },
  { name: 'BA English' },
  { name: 'BS Food Technology' },
  { name: 'BS Sports Science' },
];

const DropdownDegreeProgram = ({
  selectedProgram,
  onSelectProgram,
  className,
}: DropdownDegreeProgramProps) => {
  const [isDropped, setIsDropped] = useState(false);

  return (
    <DropdownMenu open={isDropped} onOpenChange={setIsDropped}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsDropped(!isDropped)}
          className={`border border-black ${className}`}
        >
          <div className="flex items-center w-full justify-between">
            <p>{selectedProgram || 'Select Degree Program'}</p>
            {isDropped ? (
              <ChevronUp className="text-ilc-yellow" />
            ) : (
              <ChevronDown className="text-ilc-yellow" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {degreePrograms.map((program, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => {
              onSelectProgram(program.name); // Notify parent
              setIsDropped(false);
            }}
          >
            {program.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownDegreeProgram;
