
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

export interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <Avatar className="h-9 w-9 shadow-sm">
          <AvatarImage src="/placeholder.svg" alt="Bot" />
          <AvatarFallback className="bg-gradient-to-br from-fashion-pink to-fashion-sage text-white text-xs flex items-center justify-center">
            <Lightbulb className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[85%] rounded-2xl p-4 shadow-sm transition-all duration-300",
          isBot
            ? "bg-gradient-to-br from-secondary/90 to-secondary/70 text-secondary-foreground"
            : "bg-gradient-to-br from-fashion-pink to-fashion-pink/80 text-primary-foreground"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <span className="text-xs opacity-70 mt-2 self-end">{timestamp}</span>
        )}
      </div>
      {!isBot && (
        <Avatar className="h-9 w-9 shadow-sm">
          <AvatarImage src="/placeholder.svg" alt="You" />
          <AvatarFallback className="bg-gradient-to-br from-fashion-charcoal to-fashion-sage text-white text-xs">ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
