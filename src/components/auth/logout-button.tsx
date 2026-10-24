import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-black bg-white border border-zinc-200 hover:border-red-600/50 hover:bg-zinc-50 transition-all flex items-center gap-1.5 shadow-sm"
      >
        <LogOut className="w-3.5 h-3.5 text-red-500" />
        <span>Sign Out</span>
      </button>
    </form>
  );
}
