// apps/linkp-website/app/(onboarding)/business/components/propose-promotional-link.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BusinessService } from "@/lib/business/business-service";

const proposalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
  promotionStartDate: z.string().min(1, "Start date is required"),
  promotionEndDate: z.string().min(1, "End date is required"),
  promotionPrice: z.string().min(1, "Price is required"),
});

interface ProposePromotionalLinkProps {
  creatorId: string;
  businessId: string;
}

export function ProposePromotionalLink({
  creatorId,
  businessId,
}: ProposePromotionalLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof proposalSchema>>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      url: "",
      promotionStartDate: "",
      promotionEndDate: "",
      promotionPrice: "",
    },
  });

  async function onSubmit(values: z.infer<typeof proposalSchema>) {
    try {
      setIsSubmitting(true);

      await BusinessService.sendPromoProposal({
        ...values,
        creatorId,
        businessId,
      });

      toast("Your promotional link proposal has been sent to the creator.");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to submit proposal. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Propose Promotional Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Propose Promotional Link</DialogTitle>
          <DialogDescription>
            Submit a proposal to promote your link on this creator&apos;s page.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter link title" {...field} />
                  </FormControl>
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
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotionStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotionEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotionPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
