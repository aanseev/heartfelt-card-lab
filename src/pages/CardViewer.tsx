
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type ValentineCard = Database['public']['Tables']['valentine_cards']['Row'];

const CardViewer = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: card, isLoading, error } = useQuery({
    queryKey: ['card', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('valentine_cards')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      return data as ValentineCard;
    },
  });

  const addReactionMutation = useMutation({
    mutationFn: async () => {
      if (!card) throw new Error('Card not found');
      
      const currentHearts = card.reactions && typeof card.reactions === 'object' 
        ? (card.reactions as { hearts: number }).hearts || 0 
        : 0;
      
      const { data, error } = await supabase
        .from('valentine_cards')
        .update({
          reactions: { hearts: currentHearts + 1 }
        })
        .eq('code', code)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', code] });
      toast({
        title: "Thanks for spreading the love! 💝",
        duration: 2000,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-valentine-50 to-white p-4 flex items-center justify-center">
        <p className="text-gray-600">Loading your valentine...</p>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-valentine-50 to-white p-4">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-card p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h1>
            <p className="text-gray-600 mb-6">This valentine card doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/")} className="bg-valentine-600 hover:bg-valentine-700">
              Go Back Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const hearts = card.reactions && typeof card.reactions === 'object' 
    ? (card.reactions as { hearts: number }).hearts || 0 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-valentine-50 to-white p-4">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <Card 
          className="glass-card p-8 transition-all duration-500 hover:shadow-lg"
          style={{ backgroundColor: card.background_color ?? undefined }}
        >
          <div className="text-right mb-4">
            <Button
              variant="ghost"
              className="hover:text-valentine-600"
              onClick={() => addReactionMutation.mutate()}
              disabled={addReactionMutation.isPending}
            >
              <Heart className={`mr-2 h-4 w-4 ${addReactionMutation.isPending ? 'animate-pulse' : ''}`} />
              {hearts}
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            A Valentine For You
          </h1>
          
          <p className="text-gray-600 mb-6">From: {card.sender_name}</p>
          
          <div className="bg-white/80 rounded-lg p-6 mb-6 shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap">{card.message}</p>
          </div>

          <div className="text-sm text-gray-500 text-center">
            Card Code: {card.code}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CardViewer;
