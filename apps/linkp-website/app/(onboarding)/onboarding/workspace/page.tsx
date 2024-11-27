'use client';

import { MdWorkspaces } from "react-icons/md";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {CiCircleQuestion} from "react-icons/ci";
import {Button} from "@/components/ui/button";
import {SetStateAction, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function WorkspacePage() {

    const [parentValue, setParentValue] = useState("");
    const [childValue, setChildValue] = useState("");
    const router = useRouter();

    useEffect(() => {
        setChildValue(parentValue);
    }, [parentValue]);

    const handleParentValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setParentValue(e.target.value);
    };
    const handleChildValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setChildValue(e.target.value);
    };

    const handleSubmitButtonClick = () => {
        const searchParams = new URLSearchParams({
            workspace: parentValue,
            workspaceSlug: childValue,
        })
        router.push(`/onboarding/link?${searchParams.toString()}`)
    }


    return (
        <div className="h-dvh min-w-screen flex flex-col items-center">
            <h1 className="absolute top-2 font-heading text-2xl">
            Linkp
        </h1>
            <div className="mt-[12%] w-[25%] mx-auto">
                <div className="flex flex-col justify-center items-center">
                <div className="border border-gray-400 rounded-full p-2">
                <MdWorkspaces className="h-4 w-4"  />
                </div>
                <h4 className="font-medium font-heading text-2xl">Create a workspace</h4>
                    <Link href="/help/article/what-is-a-workspace">
                    <p className="underline text-sm text-gray-600 font-paragraph">what is a workspace?</p>
                    </Link>
                </div>
                <div className=" flex flex-col gap-8 items-start mt-8">
                    <div className="w-[100%]">
                        <div className="flex flex-row gap-2 items-start">
                            <p className="font-paragraph text-xs pb-2">
                                Workspace Name
                            </p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger><CiCircleQuestion className="text-gray-600"/></TooltipTrigger>
                                    <TooltipContent>
                                        <p>This is the name of your workspace on Linkp.co.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    <Input className="text-xs" type="email" placeholder="Acme, Inc." onChange={handleParentValueChange} value={parentValue} />
                    </div>
                    <div className="w-[100%]">
                        <div className="flex flex-row gap-2 items-start">
                            <p className="font-paragraph text-xs pb-2">
                                Workspace Slug
                            </p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger><CiCircleQuestion className="text-gray-600"/></TooltipTrigger>
                                    <TooltipContent>
                                        <p>This is your workspace&apos;s unique slug on Linkp.co. Also on which you will host your Page</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex flex-row">
                        <div className="border border-gray-400 rounded-r-sm rounded-l-md p-2 text-center text-gray-500 text-xs bg-gray-100">
                            linkp.co/
                        </div>
                        <Input className="rounded-l-sm border-l-0 text-xs" type="email" placeholder="Acme, Inc." onChange={handleChildValueChange}  value={childValue}
                               />
                        </div>
                    </div>
                    {/* todo: Add a check that your slug name is unique, fetch all from DB and then verify. `useDebounce` to call API when key stroke stopped, store the response. show the resposnse when button clicked*/}
                    <Button className="w-[100%] text-xs" onClick={handleSubmitButtonClick}>
                        Create workspace
                    </Button>
                    </div>
                </div>
            </div>
            )
            }