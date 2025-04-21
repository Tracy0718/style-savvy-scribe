
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FASHION_CATEGORIES, FASHION_SEASONS, FASHION_TAGS, UserPreference } from "@/data/mockFashionData";

interface UserPreferencesProps {
  preferences: UserPreference[];
  onPreferencesChange: (preferences: UserPreference[]) => void;
  onClose: () => void;
}

const UserPreferences = ({ preferences, onPreferencesChange, onClose }: UserPreferencesProps) => {
  const [category, setCategory] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  const handleSavePreferences = () => {
    const newPreferences: UserPreference[] = [];
    
    if (category) {
      newPreferences.push({ id: "category", name: "Style Category", value: category });
    }
    
    if (season) {
      newPreferences.push({ id: "season", name: "Season", value: season });
    }
    
    if (tag) {
      newPreferences.push({ id: "tag", name: "Fashion Tag", value: tag });
    }
    
    onPreferencesChange(newPreferences);
    onClose();
  };

  // Set initial values from existing preferences
  useState(() => {
    const categoryPref = preferences.find(p => p.id === "category");
    const seasonPref = preferences.find(p => p.id === "season");
    const tagPref = preferences.find(p => p.id === "tag");
    
    if (categoryPref) setCategory(categoryPref.value);
    if (seasonPref) setSeason(seasonPref.value);
    if (tagPref) setTag(tagPref.value);
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">Your Fashion Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Style Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select your preferred style" />
            </SelectTrigger>
            <SelectContent>
              {FASHION_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Season</label>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a season" />
            </SelectTrigger>
            <SelectContent>
              {FASHION_SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Fashion Theme</label>
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger>
              <SelectValue placeholder="Select a fashion theme" />
            </SelectTrigger>
            <SelectContent>
              {FASHION_TAGS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSavePreferences} className="bg-fashion-pink hover:bg-fashion-pink/90">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
