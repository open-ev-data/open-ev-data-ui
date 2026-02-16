import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <div style={{ padding: "var(--space-8)" }}>
            <h1
              style={{
                fontSize: "var(--text-4xl)",
                color: "var(--text-primary)",
              }}
            >
              Hello World
            </h1>
            <p
              style={{
                marginTop: "var(--space-4)",
                color: "var(--text-secondary)",
              }}
            >
              Open EV Data UI Infrastructure Setup Complete
            </p>
          </div>
        ),
      },
    ],
  },
]);
