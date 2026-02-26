import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="p-2">
      <h3>This is a about page, it should work fine as long as you give it context, but without context its nothing, you have to provide context to it or it will not work.</h3>
    </div>
  );
}
