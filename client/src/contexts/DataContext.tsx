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

const DataContext = createContext<DataContextType | undefined>(undefined);

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

export function DataProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<RegistrationData[]>(initialMockData);
  const [invoicedPersons, setInvoicedPersons] = useState<RegistrationData[]>([]);

  const moveToInvoiced = (id: number) => {
    setRegistrations(prev => {
      const idx = prev.findIndex(r => r.id === id);
      if (idx === -1) return prev;
      const person = prev[idx];
      setInvoicedPersons(p => [...p, { ...person, invoiceShipped: true }]);
      const next = prev.slice();
      next.splice(idx, 1);
      return next;
    });
  };

  const moveBackToRegistrations = (id: number) => {
    setInvoicedPersons(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx === -1) return prev;
      const person = prev[idx];
      setRegistrations(r => [...r, { ...person, invoiceShipped: false }]);
      const next = prev.slice();
      next.splice(idx, 1);
      return next;
    });
  };

  return (
    <DataContext.Provider value={{
      registrations,
      invoicedPersons,
      moveToInvoiced,
      moveBackToRegistrations
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}