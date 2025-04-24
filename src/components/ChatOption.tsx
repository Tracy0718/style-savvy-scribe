
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
        "mb-3 mr-3 whitespace-normal text-left h-auto py-3 px-5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md scale-hover",
        active 
          ? "bg-fashion-pink hover:bg-fashion-pink/90 btn-glow" 
          : "bg-white/70 hover:bg-fashion-lavender/40 border-fashion-pink/30"
      )}
      onClick={() => onClick(text)}
    >
      <MessageCircle className={cn(
        "h-4 w-4 shrink-0", 
        active ? "text-white" : "text-fashion-pink"
      )} />
      <span>{text}</span>
    </Button>
  );
};

export default ChatOption;
