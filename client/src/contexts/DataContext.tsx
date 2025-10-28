import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

export interface RegistrationData {
  id: string;
  name: string;
  company: string;
  meal: string;
  amount: string;
  representative: string;
  date: string;
  time: string;
  invoiceShipped: boolean;
}

interface DataContextType {
  registrations: RegistrationData[];
  invoicedPersons: RegistrationData[];
  isLoading: boolean;
  moveToInvoiced: (id: string) => Promise<void>;
  moveBackToRegistrations: (id: string) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Fetch all canteen entries
  const { data: entries = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/entries'],
  });

  // Convert database entries to RegistrationData format
  const formatEntry = (entry: any): RegistrationData => {
    const createdAt = new Date(entry.createdAt);
    return {
      id: entry.id,
      name: entry.name,
      company: entry.company,
      meal: entry.meal,
      amount: entry.amount,
      representative: entry.representative,
      date: format(createdAt, 'yyyy-MM-dd'),
      time: format(createdAt, 'HH:mm'),
      invoiceShipped: entry.invoiceShipped,
    };
  };

  // Split entries into registrations and invoiced
  const registrations = entries
    .filter(entry => !entry.invoiceShipped)
    .map(formatEntry);

  const invoicedPersons = entries
    .filter(entry => entry.invoiceShipped)
    .map(formatEntry);

  // Mutation to update entry
  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, invoiceShipped }: { id: string; invoiceShipped: boolean }) => {
      return apiRequest('PATCH', `/api/entries/${id}`, { invoiceShipped });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
    },
  });

  // Mutation to create activity log
  const createLogMutation = useMutation({
    mutationFn: async (logData: any) => {
      return apiRequest('POST', '/api/logs', logData);
    },
  });

  const moveToInvoiced = async (id: string) => {
    const personToMove = entries.find(e => e.id === id);
    if (!personToMove) return;

    // Update the entry
    await updateEntryMutation.mutateAsync({ id, invoiceShipped: true });

    // Create activity log
    try {
      await createLogMutation.mutateAsync({
        action: 'moved_to_invoiced',
        personName: personToMove.name,
        company: personToMove.company,
        amount: personToMove.amount,
        meal: personToMove.meal,
        representative: personToMove.representative,
      });
    } catch (error) {
      console.error('Failed to create activity log:', error);
    }
  };

  const moveBackToRegistrations = async (id: string) => {
    const personToMove = entries.find(e => e.id === id);
    if (!personToMove) return;

    // Update the entry
    await updateEntryMutation.mutateAsync({ id, invoiceShipped: false });

    // Create activity log
    try {
      await createLogMutation.mutateAsync({
        action: 'moved_to_registrations',
        personName: personToMove.name,
        company: personToMove.company,
        amount: personToMove.amount,
        meal: personToMove.meal,
        representative: personToMove.representative,
      });
    } catch (error) {
      console.error('Failed to create activity log:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      registrations,
      invoicedPersons,
      isLoading,
      moveToInvoiced,
      moveBackToRegistrations
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
