
// Mock fashion blog data for demonstration purposes
// In a production environment, this would be fetched from APIs or web scraping

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  url: string;
  categories: string[];
  tags: string[];
}

export interface UserPreference {
  id: string;
  name: string;
  value: string;
}

export const FASHION_CATEGORIES = [
  'Streetwear',
  'Haute Couture',
  'Casual',
  'Vintage',
  'Minimalist',
  'Bohemian',
  'Athleisure',
  'Formal',
  'Designer'
];

export const FASHION_SEASONS = [
  'Spring',
  'Summer',
  'Fall',
  'Winter',
  'Resort',
  'Pre-Fall'
];

export const FASHION_TAGS = [
  'Trending',
  'Sustainable',
  'Celebrity',
  'Runway',
  'Accessories',
  'Footwear',
  'Outerwear',
  'Denim',
  'Luxury',
  'Budget-friendly',
  'DIY',
  'Collaborations'
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Resurgence of Y2K Fashion: How Gen Z is Bringing Back the 2000s',
    excerpt: 'From low-rise jeans to baby tees, Y2K fashion is making a major comeback. Here\'s how to incorporate these nostalgic pieces into your modern wardrobe.',
    content: 'Y2K fashion has made an undeniable comeback, with Generation Z embracing the nostalgic styles that defined the late 1990s and early 2000s. Low-rise jeans, baby tees, butterfly clips, and platform shoes are once again becoming wardrobe staples. The resurgence is heavily influenced by social media platforms like TikTok and Instagram, where vintage fashion hauls and Y2K styling videos regularly go viral. Celebrities like Bella Hadid and Dua Lipa have also been spotted sporting these throwback looks, further cementing the trend\'s relevance in today\'s fashion landscape. To incorporate Y2K elements into your wardrobe without looking like you\'re wearing a costume, stylists recommend balancing vintage pieces with modern essentials and focusing on quality over quantity.',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
    source: 'Vogue',
    publishedAt: '2023-05-15',
    url: 'https://example.com/y2k-fashion',
    categories: ['Streetwear', 'Vintage'],
    tags: ['Trending', 'Celebrity', 'Accessories']
  },
  {
    id: '2',
    title: 'Sustainable Fashion: Brands Leading the Eco-Friendly Revolution',
    excerpt: 'As sustainability becomes increasingly important in the fashion industry, these innovative brands are leading the way with eco-friendly practices.',
    content: 'The fashion industry is one of the world\'s largest polluters, but a growing movement of sustainable brands is working to change that reality. Companies like Reformation, Patagonia, and Stella McCartney have long been champions of eco-friendly fashion, utilizing recycled materials, ethical labor practices, and transparent supply chains. Newer entrants like Veja, Girlfriend Collective, and Pangaia are also making waves with innovative approaches to sustainability, from biodegradable packaging to carbon-neutral shipping options. Beyond using sustainable materials, these brands are reimagining the entire lifecycle of clothing, with many implementing take-back programs and repair services to extend the lifespan of their products. Consumers are increasingly voting with their wallets, supporting brands that align with their environmental values and pushing the industry toward a more sustainable future.',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
    source: 'Elle',
    publishedAt: '2023-06-22',
    url: 'https://example.com/sustainable-fashion',
    categories: ['Casual', 'Minimalist'],
    tags: ['Sustainable', 'Luxury', 'Budget-friendly']
  },
  {
    id: '3',
    title: 'Fall 2023 Runway Report: The Standout Trends You Need to Know',
    excerpt: 'From New York to Paris, the Fall 2023 runway shows revealed the key trends that will define the upcoming season.',
    content: 'The Fall 2023 runway shows have concluded, leaving fashion enthusiasts with a clear roadmap of the season\'s defining trends. Oversized outerwear dominated the collections, with designers like Balenciaga and Prada showcasing voluminous coats and puffers in unexpected proportions. Rich, earthy tones were ubiquitous, with burgundy, forest green, and chocolate brown emerging as the season\'s key colors. Textural play was another notable trend, with designers mixing fabrics like leather, tweed, and velvet within single outfits to create depth and visual interest. Modest hemlines and conservative silhouettes suggested a move away from the revealing styles that have dominated recent seasons, though strategic cutouts and sheer panels maintained an element of sensuality. Accessories took a practical turn, with oversized bags, combat boots, and wraparound scarves complementing the season\'s ready-for-anything aesthetic.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae',
    source: 'Harper\'s Bazaar',
    publishedAt: '2023-03-10',
    url: 'https://example.com/fall-runway',
    categories: ['Haute Couture', 'Designer'],
    tags: ['Runway', 'Trending', 'Outerwear']
  },
  {
    id: '4',
    title: 'Athleisure Evolution: How Workout Wear Became Everyday Fashion',
    excerpt: 'The lines between athletic and casual wear continue to blur as athleisure solidifies its place in mainstream fashion.',
    content: 'What began as a practical solution for busy lifestyles has evolved into one of fashion\'s most enduring trends: athleisure. The category, which combines athletic functionality with leisure comfort, has transformed how people dress for everyday activities. Premium athleisure brands like Lululemon and Alo Yoga have achieved cult status, while luxury houses including Gucci and Dior have entered the market with high-end interpretations of workout essentials. The pandemic accelerated athleisure\'s dominance, as remote work normalized comfortable clothing for all occasions. Today\'s athleisure goes beyond basic leggings and hoodies, incorporating technical fabrics, architectural elements, and fashion-forward details that make these pieces appropriate for settings well beyond the gym. Styling innovations have also contributed to athleisure\'s staying power, with consumers pairing sports bras with blazers or teaming track pants with heels for a high-low aesthetic that feels thoroughly modern.',
    imageUrl: 'https://images.unsplash.com/photo-1483721310020-03333e577078',
    source: 'Fashionista',
    publishedAt: '2023-04-05',
    url: 'https://example.com/athleisure',
    categories: ['Athleisure', 'Casual'],
    tags: ['Trending', 'Luxury', 'Footwear']
  },
  {
    id: '5',
    title: 'The Return of Maximalism: Bold Colors and Patterns for Summer 2023',
    excerpt: 'After years of neutral minimalism, fashion is embracing joyful excess with vibrant colors, mixed patterns, and statement accessories.',
    content: 'Maximalism is making a triumphant return to fashion, offering a welcome antidote to the restrained aesthetic that has dominated recent years. Summer 2023 collections are awash in joyful excess, with designers embracing clashing patterns, vibrant color combinations, and statement accessories that demand attention. Brands like Versace and Moschino have always championed maximalist expression, but even traditionally minimal labels are now incorporating bolder elements into their offerings. Digital prints, metallic fabrics, and three-dimensional embellishments are key components of the maximalist revival, creating clothes that are as visually engaging as they are wearable. The trend extends to accessories as well, with oversized jewelry, embellished handbags, and eye-catching footwear completing the look. Fashion psychologists suggest that this shift toward expressive dressing reflects a collective desire for joy and self-expression after challenging global events. For those looking to embrace maximalism without overwhelming their existing wardrobe, stylists recommend starting with a single statement piece and building confidence gradually.',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
    source: 'Who What Wear',
    publishedAt: '2023-05-30',
    url: 'https://example.com/maximalism',
    categories: ['Bohemian', 'Designer'],
    tags: ['Trending', 'Accessories', 'Collaborations']
  },
  {
    id: '6',
    title: 'Denim Reimagined: Beyond the Basic Blue Jean',
    excerpt: 'Designers are pushing denim into new territory this season with unexpected silhouettes, treatments, and styling approaches.',
    content: 'Denim, the enduring wardrobe staple, is experiencing a creative renaissance that stretches far beyond basic blue jeans. On recent runways, designers reimagined denim through innovative silhouettes, unconventional treatments, and fresh styling approaches. Oversized proportions reign supreme, with baggy jeans and voluminous denim jackets offering a contemporary take on 90s influences. Patchwork and upcycled denim pieces reflect growing sustainability concerns, with brands like Marine Serre and Re/Done leading the charge in creating new garments from existing materials. Double and even triple denim looks have lost their dated connotations, now appearing fresh when executed in contrasting washes or unexpected proportions. Perhaps most surprising is denim\'s expansion beyond casual wear, with tailored denim suits, evening gowns, and formal accessories challenging traditional notions of the fabric\'s appropriate contexts. As denim technology advances, stretch comfort and eco-friendly washing techniques are improving both the sustainability and wearability of these evolving designs.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
    source: 'The Zoe Report',
    publishedAt: '2023-06-15',
    url: 'https://example.com/denim-trends',
    categories: ['Casual', 'Streetwear'],
    tags: ['Denim', 'Sustainable', 'DIY']
  }
];

// Sample conversation flows for the chatbot
export const CHATBOT_FLOWS = [
  {
    id: 'greeting',
    message: "Hello! I'm your fashion assistant. I can help you discover the latest trends and articles from top fashion blogs. What are you interested in today?",
    options: ['Latest Trends', 'Fashion Tips', 'Style Inspiration', 'Set My Preferences']
  },
  {
    id: 'preferences',
    message: "Let's personalize your experience. What styles are you most interested in?",
    options: FASHION_CATEGORIES
  },
  {
    id: 'season_preference',
    message: "Which season are you shopping for?",
    options: FASHION_SEASONS
  },
  {
    id: 'tag_preference',
    message: "Any specific fashion themes you're interested in?",
    options: FASHION_TAGS
  }
];

// Helper functions to filter blog posts based on user preferences
export const filterPostsByCategory = (posts: BlogPost[], category: string): BlogPost[] => {
  return posts.filter(post => post.categories.includes(category));
};

export const filterPostsBySeason = (posts: BlogPost[], season: string): BlogPost[] => {
  // This is simplified - in a real app, you might have season tags or derive from the content
  if (season === 'Spring' || season === 'Summer') {
    return posts.filter(post => 
      post.content.toLowerCase().includes(season.toLowerCase()) ||
      new Date(post.publishedAt).getMonth() >= 2 && new Date(post.publishedAt).getMonth() <= 7
    );
  } else {
    return posts.filter(post => 
      post.content.toLowerCase().includes(season.toLowerCase()) ||
      new Date(post.publishedAt).getMonth() >= 8 || new Date(post.publishedAt).getMonth() <= 1
    );
  }
};

export const filterPostsByTag = (posts: BlogPost[], tag: string): BlogPost[] => {
  return posts.filter(post => post.tags.includes(tag));
};

export const getRecommendedPosts = (preferences: UserPreference[]): BlogPost[] => {
  let filteredPosts = [...MOCK_BLOG_POSTS];
  
  // Filter by each preference
  preferences.forEach(pref => {
    if (FASHION_CATEGORIES.includes(pref.value)) {
      filteredPosts = filterPostsByCategory(filteredPosts, pref.value);
    } else if (FASHION_SEASONS.includes(pref.value)) {
      filteredPosts = filterPostsBySeason(filteredPosts, pref.value);
    } else if (FASHION_TAGS.includes(pref.value)) {
      filteredPosts = filterPostsByTag(filteredPosts, pref.value);
    }
  });
  
  // If filtering removed all posts, return some defaults
  if (filteredPosts.length === 0) {
    return MOCK_BLOG_POSTS.slice(0, 3);
  }
  
  return filteredPosts;
};
