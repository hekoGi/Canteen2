import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check, X, ArrowRight, Download } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useData } from "@/hooks/useData";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";
import * as XLSX from 'xlsx';

export default function Registrations() {
  const { registrations, moveToInvoiced } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const handleInvoiceClick = (id: number) => {
    setSelectedPersonId(id);
    setDialogOpen(true);
  };

  const confirmMove = () => {
    if (selectedPersonId !== null) {
      moveToInvoiced(selectedPersonId);
    }
    setDialogOpen(false);
    setSelectedPersonId(null);
  };

  const cancelMove = () => {
    setDialogOpen(false);
    setSelectedPersonId(null);
  };

  const handleExportToExcel = () => {
    if (registrations.length === 0) return;

    // Get date range from registrations
    const dates = registrations.map(r => new Date(r.date)).sort((a, b) => a.getTime() - b.getTime());
    const startDate = dates[0].toLocaleDateString();
    const endDate = dates[dates.length - 1].toLocaleDateString();
    const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;

    // Prepare summary data
    const summaryData = [
      ['Skrásetingar Yvirlit / Registrations Overview'],
      [''],
      ['Total registrations / Skrásetingar í alt:', registrations.length],
      ['Date range / Dagsetning:', dateRange],
      ['Export date / Útflutningsdagur:', new Date().toLocaleDateString()],
      [''],
      ['Navn / Name', 'Fyritøka / Company', 'Máltíð / Meal', 'Mongd / Amount', 'Umboð / Representative', 'Dagur / Date', 'Tíð / Time']
    ];

    // Prepare registration data
    const registrationData = registrations.map(reg => [
      reg.name,
      reg.company,
      reg.meal,
      reg.amount,
      reg.representative,
      reg.date,
      reg.time
    ]);

    // Combine summary and data
    const worksheetData = [...summaryData, ...registrationData];

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `Skrasetingar-Registrations-${currentDate}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex space-x-4">
            <Link href="/registrations" className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground">
              Skrásetingar / Registrations
            </Link>
            <Link href="/invoiced" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-foreground hover-elevate">
              Fakturerað / Invoiced
            </Link>
            <Link href="/log" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-foreground hover-elevate">
              Log
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
                <span className="text-[46px]">Yvirlit / Overview</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-[#fafbfc]">
                  Skrásetingar í alt / Total registrations: <strong>{registrations.length}</strong>
                </p>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportToExcel}
                    disabled={registrations.length === 0}
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
                    {registrations.map((registration) => (
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
                        <td className="py-3 px-4 text-sm text-center">
                          <div>{registration.date}</div>
                          <div className="text-xs text-[#ffffff]">
                            {registration.time}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleInvoiceClick(registration.id)}
                                  data-testid={`button-invoice-${registration.id}`}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Move to Fakturerað / Invoiced</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {registrations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Ongar skrásetingar enn / No registrations yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent data-testid="dialog-confirm-move">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#ffffff]">
              Are you sure you want to move this row into Fakturerað / Invoiced?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelMove} data-testid="button-confirm-no">
              No
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmMove} data-testid="button-confirm-yes">
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}