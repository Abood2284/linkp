type Props = {
    searchParams: {
        workspace?: string
        workspaceSlug?: string
    }
}


export default function LinkPage({searchParams}: Props) {
    const { workspace, workspaceSlug } = searchParams

    return (
        <div>
            <h1>Product Listing</h1>
            {workspace && <p>Filtered by workspace: {workspace}</p>}
            {workspaceSlug && <p>Sorted by: {workspaceSlug}</p>}
        </div>
    )
}