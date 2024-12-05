"use client";

import { LiaUnlinkSolid } from "react-icons/lia";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CiCircleQuestion } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";

interface LinkItem {
  title: string;
  url: string;
}

type Props = {
  searchParams: {
    workspace?: string;
    workspaceSlug?: string;
  };
};

export default function LinkPage({ searchParams }: Props) {
  const [links, setLinks] = useState<LinkItem[]>([{ title: "", url: "" }]);
  const [error, setError] = useState<string | null>(null);

  function handleLinkChange(
    index: number,
    field: keyof LinkItem,
    value: string
  ) {
    setError(null);
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  }

  function addNewLink() {
    setLinks([...links, { title: "", url: "" }]);
  }

  function deleteLink(index: number) {
    if (links.length === 1) return;
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  }

  function validateLinks() {
    for (let i = 0; i < links.length; i++) {
      if (!links[i].title.trim() || !links[i].url.trim()) {
        setError(`Link ${i + 1} cannot have empty fields`);
        return false;
      }
    }
    return true;
  }

  return (
    <div className="mt-[12%] w-[30%] gap-12">
      <div className="flex flex-col justify-center items-center">
        <div className="border border-gray-400 rounded-full p-2">
          <LiaUnlinkSolid className="h-4 w-4" />
        </div>
        <h4 className="font-medium font-heading text-2xl">Create a link</h4>
        <p className=" text-sm text-gray-600 font-paragraph">
          Don&apos;t worry, you can edit this later.
        </p>
      </div>
      <div className=" w-[100%] flex flex-col mt-8">
        <div className="flex flex-row justify-start items-baseline pb-2">
          <p className="w-[40%] font-paragraph text-xs">Title</p>
          <div className="w-[100%] flex flex-row gap-2">
            <p className=" font-paragraph text-xs">Destination URL</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CiCircleQuestion className="text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    The URL your users will get redirected to when they tap
                    yougfredswazlink
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex flex-row justify-evenly items-center gap-2"
            >
              <Input
                className="w-[35%] rounded-r-sm text-xs"
                type="text"
                placeholder="Instagram"
                value={link.title}
                onChange={(e) =>
                  handleLinkChange(index, "title", e.target.value)
                }
              />
              <Input
                className="rounded-l-sm text-xs border-l-0"
                type="url"
                placeholder="https://www.instagram.com/your-handle"
                value={link.url}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              />
              {links.length > 1 && (
                <button
                  onClick={() => deleteLink(index)}
                  className="text-red-500 hover:animate-bounce  transition-colors"
                  aria-label="Delete link"
                >
                  <FaRegTrashAlt className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
      <div className="flex flex-col justify-end items-center gap-2">
        <Button variant="link" onClick={addNewLink}>
          Add more link
        </Button>
        <Button
          className="w-[100%] text-xs"
          onClick={() => {
            if (validateLinks()) {
              const params = new URLSearchParams(searchParams);
              params.set("links", JSON.stringify(links));
              window.location.href = `/onboarding/select-template?${params.toString()}`;
            }
          }}
        >
          Create link
        </Button>
        <Link href="/onboarding/select-template">
          <Button variant="link">I&apos;ll do this later.</Button>
        </Link>
      </div>
    </div>
  );
}
