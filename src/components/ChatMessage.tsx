
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserRound, MessageSquare } from "lucide-react";

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
        <Avatar className="h-12 w-12 ring-2 ring-fashion-pink/20 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-fashion-pink/40">
          <AvatarImage src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" alt="Bot" />
          <AvatarFallback className="bg-gradient-to-br from-fashion-pink to-fashion-sage text-white">
            <MessageSquare className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl message-appear backdrop-blur-sm",
          isBot
            ? "bg-gradient-to-br from-white/90 to-fashion-lavender/80 text-fashion-charcoal border border-fashion-lavender/30"
            : "bg-gradient-to-br from-fashion-pink to-fashion-pink/80 text-white border border-fashion-pink/20"
        )}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <span className="text-xs opacity-70 mt-2 self-end">{timestamp}</span>
        )}
      </div>
      {!isBot && (
        <Avatar className="h-12 w-12 ring-2 ring-fashion-pink/20 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-fashion-pink/40">
          <AvatarImage src="https://images.unsplash.com/photo-1501286353178-1ec881214838" alt="You" />
          <AvatarFallback className="bg-gradient-to-br from-fashion-charcoal to-fashion-sage text-white">
            <UserRound className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
