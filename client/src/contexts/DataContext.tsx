import { createContext, useContext, useState, ReactNode } from "react";

export interface RegistrationData {
  id: number;
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
  moveToInvoiced: (id: number) => void;
  moveBackToRegistrations: (id: number) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialMockData: RegistrationData[] = [
  {
    id: 1,
    name: "Anna Poulsen",
    company: "Bakkafrost",
    meal: "Døgurða / Lunch",
    amount: "125",
    representative: "Maria Hansen",
    date: "2025-09-11",
    time: "12:30",
    invoiceShipped: false
  },
  {
    id: 2,
    name: "Óli Jacobsen", 
    company: "P/F Thor",
    meal: "Morgunmat / Breakfast",
    amount: "89",
    representative: "Jens Mortensen",
    date: "2025-09-11",
    time: "08:45",
    invoiceShipped: false
  },
  {
    id: 3,
    name: "Rannvá Olsen",
    company: "Bakkafrost",
    meal: "Døgurða / Lunch",
    amount: "134",
    representative: "Lars Nielsen",
    date: "2025-09-10",
    time: "13:15",
    invoiceShipped: false
  }
];

interface DataState {
  registrations: RegistrationData[];
  invoicedPersons: RegistrationData[];
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>({
    registrations: initialMockData,
    invoicedPersons: []
  });

  const moveToInvoiced = (id: number) => {
    const personToMove = state.registrations.find(r => r.id === id);
    if (!personToMove) return;
    
    // Update both arrays atomically
    setState(prev => ({
      registrations: prev.registrations.filter(r => r.id !== id),
      invoicedPersons: [...prev.invoicedPersons, { ...personToMove, invoiceShipped: true }]
    }));
  };

  const moveBackToRegistrations = (id: number) => {
    const personToMove = state.invoicedPersons.find(p => p.id === id);
    if (!personToMove) return;
    
    // Update both arrays atomically
    setState(prev => ({
      registrations: [...prev.registrations, { ...personToMove, invoiceShipped: false }],
      invoicedPersons: prev.invoicedPersons.filter(p => p.id !== id)
    }));
  };

  return (
    <DataContext.Provider value={{
      registrations: state.registrations,
      invoicedPersons: state.invoicedPersons,
      moveToInvoiced,
      moveBackToRegistrations
    }}>
      {children}
    </DataContext.Provider>
  );
}

