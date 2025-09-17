import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "wouter";
import { useData } from "@/hooks/useData";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";

export default function Invoiced() {
  const { invoicedPersons, moveBackToRegistrations } = useData();

  const handleMoveBack = (id: number) => {
    moveBackToRegistrations(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex space-x-4">
            <Link href="/registrations" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-foreground hover-elevate">
              Skrásetingar / Registrations
            </Link>
            <Link href="/invoiced" className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground">
              Fakturerað / Invoiced
            </Link>
          </div>
        </div>
      </nav>
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
                <span className="text-[46px] text-white">Fakturerað / Invoiced</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-[#fafbfc]">
                  Fakturerað í alt / Total invoiced: <strong>{invoicedPersons.length}</strong>
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
                      <th className="text-center py-3 px-4 font-medium">
                        Fakturerað / Invoiced
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicedPersons.map((person) => (
                      <tr 
                        key={person.id} 
                        className="border-b border-border/50 hover:bg-muted/30"
                        data-testid={`row-invoiced-${person.id}`}
                      >
                        <td className="py-3 px-4 font-medium text-center">
                          {person.name}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {person.company}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent text-secondary-foreground text-xs bg-[#0f141900] text-center">
                            {person.meal}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-center">
                          {person.amount}
                        </td>
                        <td className="py-3 px-4 text-[#fafafc] text-center">
                          {person.representative}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>{person.date}</div>
                          <div className="text-xs text-[#ffffff]">
                            {person.time}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMoveBack(person.id)}
                              data-testid={`button-move-back-${person.id}`}
                            >
                              <ArrowLeft className="w-3 h-3 mr-1" />
                              Undo / Angra
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invoicedPersons.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Tómt / empty</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}