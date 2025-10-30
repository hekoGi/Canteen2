import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ActivityLog } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";

function LogContent() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { data: logs = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['/api/logs'],
  });

  const formatAction = (action: string) => {
    switch (action) {
      case 'moved_to_invoiced':
        return 'Moved to Invoiced';
      case 'moved_to_registrations':
        return 'Moved back to Registrations';
      default:
        return action;
    }
  };

  const formatDateTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Link href="/registrations" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-foreground hover-elevate">
                Skrásetingar / Registrations
              </Link>
              <Link href="/invoiced" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-foreground hover-elevate">
                Fakturerað / Invoiced
              </Link>
              <Link href="/log" className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground">
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
                <span className="text-[46px]">Activity Log</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-[#fafbfc]">
                  Total activities: <strong>{logs.length}</strong>
                </p>
                <Badge variant="outline" className="text-sm">
                  Last Updated: {new Date().toLocaleDateString()}
                </Badge>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-4 font-medium text-center">
                          Date
                        </th>
                        <th className="py-3 px-4 font-medium text-center">
                          Time
                        </th>
                        <th className="py-3 px-4 font-medium text-center">
                          Action
                        </th>
                        <th className="py-3 px-4 font-medium text-center">
                          Name
                        </th>
                        <th className="py-3 px-4 font-medium text-center">
                          Company
                        </th>
                        <th className="py-3 px-4 font-medium text-center">
                          Meal
                        </th>
                        <th className="py-3 px-4 font-medium text-center">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => {
                        const datetime = formatDateTime(log.createdAt);
                        return (
                          <tr 
                            key={log.id} 
                            className="border-b border-border/50 hover:bg-muted/30"
                            data-testid={`row-log-${log.id}`}
                          >
                            <td className="py-3 px-4 text-center">
                              {datetime.date}
                            </td>
                            <td className="py-3 px-4 text-center text-sm">
                              {datetime.time}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant="outline" className="text-xs">
                                {formatAction(log.action)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-medium text-center">
                              {log.personName}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {log.company}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent text-secondary-foreground text-xs bg-[#0f141900] text-center">
                                {log.meal}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-mono text-center">
                              {log.amount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {!isLoading && logs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No activity recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function Log() {
  return (
    <ProtectedRoute>
      <LogContent />
    </ProtectedRoute>
  );
}