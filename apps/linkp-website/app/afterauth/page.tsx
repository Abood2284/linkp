"use client";

import { auth } from "../auth";

export const runtime = "edge";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center">
      {session && <pre>{JSON.stringify(session)}</pre>}
    </div>
  );
}
