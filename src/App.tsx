import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";

// The persistent shell: fixed sidebar on the left, routed content on the right.
export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-column">
        <main className="content">
          <Outlet />
        </main>
        <footer className="site-footer">
          lilguys is an original virtual-pet homage. all lil guys, art, and copy
          are our own.
        </footer>
      </div>
    </div>
  );
}
