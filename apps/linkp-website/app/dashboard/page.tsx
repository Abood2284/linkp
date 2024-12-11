import { BioLinkContent } from "./components/bio-link-content";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";

export default function Page() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <BioLinkContent />
      </div>
    </div>
  );
}
