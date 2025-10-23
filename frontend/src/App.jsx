
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="pt-20 max-w-6xl mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
}
