import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Home from "@/pages/Home";
import Registrations from "@/pages/Registrations";
import Invoiced from "@/pages/Invoiced";
import Log from "@/pages/Log";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={Admin} />
      <Route path="/registrations" component={Registrations} />
      <Route path="/invoiced" component={Invoiced} />
      <Route path="/log" component={Log} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DataProvider>
            <Toaster />
            <Router />
          </DataProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
