import { Navbar } from "@/components/shared/navbar";
import LandingContent from "@/components/shared/landing-content";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <LandingContent />
    </div>
  );
}
