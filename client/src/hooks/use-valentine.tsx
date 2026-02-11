import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertValentineResponse } from "@shared/schema";

export function useValentineStatus() {
  return useQuery({
    queryKey: ['/api/valentine/status'],
    queryFn: async () => {
      const res = await fetch('/api/valentine/status');
      if (!res.ok) throw new Error("Failed to fetch status");
      return await res.json();
    }
  });
}

export function useRespondValentine() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertValentineResponse) => {
      const res = await fetch('/api/valentine/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error("Something went wrong with the request");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      // We don't necessarily need to invalidate queries if we just show success state locally
      // but it's good practice if we had a dashboard
    },
    onError: (error) => {
      toast({
        title: "Oh no!",
        description: "Could not send the response. Please try again!",
        variant: "destructive"
      });
    }
  });
}
