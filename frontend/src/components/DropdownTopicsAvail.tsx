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

interface DropdownTopicsAvailProps {
  topics: [string, string][];
  selectedTopics: string[];
  setSelectedTopics: Dispatch<SetStateAction<string[]>>;
  setSelectedTopicID: Dispatch<SetStateAction<string[]>>;
  selectedTopicID: string[];
  className?: string;
}

const DropdownTopicsAvail = ({
  topics = [],
  selectedTopicID,
  setSelectedTopics,
  setSelectedTopicID,
  className,
}: DropdownTopicsAvailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectTopic = (topic_title: string, topic_id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic_title)
        ? prev.filter((t) => t !== topic_title)
        : [...prev, topic_title],
    );

    setSelectedTopicID((prev) =>
      prev.includes(topic_id)
        ? prev.filter((id) => id !== topic_id)
        : [...prev, topic_id],
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
          Topics Offered
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Topics</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {topics.length > 0 ? (
          topics.map(([topic_title, topic_id], index) => {
            return (
              <DropdownMenuCheckboxItem
                key={index}
                checked={selectedTopicID.includes(topic_id)} // or selectedTopics.includes(topic_title)
                onCheckedChange={() => selectTopic(topic_title, topic_id)}
              >
                {topic_title}
              </DropdownMenuCheckboxItem>
            );
          })
        ) : (
          <div className="px-2 py-1 text-sm">
            No topics offered at the moment.
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownTopicsAvail;
