import { useState } from "react";
import CanteenForm from "@/components/CanteenForm";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // TODO: replace with actual API call when backend is implemented
      console.log('Form submission:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: remove mock functionality - replace with real API integration
    } catch (error) {
      console.error('Submission failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="relative py-8">
        <div className="absolute top-2 right-2 z-10">
          <img 
            src={bakkafrostLogo} 
            alt="Bakkafrost Logo" 
            className="h-16 w-auto" 
            data-testid="img-bakkafrost-logo" 
          />
        </div>
        <CanteenForm 
          onSubmit={handleFormSubmit} 
          isSubmitting={isSubmitting} 
        />
      </main>
    </div>
  );
}