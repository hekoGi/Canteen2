import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CanteenForm from "@/components/CanteenForm";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/entries', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
    },
  });

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      await createEntryMutation.mutateAsync(data);
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: "Error",
        description: "Failed to submit entry. Please try again.",
        variant: "destructive",
      });
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