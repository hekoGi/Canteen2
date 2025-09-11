import { UtensilsCrossed, Clock } from "lucide-react";

export default function CanteenHeader() {
  return (
    <header className="bg-card border-b border-card-border px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-md">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Canteen Registry</h1>
            <p className="text-sm text-muted-foreground">Meal Entry Portal</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium" data-testid="text-current-time">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </header>
  );
}