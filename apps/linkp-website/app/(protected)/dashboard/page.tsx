import { auth } from "@/app/auth";

export const runtime = "edge";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) return <div>Not authenticated</div>;

  return (
    <>
      <pre>{JSON.stringify(session.user)}</pre>
    </>
  );
}
