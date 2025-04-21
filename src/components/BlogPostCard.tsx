
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/data/mockFashionData";

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const { title, excerpt, imageUrl, source, publishedAt, url, categories, tags } = post;
  
  // Format date for display
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-fashion-pink text-white">{source}</Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-bold line-clamp-2 hover:text-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm line-clamp-3 mb-3">{excerpt}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {categories.map((category) => (
            <Badge key={category} className="bg-secondary text-fashion-charcoal">
              {category}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          className="text-xs"
          onClick={() => window.open(url, "_blank")}
        >
          Read More
        </Button>
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => {
            // This would share the post in a real app
            alert(`Sharing: ${title}`);
          }}
        >
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
