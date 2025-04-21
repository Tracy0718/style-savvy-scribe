
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-fashion-beige via-white to-fashion-lavender p-4">
      <header className="max-w-4xl mx-auto py-4 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-fashion-charcoal">
          Style Savvy Scribe
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          Your personal fashion blog aggregator and style guide
        </p>
      </header>
      
      <main>
        <ChatInterface />
      </main>
      
      <footer className="max-w-4xl mx-auto mt-8 py-4 text-center text-sm text-muted-foreground">
        <p>Fashion blog content is aggregated for demonstration purposes.</p>
        <p className="mt-1">© {new Date().getFullYear()} Style Savvy Scribe</p>
      </footer>
    </div>
  );
};

export default Index;
