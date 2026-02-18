import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";
import { FaChessKnight } from "react-icons/fa6";
import { SiChessdotcom } from "react-icons/si";
import { IoExtensionPuzzle } from "react-icons/io5";
import { IoIosAnalytics } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { cx } from "class-variance-authority";
import { Chessboard } from "react-chessboard";

export function App() {
  const chessboardOptions = {
    boardStyle: {
      width: "500px",
      height: "500px",
    },
  };
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden"
                >
                  <a href="#">
                    <FaChessKnight className="text-foreground" />
                    <span>Layoff Chess</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem className="p-1.5">
                <SidebarMenuButton className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden">
                  <SiChessdotcom />
                  <span>Play Chess</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="p-1.5">
                <SidebarMenuButton className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden">
                  <IoExtensionPuzzle />
                  <span>Solve Puzzels</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenuItem className="p-1.5">
              <SidebarMenuButton className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden">
                <IoIosAnalytics />
                <span>Analysis</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="p-1.5">
              <SidebarMenuButton className="gap-2 [&>span]:transition-all [&>span]:duration-200 [&>span]:whitespace-nowrap [&>span]:overflow-hidden">
                <FaUserFriends />
                <span>Friends</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col w-full">
          <header className="flex h-10 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-foreground" />

              <Separator orientation="vertical" className="h-4 self-center!" />
            </div>

            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cx(
                    "text-foreground",
                    navigationMenuTriggerStyle(),
                  )}
                >
                  Play Chess
                </NavigationMenuLink>
              </NavigationMenuItem>
              <Separator orientation="vertical" className="h-4 self-center!" />
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cx(
                    "text-foreground",
                    navigationMenuTriggerStyle(),
                  )}
                >
                  Solve Puzzels
                </NavigationMenuLink>
              </NavigationMenuItem>
              <Separator orientation="vertical" className="h-4 self-center!" />
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cx(
                    "text-foreground",
                    navigationMenuTriggerStyle(),
                  )}
                >
                  Analysis
                </NavigationMenuLink>
              </NavigationMenuItem>
              <Separator orientation="vertical" className="h-4 self-center!" />
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={cx(
                    "text-foreground",
                    navigationMenuTriggerStyle(),
                  )}
                >
                  Friends
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenu>

            <Button>New</Button>
          </header>

          <main className="flex-1 p-6">
            <Chessboard options={chessboardOptions} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default App;
