import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useUserStore } from "@/store/auth-store";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";

export const Route = createFileRoute("/(auth)/authorize")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showAuth, setShowAuth] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useUserStore((state) => state);

  const handlePlay = () => {
    if (!user) return setShowAuth(true);

    navigate({ to: "/game/$gameId", params: { gameId: "random" } });
  };

  const handlePlayAsGuest = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) return;
    try {
      const res = await api.post("/auth/guest", {
        name: username,
      });
      console.log(res.data);
      setUser(res.data);
      navigate({ to: "/game/$gameId", params: { gameId: "random" } });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  return (
    <>
      <Button onClick={handlePlay}>Play</Button>
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter The Game World</DialogTitle>
            <DialogDescription>
              Choose a way to login and play the game
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle> Play as Guest - {username}</CardTitle>
              <CardDescription>
                Don't worry your progress will be saved.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePlayAsGuest}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Username *</FieldLabel>
                    <Input
                      placeholder="Enter username"
                      value={username}
                      required
                      onChange={handleUsername}
                    />
                  </Field>
                  <Field>
                    <Button type="submit">Play Game</Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
