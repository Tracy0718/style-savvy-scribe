
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserRound, Bot } from "lucide-react";

export interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <Avatar className="h-12 w-12 ring-2 ring-fashion-pink/20 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-fashion-pink/40 shadow-lg">
          <AvatarImage src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80" alt="Fashion Assistant" />
          <AvatarFallback className="bg-gradient-to-br from-[#1A1F2C] to-[#8B5CF6] text-white">
            <Bot className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl message-appear backdrop-blur-sm",
          isBot
            ? "bg-gradient-to-br from-white/95 to-fashion-lavender/90 text-fashion-charcoal border border-fashion-lavender/30"
            : "bg-gradient-to-br from-fashion-pink to-fashion-pink/80 text-white border border-fashion-pink/20"
        )}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <span className="text-xs opacity-70 mt-2 self-end">{timestamp}</span>
        )}
      </div>
      {!isBot && (
        <Avatar className="h-12 w-12 ring-2 ring-fashion-pink/20 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-fashion-pink/40 shadow-lg">
          <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80" alt="You" />
          <AvatarFallback className="bg-gradient-to-br from-[#0EA5E9] to-[#8E9196] text-white">
            <UserRound className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
