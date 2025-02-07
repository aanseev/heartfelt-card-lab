
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateCardCode } from "@/lib/utils/cardCode";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CardCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    message: "",
    backgroundColor: "#FFE6E6",
    isPublic: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const code = generateCardCode();
      const { error } = await supabase.from('valentine_cards').insert({
        code,
        sender_name: formData.senderName,
        message: formData.message,
        background_color: formData.backgroundColor,
        is_public: formData.isPublic,
      });

      if (error) throw error;

      toast({
        title: "Card created successfully!",
        description: `Your card code is: ${code}`,
      });

      navigate(`/card/${code}`);
    } catch (error) {
      console.error('Error creating card:', error);
      toast({
        title: "Error creating card",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Card className="glass-card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Your Valentine Card</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <Input
                value={formData.senderName}
                onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                placeholder="Enter your name"
                required
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Write your valentine message..."
                required
                className="min-h-[150px]"
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <Input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="h-10 w-20"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public-mode"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
              <Label htmlFor="public-mode">Make this card public</Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-valentine-600 hover:bg-valentine-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Valentine Card"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CardCreator;
