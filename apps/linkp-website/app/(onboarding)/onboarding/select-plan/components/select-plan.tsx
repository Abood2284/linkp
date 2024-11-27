"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

const FormSchema = z.object({
  type: z.enum(["regular", "creator", "business"], {
    required_error: "You need to select a notification type.",
  }),
});

export function RadioGroupForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col md:flex-row gap-4 md:gap-8"
                >
                  <FormItem className="flex items-center">
                    <FormControl>
                      <div className="border-2 rounded-2xl px-4 py-6 bg-white">
                        <div className="flex items-center justify-between px-4 mb-4">
                          <div className="bg-creme-200 px-4 py-1 rounded-full">
                            <p>Regular</p>
                          </div>
                          <RadioGroupItem value="regular" />
                        </div>
                        <div className="flex gap-2 ">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-1 items-baseline mt-4">
                          <p className="text-wrap font-bold font-heading text-2xl">
                            $10{" "}
                          </p>
                          <p className="text-wrap text-zinc-600">/ month </p>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <div className="border-2 border-green-600 rounded-2xl px-4 py-6 bg-white">
                        <div className="flex items-center justify-between px-4 mb-4">
                          <div className="bg-creme-200 px-4 py-1 rounded-full">
                            <p>Creators</p>
                          </div>
                          <RadioGroupItem value="creator" />
                        </div>
                        <div className="flex gap-2 ">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-1 items-baseline mt-4">
                          <p className="text-wrap font-bold font-heading text-2xl">
                            $10{" "}
                          </p>
                          <p className="text-wrap text-zinc-600">/ month </p>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <div className="border-2 rounded-2xl px-4 py-6 bg-white">
                        <div className="flex items-center justify-between px-4 mb-4">
                          <div className="bg-creme-200 px-4 py-1 rounded-full">
                            <p>Business</p>
                          </div>
                          <RadioGroupItem value="business" />
                        </div>
                        <div className="flex gap-2 ">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Check className="h-7 w-5" />
                          <p className="text-wrap">
                            Lorem ipsum dolor sit amet,
                          </p>
                        </div>
                        <div className="flex gap-1 items-baseline mt-4">
                          <p className="text-wrap font-bold font-heading text-2xl">
                            $10{" "}
                          </p>
                          <p className="text-wrap text-zinc-600">/ month </p>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}
