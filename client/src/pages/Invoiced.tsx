import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Download, LogOut, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useData } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";
import * as XLSX from 'xlsx';

function InvoicedContent() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { invoicedPersons, moveBackToRegistrations } = useData();

  const handleMoveBack = (id: string) => {
    moveBackToRegistrations(id);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    if (invoicedPersons.length === 0) return;

    // Get date range from invoiced persons
    const dates = invoicedPersons.map(p => new Date(p.date)).sort((a, b) => a.getTime() - b.getTime());
    const startDate = dates[0].toLocaleDateString();
    const endDate = dates[dates.length - 1].toLocaleDateString();
    const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;

    // Prepare summary data
    const summaryData = [
      ['Fakturerað Yvirlit / Invoiced Overview'],
      [''],
      ['Total invoiced / Fakturerað í alt:', invoicedPersons.length],
      ['Date range / Dagsetning:', dateRange],
      ['Export date / Útflutningsdagur:', new Date().toLocaleDateString()],
      [''],
      ['Navn / Name', 'Fyritøka / Company', 'Máltíð / Meal', 'Mongd / Amount', 'Umboð / Representative', 'Dagur / Date', 'Tíð / Time']
    ];

    // Prepare invoiced data
    const invoicedData = invoicedPersons.map(person => [
      person.name,
      person.company,
      person.meal,
      person.amount,
      person.representative,
      person.date,
      person.time
    ]);

    // Combine summary and data
    const worksheetData = [...summaryData, ...invoicedData];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet['!cols'] = [
      { width: 20 }, // Name
      { width: 20 }, // Company
      { width: 18 }, // Meal
      { width: 12 }, // Amount
      { width: 20 }, // Representative
      { width: 12 }, // Date
      { width: 10 }  // Time
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoiced');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `Fakturerað-Invoiced-${currentDate}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Link href="/registrations" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-foreground hover-elevate">
                Skrásetingar / Registrations
              </Link>
              <Link href="/invoiced" className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground">
                Fakturerað / Invoiced
              </Link>
              <Link href="/log" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-foreground hover-elevate">
                Log
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-foreground hover-elevate">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Admin
                </Link>
              )}
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
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
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportToExcel}
                    disabled={invoicedPersons.length === 0}
                    data-testid="button-export-excel"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                  <Badge variant="outline" className="text-sm">
                    Seinast dagført / Last Updated: {new Date().toLocaleDateString()}
                  </Badge>
                </div>
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
                      <th className="py-3 px-4 font-medium text-center">
                        Mongd / Amount
                      </th>
                      <th className="py-3 px-4 font-medium text-center">
                        Umboð / Representative
                      </th>
                      <th className="py-3 px-4 font-medium text-center">
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
                        <td className="py-3 px-4 text-sm text-center">
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

export default function Invoiced() {
  return (
    <ProtectedRoute>
      <InvoicedContent />
    </ProtectedRoute>
  );
}