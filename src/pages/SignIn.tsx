
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, MessageSquare, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!email.includes('@') || password.length < 6) {
      toast({
        title: "Invalid credentials",
        description: "Please enter a valid email and password (min 6 characters)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // This is a mock authentication - in a real app, you'd validate with a backend
    setTimeout(() => {
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({ email }));
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to Style Savvy Scribe",
      });
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fashion-beige via-white to-fashion-lavender p-4 md:p-6 lg:p-8 flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-3">
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
        </div>
        
        <div className="glass shadow-2xl rounded-2xl p-6 md:p-8 animate-scale-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-fashion-pink/10 rounded-full">
              <Lock className="h-8 w-8 text-fashion-pink" />
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-fashion-charcoal text-center mb-6">
            Sign in to your account
          </h2>
          
          <form onSubmit={handleSignIn}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-fashion-charcoal">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email" 
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-fashion-pink/20 focus:border-fashion-pink focus:ring-fashion-pink/30"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-fashion-charcoal">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-fashion-pink/20 focus:border-fashion-pink focus:ring-fashion-pink/30"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className={cn(
                  "w-full bg-fashion-pink hover:bg-fashion-pink/90 text-white transition-all",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="typing-indicator mr-2">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>Demo access: Any email with '@' and password with 6+ chars</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
