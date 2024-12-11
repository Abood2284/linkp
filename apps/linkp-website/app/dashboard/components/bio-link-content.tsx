import {
  Settings,
  LinkIcon,
  MoreVertical,
  Box,
  Instagram,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export function BioLinkContent() {
  return (
    <div className="flex-1 bg-gray-50">
      <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <Image
              src="/placeholder.svg"
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full border-4 border-white"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 px-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">Mark Stephanus</h2>
              <Image
                src="https://flagcdn.com/id.svg"
                alt="Indonesia"
                width={24}
                height={16}
                className="rounded"
              />
              <span className="text-sm text-gray-500">Indonesia</span>
            </div>
            <p className="text-gray-500">
              Content Creator | marksteph@gmail.com
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2">
              <LinkIcon className="h-4 w-4" />
              <span className="text-sm">https://lynk.id/markstephanus</span>
            </div>
            <Button>Share Url</Button>
            <Button variant="outline">Customize Url →</Button>
          </div>
        </div>

        <Tabs defaultValue="lynk" className="mt-8">
          <TabsList>
            <TabsTrigger value="lynk">Lynk</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="statistic">Statistic</TabsTrigger>
          </TabsList>

          <TabsContent value="lynk" className="mt-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Your Pages</h3>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4 flex gap-2">
                  <Button className="rounded-full" variant="secondary">
                    Home
                  </Button>
                  <Button className="rounded-full" variant="ghost">
                    Videos
                  </Button>
                  <Button className="rounded-full" variant="ghost">
                    Page that has very long name
                  </Button>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold">Block List</h3>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <LinkIcon className="h-5 w-5 text-orange-500" />
                    Visit my website
                    <MoreVertical className="ml-auto h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Box className="h-5 w-5 text-blue-500" />
                    Product - Harmonica
                    <MoreVertical className="ml-auto h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Instagram className="h-5 w-5 text-pink-500" />
                    Instagram Link
                    <MoreVertical className="ml-auto h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Box className="h-5 w-5 text-orange-500" />
                    Product - Digital Marketing E-Book
                    <MoreVertical className="ml-auto h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Mail className="h-5 w-5 text-pink-500" />
                    Collect Email
                    <span className="ml-auto text-sm text-gray-500">Draft</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  <Button className="w-full" variant="secondary">
                    + Add New Blocks
                  </Button>
                </div>
              </div>

              <div className="w-[400px]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Preview</h3>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="rounded-[40px] border-8 border-black bg-white p-6">
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src="/placeholder.svg"
                      alt="Profile"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <h3 className="mt-4 text-xl font-semibold">
                      Mark Stephanus
                    </h3>
                    <p className="text-sm text-gray-500">
                      Hi 👋, call me mark. I'm a digital creator that create
                      some content about digital marketing, business motivation,
                      and technopreneurship
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
