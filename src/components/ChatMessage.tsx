
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
        <Avatar className="h-10 w-10 shadow-md border-2 border-white/50">
          <AvatarImage src="/placeholder.svg" alt="Bot" />
          <AvatarFallback className="bg-gradient-to-br from-fashion-pink to-fashion-sage text-white text-xs flex items-center justify-center">
            <Lightbulb className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[85%] rounded-2xl p-4 shadow-md transition-all duration-300 scale-hover message-appear",
          isBot
            ? "bg-gradient-to-br from-secondary/90 via-secondary/80 to-secondary/70 text-secondary-foreground border border-white/20"
            : "bg-gradient-to-br from-fashion-pink to-fashion-pink/80 text-primary-foreground border border-fashion-pink/20"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <span className="text-xs opacity-70 mt-2 self-end">{timestamp}</span>
        )}
      </div>
      {!isBot && (
        <Avatar className="h-10 w-10 shadow-md border-2 border-white/50">
          <AvatarImage src="/placeholder.svg" alt="You" />
          <AvatarFallback className="bg-gradient-to-br from-fashion-charcoal to-fashion-sage text-white text-xs">ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
