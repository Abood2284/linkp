// 'use client';
//
// import { useSession } from "next-auth/react";
// import { getAvailableTemplates } from "@/lib/templates/registry";
// import { useState } from "react";
// import {redirect} from "next/navigation";
//
// export default function TemplateSelection() {
//     const { data: session } = useSession();
//     const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
//
//     // *  todo: Get current user from the Database using session User iD
//     // * `subscriptionTier` is not available on Session User
//     // Get templates available for user's plan
//     const availableTemplates = getAvailableTemplates(
//         session?.user?.subscriptionTier || 'free',
//         session?.user?.userType || 'regular'
//     );
//
//     const handleTemplateSelect = async (templateId: string) => {
//         try {
//             // Create workspace with selected template
//             const response = await fetch('/api/workspaces', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     templateId,
//                     name: 'My Workspace', // Default name
//                 }),
//             });
//
//             if (!response.ok) throw new Error('Failed to create workspace');
//
//             // Redirect to customization
//             redirect('/dashboard/setup/customize');
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };
//
//     return (
//         <div className="container mx-auto py-8">
//             <h1 className="text-3xl font-bold mb-8">Choose Your Template</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {availableTemplates.map((template) => (
//                     <TemplateCard
//                         key={template.id}
//                         template={template}
//                         onSelect={() => handleTemplateSelect(template.id)}
//                         isSelected={selectedTemplate === template.id}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }