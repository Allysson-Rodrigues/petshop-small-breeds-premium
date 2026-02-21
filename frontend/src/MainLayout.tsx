import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

export default function MainLayout() {
  // SEO: <title>Petshop Small Breeds</title>
  // <meta name="description" content="Especialistas em raças pequenas." />
  // <meta property="og:title" content="Petshop Small Breeds" />
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
