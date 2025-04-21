
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChatOptionProps {
  text: string;
  onClick: (option: string) => void;
  active?: boolean;
}

const ChatOption = ({ text, onClick, active }: ChatOptionProps) => {
  return (
    <Button
      variant={active ? "default" : "outline"}
      className={cn(
        "mb-2 mr-2 whitespace-normal text-left h-auto py-2",
        active && "bg-fashion-pink hover:bg-fashion-pink/90"
      )}
      onClick={() => onClick(text)}
    >
      {text}
    </Button>
  );
};

export default ChatOption;
