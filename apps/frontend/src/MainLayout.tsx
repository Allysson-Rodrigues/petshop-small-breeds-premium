import { Outlet } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

export default function MainLayout() {
  return (
    <div className="font-sans antialiased flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
