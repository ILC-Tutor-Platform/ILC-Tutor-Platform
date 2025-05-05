import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type DropdownDegreeProgramProps = {
  selectedProgram: string | null;
  onSelectProgram: (programName: string) => void;
};

const degreePrograms = [
  { name: "AA Sports Studies" },
  { name: "BS Agribusiness Economics" },
  { name: "BS Anthropology" },
  { name: "BS Applied Mathematics" },
  { name: "BS Architecture" },
  { name: "BS Biology" },
  { name: "BA Communication and Media Arts" },
  { name: "BS Computer Science" },
  { name: "BS Data Science" },
  { name: "BA English" },
  { name: "BS Food Technology" },
  { name: "BS Sports Science" },
];

const DropdownDegreeProgram = ({
  selectedProgram,
  onSelectProgram,
}: DropdownDegreeProgramProps) => {
  const [isDropped, setIsDropped] = useState(false);

  return (
    <DropdownMenu open={isDropped} onOpenChange={setIsDropped}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsDropped(!isDropped)}
          className="border-black w-full"
        >
          <div className="flex items-center w-full justify-between">
            <p>{selectedProgram || "Select Degree Program"}</p>
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
