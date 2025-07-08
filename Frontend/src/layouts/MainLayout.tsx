import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-200 p-6 pt-20 mx-auto max-w-screen-3xl px-1 lg:px-2 space-y-6 w-full">
        <Outlet />
      </main>
    </div>
  );
}

