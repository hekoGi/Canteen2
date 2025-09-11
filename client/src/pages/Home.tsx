import { useState } from "react";
import CanteenHeader from "@/components/CanteenHeader";
import CanteenForm from "@/components/CanteenForm";
import ThemeToggle from "@/components/ThemeToggle";

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
      <div className="relative">
        <CanteenHeader />
        <div className="absolute top-4 right-6">
          <ThemeToggle />
        </div>
      </div>
      
      <main className="py-8">
        <CanteenForm 
          onSubmit={handleFormSubmit} 
          isSubmitting={isSubmitting} 
        />
      </main>
      
      <footer className="border-t border-border bg-card py-4 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Canteen Registry System - Professional meal tracking for your organization
          </p>
        </div>
      </footer>
    </div>
  );
}