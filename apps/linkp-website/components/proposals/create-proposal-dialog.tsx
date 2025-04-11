"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { createProposal } from "@/lib/swr/use-proposals";

// Form schema for proposal creation
const proposalSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  price: z.number().min(1, { message: "Price must be at least 1" }),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

interface CreateProposalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  workspaceId: string;
}

export function CreateProposalDialog({
  isOpen,
  onClose,
  creatorId,
  workspaceId,
}: CreateProposalDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize form with default values
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      url: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default to 30 days from now
      price: 100, // Default price in dollars
    },
  });

  async function onSubmit(data: ProposalFormValues) {
    try {
      setIsSubmitting(true);

      // Convert price to cents for storage
      const priceInCents = Math.round(data.price * 100);

      // Prepare the proposal data
      const proposalData = {
        creatorId,
        workspaceId,
        title: data.title,
        url: data.url,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        price: priceInCents,
      };

      // Submit the proposal
      await createProposal(proposalData);

      // Show success message
      toast.success("Proposal sent successfully!");

      // Close the dialog and refresh the page
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast.error("Failed to send proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Promotional Link Proposal</DialogTitle>
          <DialogDescription>
            Send a proposal to the creator to promote your link on their
            profile.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer Sale Promotion" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear title for your promotional link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/promo" {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL you want to promote.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            (form.getValues().startDate &&
                              date < form.getValues().startDate)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="100.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    The amount you`&apos;re offering for this promotion.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Proposal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
