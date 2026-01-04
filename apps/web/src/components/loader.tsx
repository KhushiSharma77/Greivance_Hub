import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <div className="relative">
        {/* Soft glow */}
        <div className="absolute inset-0 rounded-full bg-purple-400/30 blur-xl" />

        {/* Spinner */}
        <Loader2 className="relative size-8 animate-spin text-purple-600" />
      </div>
    </div>
  );
}
