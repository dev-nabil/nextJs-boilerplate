import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

export default function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </div>

        <div className="w-fit flex-none items-center justify-end gap-2 px-4">
          <NavUser />
        </div>
      </div>
    </header>
  );
}
