
import { useNavigate } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import { Palette, MessageSquare, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
    navigate("/signin");
  };
  
  // Get user email from localStorage
  const userEmail = JSON.parse(localStorage.getItem("user") || '{"email":"User"}').email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fashion-beige via-white to-fashion-lavender p-4 md:p-6 lg:p-8">
      <header className="max-w-4xl mx-auto pt-8 pb-6 flex flex-col items-center animate-fade-in">
        <div className="w-full flex justify-end mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <Button 
              variant="outline"
              size="sm"
              className="text-fashion-pink hover:text-white hover:bg-fashion-pink/80 border-fashion-pink/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/40 rounded-full shadow-md">
              <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-fashion-pink animate-pulse" />
            </div>
            <div className="p-2 bg-white/40 rounded-full shadow-md">
              <MessageSquare className="h-6 w-6 md:h-7 md:w-7 text-fashion-sage" />
            </div>
            <div className="p-2 bg-white/40 rounded-full shadow-md">
              <Palette className="h-6 w-6 md:h-7 md:w-7 text-fashion-charcoal animate-pulse" />
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-fashion-pink via-fashion-charcoal to-fashion-sage bg-clip-text text-transparent font-extrabold text-center text-3xl md:text-4xl lg:text-5xl drop-shadow-lg tracking-tight font-playfair">
            Style Savvy Scribe
          </h1>
          <p className="text-center text-md md:text-lg mt-3 text-muted-foreground max-w-2xl font-medium px-4">
            Your personal fashion assistant - Ask me anything about style, trends and fashion tips.
          </p>
        </div>
        <div className="w-40 my-6 md:my-8 border-b-2 border-fashion-pink/60 rounded-full opacity-75" />
      </header>
      
      <main className="flex flex-col items-center w-full">
        <div className="w-full max-w-4xl px-4 md:px-6 lg:px-0 pb-8 md:pb-12">
          <div className="glass shadow-2xl rounded-2xl p-2 md:p-4 animate-scale-in hover:shadow-fashion-pink/30 hover:shadow-xl transition-all duration-300">
            <ChatInterface />
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-4 py-6 text-center text-xs md:text-sm text-muted-foreground">
        <p>Fashion blog content is aggregated for demonstration purposes.</p>
        <p className="mt-1">© {new Date().getFullYear()} Style Savvy Scribe</p>
      </footer>
    </div>
  );
};

export default Index;
