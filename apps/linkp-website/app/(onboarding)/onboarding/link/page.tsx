import {MdWorkspaces} from "react-icons/md";
import Link from "next/link";
import {LiaUnlinkSolid} from "react-icons/lia";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {CiCircleQuestion} from "react-icons/ci";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type Props = {
    searchParams: {
        workspace?: string
        workspaceSlug?: string
    }
}


export default function LinkPage({searchParams}: Props) {
    const { workspace, workspaceSlug } = searchParams

    return (
        <div className="mt-[12%] w-[30%] gap-12">
            <div className="flex flex-col justify-center items-center">
                <div className="border border-gray-400 rounded-full p-2">
                    <LiaUnlinkSolid className="h-4 w-4"/>
                </div>
                <h4 className="font-medium font-heading text-2xl">
                    Create a link
                </h4>
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
                                            The URL your users will get redirected to when they tap yougfredswazlink
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                    </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row justify-evenly">
                        <Input
                            className="w-[35%] rounded-r-sm text-xs"
                            type="text"
                            placeholder="Instagram"
                        />
                        <Input
                            className="rounded-l-sm text-xs border-l-0 "
                            type="url"
                            placeholder="https://www.instagram.com/your-handle"
                        />
                    </div>
                    {/*<div className="flex flex-row justify-evenly">*/}
                    {/*    <Input*/}
                    {/*        className="w-[35%] rounded-r-sm text-xs"*/}
                    {/*        type="text"*/}
                    {/*        placeholder="Instagram"*/}
                    {/*    />*/}
                    {/*    <Input*/}
                    {/*        className="rounded-l-sm text-xs border-l-0 "*/}
                    {/*        type="url"*/}
                    {/*        placeholder="https://www.instagram.com/your-handle"*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
            </div>
            <div className="flex flex-col justify-end items-center">
                {/* todo: this should add the above commented block on top*/}
                <Button variant="link">
                Add more link
                </Button>
                {/* todo: this button should create an API call and create the workspace, default template will be selected in case of user didnt select any template */}
                <Button className="w-[100%] text-xs">
                    Create link
                </Button>
                <Button variant="link">
                    I&apos;ll do this later.
                </Button>
            </div>
        </div>
    )
}