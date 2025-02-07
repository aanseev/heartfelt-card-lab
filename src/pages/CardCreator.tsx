import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CardCreator = () => {
  const navigate = useNavigate();

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
          <p className="text-gray-600">Card creation interface coming soon...</p>
        </Card>
      </div>
    </div>
  );
};

export default CardCreator;