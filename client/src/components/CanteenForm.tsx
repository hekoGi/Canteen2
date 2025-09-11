import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, DollarSign, User, Building } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  meal: z.string().min(1, "Please select a meal"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Please enter a valid amount"),
  representative: z.string().min(1, "Representative is required"),
});

type FormData = z.infer<typeof formSchema>;

interface CanteenFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CanteenForm({ onSubmit, isSubmitting = false }: CanteenFormProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      meal: "Døgurða / Lunch",
      amount: "",
      representative: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      setSubmitSuccess(true);
      form.reset();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {submitSuccess && (
        <div className="mb-6 p-4 bg-chart-2/10 border border-chart-2/20 rounded-md flex items-center space-x-3" data-testid="status-success">
          <CheckCircle className="w-5 h-5 text-chart-2" />
          <div>
            <p className="font-medium text-chart-2">Entry Submitted Successfully!</p>
            <p className="text-sm text-muted-foreground">Meal entry has been recorded in the system.</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center space-x-2">
            <span>Skráseting</span>
          </CardTitle>
          <CardDescription>
            Please fill out all fields to record a meal entry in the canteen registry
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-border">
                <User className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Navn / Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    data-testid="input-name"
                    {...form.register("name")}
                    className={form.formState.errors.name ? "border-destructive" : ""}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive" data-testid="error-name">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Fyritøka / Company <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company"
                    data-testid="input-company"
                    {...form.register("company")}
                    className={form.formState.errors.company ? "border-destructive" : ""}
                  />
                  {form.formState.errors.company && (
                    <p className="text-sm text-destructive" data-testid="error-company">
                      {form.formState.errors.company.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Meal Details Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-border">
                <Building className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Meal Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meal" className="text-sm font-medium">
                    Máltíð / Meal <span className="text-destructive">*</span>
                  </Label>
                  <Select onValueChange={(value) => form.setValue("meal", value)} defaultValue="Døgurða / Lunch">
                    <SelectTrigger data-testid="select-meal" className={form.formState.errors.meal ? "border-destructive" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Døgurða / Lunch">Døgurða / Lunch</SelectItem>
                      <SelectItem value="Morgunmat / Breakfast">Morgunmat / Breakfast</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.meal && (
                    <p className="text-sm text-destructive" data-testid="error-meal">
                      {form.formState.errors.meal.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Mongd / Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="amount"
                    data-testid="input-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...form.register("amount")}
                    className={form.formState.errors.amount ? "border-destructive" : ""}
                  />
                  {form.formState.errors.amount && (
                    <p className="text-sm text-destructive" data-testid="error-amount">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Representative Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="representative" className="text-sm font-medium">
                  Umboð / Representative <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="representative"
                  data-testid="input-representative"
                  {...form.register("representative")}
                  className={form.formState.errors.representative ? "border-destructive" : ""}
                />
                {form.formState.errors.representative && (
                  <p className="text-sm text-destructive" data-testid="error-representative">
                    {form.formState.errors.representative.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
                data-testid="button-reset"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="button-submit"
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Entry"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}