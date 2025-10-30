import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, X, Trash2, UserCog, LogOut } from "lucide-react";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";

interface User {
  id: string;
  username: string;
  isApproved: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user: currentUser, isLoading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: currentUser?.isAdmin === true,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: { isApproved?: boolean; isAdmin?: boolean } }) => {
      return apiRequest('PATCH', `/api/admin/users/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User Updated",
        description: "User permissions have been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/users/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User Deleted",
        description: "User has been removed from the system",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      setLocation("/login");
    }
  }, [currentUser, authLoading, setLocation]);

  if (authLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  const handleApprove = (userId: string, currentStatus: boolean) => {
    updateUserMutation.mutate({ id: userId, updates: { isApproved: !currentStatus } });
  };

  const handleToggleAdmin = (userId: string, currentStatus: boolean) => {
    updateUserMutation.mutate({ id: userId, updates: { isAdmin: !currentStatus } });
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(userId);
    }
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
      <main className="relative py-8">
        <div className="flex justify-center mb-8">
          <img 
            src={bakkafrostLogo} 
            alt="Bakkafrost Logo" 
            className="h-16"
          />
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Shield className="w-6 h-6" />
                <span>Admin Panel / Umsitingarborð</span>
              </CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Username</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Role</TableHead>
                      <TableHead className="text-center">Created</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                          <TableCell className="font-medium text-center" data-testid={`text-username-${user.id}`}>
                            {user.username}
                            {user.id === currentUser.id && (
                              <Badge variant="outline" className="ml-2">You</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.isApproved ? (
                              <Badge variant="default" data-testid={`badge-approved-${user.id}`}>
                                <Check className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="secondary" data-testid={`badge-pending-${user.id}`}>
                                <X className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.isAdmin ? (
                              <Badge variant="default" data-testid={`badge-admin-${user.id}`}>
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="outline" data-testid={`badge-user-${user.id}`}>User</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                size="sm"
                                variant={user.isApproved ? "outline" : "default"}
                                onClick={() => handleApprove(user.id, user.isApproved)}
                                disabled={user.id === currentUser.id}
                                data-testid={`button-approve-${user.id}`}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                {user.isApproved ? "Revoke" : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                                disabled={user.id === currentUser.id}
                                data-testid={`button-admin-${user.id}`}
                              >
                                <UserCog className="w-4 h-4 mr-1" />
                                {user.isAdmin ? "Remove Admin" : "Make Admin"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(user.id)}
                                disabled={user.id === currentUser.id}
                                data-testid={`button-delete-${user.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/registrations")}
                  data-testid="button-back"
                >
                  ← Back to Registrations
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out / Rita út
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
