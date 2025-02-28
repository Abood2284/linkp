// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { useRouter } from "next/navigation"
// import type { z } from "zod"

// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { companyProfileSchema } from "@/lib/validations/business-onboarding"
// import { useOnboardingStore } from "@/lib/stores/business-onboarding-store"

// type FormData = z.infer<typeof companyProfileSchema>

// const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"]
// const INDUSTRIES = [
//   "E-commerce",
//   "SaaS",
//   "Agency",
//   "Fashion",
//   "Beauty",
//   "Tech",
//   "Food & Beverage",
//   "Entertainment",
//   "Other",
// ]

// export default function CompanyProfilePage() {
//   const router = useRouter()
//   const { companyProfile, setCompanyProfile } = useOnboardingStore()

//   const form = useForm<FormData>({
//     resolver: zodResolver(companyProfileSchema),
//     defaultValues: {
//       companyName: companyProfile.companyName || "",
//       industry: companyProfile.industry || undefined,
//       website: companyProfile.website || "",
//       size: companyProfile.size || undefined,
//     },
//   })

//   function onSubmit(data: FormData) {
//     setCompanyProfile(data)
//     router.push("/business/onboarding/goals")
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Tell us about your company</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="companyName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Company Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter your company name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="industry"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Industry</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your industry" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {INDUSTRIES.map((industry) => (
//                         <SelectItem key={industry} value={industry}>
//                           {industry}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="website"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Website</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="https://example.com"
//                       type="url"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="size"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Company Size</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select company size" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {COMPANY_SIZES.map((size) => (
//                         <SelectItem key={size} value={size}>
//                           {size} employees
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex justify-end">
//               <Button type="submit">Continue</Button>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// } 