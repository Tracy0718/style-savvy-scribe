
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-2 p-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="Bot" />
          <AvatarFallback className="bg-fashion-pink text-white text-xs">FS</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[80%] rounded-lg p-4",
          isBot
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="text-sm">{message}</p>
        {timestamp && (
          <span className="text-xs opacity-70 mt-1">{timestamp}</span>
        )}
      </div>
      {!isBot && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="You" />
          <AvatarFallback className="bg-fashion-sage text-white text-xs">ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
