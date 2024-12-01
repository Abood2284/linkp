// // apps/linkp-website/app/(authenticated)/onboarding/select-template/TemplateFilters.tsx
// "use client";

// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";

// export function TemplateFilters() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // Get current filters from URL
//   const category = searchParams.get("category");
//   const tags = searchParams.get("tags")?.split(",") || [];

//   // Update filters
//   const updateFilters = (key: string, value: string | string[]) => {
//     const params = new URLSearchParams(searchParams);

//     if (Array.isArray(value)) {
//       if (value.length > 0) {
//         params.set(key, value.join(","));
//       } else {
//         params.delete(key);
//       }
//     } else {
//       if (value) {
//         params.set(key, value);
//       } else {
//         params.delete(key);
//       }
//     }

//     router.push(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Categories */}
//       <div>
//         <h3 className="text-lg font-semibold mb-3">Categories</h3>
//         <div className="space-y-2">
//           {Object.values(TemplateCategory).map((cat) => (
//             <div key={cat} className="flex items-center">
//               <Checkbox
//                 id={cat}
//                 checked={category === cat}
//                 onCheckedChange={(checked) =>
//                   updateFilters("category", checked ? cat : "")
//                 }
//               />
//               <label htmlFor={cat} className="ml-2 text-sm">
//                 {cat.charAt(0).toUpperCase() + cat.slice(1)}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Popular Tags */}
//       <div>
//         <h3 className="text-lg font-semibold mb-3">Popular Tags</h3>
//         <div className="flex flex-wrap gap-2">
//           {["minimal", "creative", "professional", "animated"].map((tag) => (
//             <Badge
//               key={tag}
//               variant={tags.includes(tag) ? "default" : "outline"}
//               className="cursor-pointer"
//               onClick={() => {
//                 const newTags = tags.includes(tag)
//                   ? tags.filter((t) => t !== tag)
//                   : [...tags, tag];
//                 updateFilters("tags", newTags);
//               }}
//             >
//               {tag}
//             </Badge>
//           ))}
//         </div>
//       </div>

//       {/* Clear Filters */}
//       {(category || tags.length > 0) && (
//         <Button
//           variant="ghost"
//           className="w-full"
//           onClick={() => {
//             router.push(pathname);
//           }}
//         >
//           Clear All Filters
//         </Button>
//       )}
//     </div>
//   );
// }
