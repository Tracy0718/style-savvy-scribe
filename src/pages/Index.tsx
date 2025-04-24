
import ChatInterface from "@/components/ChatInterface";
import { Palette, Sparkles, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fashion-beige via-white to-fashion-lavender p-0">
      <header className="max-w-4xl mx-auto pt-8 pb-6 flex flex-col items-center animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-fashion-pink animate-pulse" />
            <MessageSquare className="h-6 w-6 text-fashion-sage" />
            <Palette className="h-6 w-6 text-fashion-charcoal animate-pulse" />
          </div>
          <div className="bg-gradient-to-r from-fashion-pink via-fashion-charcoal to-fashion-sage bg-clip-text text-transparent font-extrabold text-center text-4xl md:text-5xl lg:text-6xl drop-shadow-lg tracking-tight font-playfair">
            Style Savvy Scribe
          </div>
          <p className="text-center text-md md:text-lg mt-1 text-muted-foreground max-w-xl font-medium">
            Your personal fashion assistant - Ask me anything about style, trends and fashion tips.
          </p>
        </div>
        <div className="w-28 my-6 border-b-2 border-fashion-pink/60 rounded-full opacity-75" />
      </header>
      
      <main className="flex flex-col items-center w-full">
        <div className="w-full max-w-4xl px-1 md:px-6 lg:px-0 pb-8">
          <div className="glass shadow-2xl rounded-2xl p-1 md:p-3 lg:p-4 animate-scale-in hover:shadow-fashion-pink/20 hover:shadow-xl transition-all duration-300">
            <ChatInterface />
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-4 py-5 text-center text-xs md:text-sm text-muted-foreground">
        <p>Fashion blog content is aggregated for demonstration purposes.</p>
        <p className="mt-1">© {new Date().getFullYear()} Style Savvy Scribe</p>
      </footer>
    </div>
  );
};

export default Index;
