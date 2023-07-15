import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-blue-900 to-transparent  pt-5">
      <div className="container mx-auto flex items-center justify-between py-4 px-12">
        <div className="text-white text-lg font-bold mr-5 drop-shadow-xl">
          Journal-IA
        </div>
        <div className="hidden md:block text-white text-center">
          Artículos científicos de ITESA
        </div>
        <div className="md:ml-auto">
          <Image
            src="https://www.itesa.edu.mx/_app/vista/default/img/logo-tec_original.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
