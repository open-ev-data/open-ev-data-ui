import { Outlet } from "react-router-dom";

export function App() {
  return (
    <div className="app-root">
      {/* TODO: Add Layout components here (Header, Sidebar, etc.) */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
