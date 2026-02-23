import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

export default function MainLayout() {
  return (
    <div className="font-sans antialiased flex flex-col min-h-screen">
      <Helmet>
        <title>Small Breeds | Luxo e Cuidado para seu Pet</title>
        <meta
          name="description"
          content="Petshop premium para raças pequenas com serviços, loja e agendamento online."
        />
        <meta property="og:title" content="Small Breeds | Luxo e Cuidado para seu Pet" />
        <meta
          property="og:description"
          content="Petshop premium para raças pequenas com serviços, loja e agendamento online."
        />
        <link rel="canonical" href="https://smallbreeds.com.br/" />
      </Helmet>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Pular para o conteúdo principal
      </a>
      <Header />
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
