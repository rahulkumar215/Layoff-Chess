import { useUserStore } from "@/store/auth-store";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    navigate({ to: "/authorize", search: "" });
  }

  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}
