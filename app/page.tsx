import { Suspense } from "react";
import CatalogView from "@/components/CatalogView";
import { Cpu } from "lucide-react";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 py-24">
          <div className="h-10 w-10 rounded-subtle border border-cyber-cyan/30 flex items-center justify-center animate-spin">
            <Cpu className="h-5 w-5 text-cyber-cyan" />
          </div>
          <div className="font-mono text-xs text-titanium-400 uppercase tracking-widest">
            INITIALIZING CATALOG ENGINE...
          </div>
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  );
}
