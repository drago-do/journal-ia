import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Main from "./components/Main";
const inter = Inter({ subsets: ["latin"] });
import Footer from "./components/Footer";

export default function Home() {
  const sections = [
    {
      title: "Inicio",
      url: "/",
    },
    {
      title: "Acerca de Nosotros",
      url: "/about",
    },
    {
      title: "Productos",
      url: "/products",
    },
    {
      title: "Contáctanos",
      url: "/contact",
    },
  ];

  return (
    <>
      <Header sections={sections} title="OpenJournal" />
      <Main />
      <Footer />
    </>
  );
}
