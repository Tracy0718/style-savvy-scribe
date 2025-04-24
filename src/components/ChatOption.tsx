
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

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
        "mb-2 mr-2 whitespace-normal text-left h-auto py-2 px-4 rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md",
        active 
          ? "bg-fashion-pink hover:bg-fashion-pink/90" 
          : "bg-white/60 hover:bg-fashion-lavender/30 border-fashion-pink/30"
      )}
      onClick={() => onClick(text)}
    >
      <MessageCircle className="h-3.5 w-3.5 shrink-0 opacity-80" />
      <span>{text}</span>
    </Button>
  );
};

export default ChatOption;
