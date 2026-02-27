import { UserButton, useUser } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { user, isLoaded } = useUser();

  console.log(user);
  console.log(isLoaded);
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <UserButton />
    </div>
  );
}
