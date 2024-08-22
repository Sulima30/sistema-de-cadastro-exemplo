import BarraInicial from "@/components/BarraInicial";
import CardIndicator from "@/components/Card-Indicator";
import Sidebar from "@/components/Sidebar";
import React, { useEffect } from "react";

const menuCadastro = [
  {
    id: 'pessoaFisica',
    Image: '/icons/person-badge-fill.svg',
    title: 'Pessoa Física',
    icon: null,
    subMenu: [
      { href: '/Cadastros/Cadastro-Pessoa-Fisica', title: 'Cadastrar' },
      { href: '/Cadastros/Pesquisar-Cliente-PF', title: 'Pesquisar' },
    ],
  },
  {
    id: 'pessoaJuridica',
    Image: '/icons/building-add.svg',
    title: 'Pessoa Jurídica',
    icon: null,
    subMenu: [
      { href: '/Cadastros/Cadastro-Pessoa-Juridica', title: 'Cadastrar' },
      { href: '/Cadastros/Pesquisar-Cliente-PJ', title: 'Pesquisar' },
    ],
  },
  {
    id: 'consultaClientes',
    Image: '/icons/search.svg',
    title: 'Pesquisar Clientes',
    href: '/Cadastros/Pesquisar-Todos-Clientes',
  },
  {
    id: 'fornecedor',
    Image: '/icons/buildings-fill.svg',
    title: 'Fornecedor',
    icon: null,
    subMenu: [
      { href: '/Cadastros/Cadastro-Fornecedor', title: 'Cadastrar' },
      { href: '/Cadastros/Pesquisar-Fornecedor', title: 'Pesquisar' },
    ],
  },
  // {
  //   id: 'consultaTerceiros',
  //   Image: '/icons/search.svg',
  //   title: 'Pesquisar',
  //   href: '/Pesquisar-Todos-Terceirizados',
  // },
];

export default function GestaoCadastral() {


  return (
    <>
      <BarraInicial />
      <div className="container-fluid ">
        <div className="row bg-light">
          <div className="col-2 " style={{ padding: "0px" }}>
            <Sidebar menuItems={menuCadastro} />
          </div>
          <div className="col-md-10">
          </div>
        </div>
      </div>
    </>
  );
}