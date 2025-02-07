
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, PenLine, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type ValentineCard = Database['public']['Tables']['valentine_cards']['Row'];

const Index = () => {
  const [cardCode, setCardCode] = useState("");
  const navigate = useNavigate();

  const { data: publicCards, isLoading } = useQuery({
    queryKey: ['public-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('valentine_cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ValentineCard[];
    },
  });

  const handleViewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardCode.trim()) {
      navigate(`/card/${cardCode}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-valentine-50 to-white p-4">
      <div className="text-center space-y-6 max-w-3xl mx-auto fade-up">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-valentine-100 text-valentine-700 text-sm font-medium mb-4">
            <Heart className="w-4 h-4 mr-2" />
            Share Love, Create Memories
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
            Create Beautiful
            <span className="text-valentine-600 block mt-2">Valentine Cards</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Design and share personalized digital Valentine cards with your loved ones.
            Simple, beautiful, and straight from the heart.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            className="hover-scale bg-valentine-600 hover:bg-valentine-700"
            onClick={() => navigate("/create")}
          >
            <PenLine className="mr-2 h-4 w-4" />
            Create a Card
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="hover-scale border-valentine-200 hover:bg-valentine-50"
            onClick={() => document.getElementById("codeInput")?.focus()}
          >
            <Eye className="mr-2 h-4 w-4" />
            View a Card
          </Button>
        </div>

        <Card className="glass-card max-w-md mx-auto mt-12 p-6">
          <form onSubmit={handleViewCard} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Have a card code?</h2>
            <div className="flex gap-2">
              <Input
                id="codeInput"
                placeholder="Enter card code (e.g., VXC3KF1)"
                value={cardCode}
                onChange={(e) => setCardCode(e.target.value)}
                className="text-center uppercase"
              />
              <Button type="submit" variant="secondary">
                Open
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Public Cards Section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Public Valentine Cards</h2>
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading public cards...</p>
        ) : publicCards && publicCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicCards.map((card) => (
              <Card
                key={card.id}
                className="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                style={{ backgroundColor: card.background_color ?? undefined }}
                onClick={() => navigate(`/card/${card.code}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm text-gray-600">From: {card.sender_name}</p>
                  <div className="flex items-center text-valentine-600">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {card.reactions && typeof card.reactions === 'object'
                        ? (card.reactions as { hearts: number }).hearts
                        : 0}
                    </span>
                  </div>
                </div>
                <p className="text-gray-800 line-clamp-3 mb-4">{card.message}</p>
                <p className="text-xs text-gray-500 text-right">Code: {card.code}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No public cards yet. Be the first to create one!</p>
        )}
      </div>
    </div>
  );
};

export default Index;
