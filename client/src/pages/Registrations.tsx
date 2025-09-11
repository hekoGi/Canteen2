import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";

// Mock data for initial development
const mockRegistrations = [
  {
    id: 1,
    name: "Anna Poulsen",
    company: "Bakkafrost",
    meal: "Døgurða / Lunch",
    amount: "125",
    representative: "Maria Hansen",
    date: "2025-09-11",
    time: "12:30"
  },
  {
    id: 2,
    name: "Óli Jacobsen", 
    company: "P/F Thor",
    meal: "Morgunmat / Breakfast",
    amount: "89",
    representative: "Jens Mortensen",
    date: "2025-09-11",
    time: "08:45"
  },
  {
    id: 3,
    name: "Rannvá Olsen",
    company: "Bakkafrost",
    meal: "Døgurða / Lunch",
    amount: "134",
    representative: "Lars Nielsen",
    date: "2025-09-10",
    time: "13:15"
  }
];

export default function Registrations() {
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
        
        <div className="max-w-6xl mx-auto p-6">
          <Card>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">
                <span className="text-[46px]">Yvurlit / Overview</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-[#fafbfc]">
                  Samlað skrásetingar / Total Registrations: <strong>{mockRegistrations.length}</strong>
                </p>
                <Badge variant="outline" className="text-sm">
                  Seinast dagført / Last Updated: {new Date().toLocaleDateString()}
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-medium text-center">
                        Navn / Name
                      </th>
                      <th className="py-3 px-4 font-medium text-center">
                        Fyritøka / Company
                      </th>
                      <th className="py-3 px-4 font-medium text-center">
                        Máltíð / Meal
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Mongd / Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Umboð / Representative
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Dagur / Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRegistrations.map((registration) => (
                      <tr 
                        key={registration.id} 
                        className="border-b border-border/50 hover:bg-muted/30"
                        data-testid={`row-registration-${registration.id}`}
                      >
                        <td className="py-3 px-4 font-medium text-center">
                          {registration.name}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {registration.company}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent text-secondary-foreground text-xs bg-[#0f141900] text-center">
                            {registration.meal}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-center">
                          {registration.amount}
                        </td>
                        <td className="py-3 px-4 text-[#fafafc] text-center">
                          {registration.representative}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>{registration.date}</div>
                          <div className="text-xs text-[#ffffff]">
                            {registration.time}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {mockRegistrations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Ongar skrásetingar enn / No registrations yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}