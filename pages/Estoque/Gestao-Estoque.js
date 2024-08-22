import BarraInicial from "@/components/BarraInicial";
import Sidebar from "@/components/Sidebar";
import React, { useEffect } from "react";

const menuItens = [

  {
    id: 'grupos',
    Image: '/icons/boxes.svg',
    title: 'Grupos',
    icon: null,
    subMenu: [
      { href: '/Cadastro-Grupos', title: 'Cadastrar' },
      { href: '/Pesquisar-Grupo', title: 'Pesquisar' },
    ],
  },
  {
    id: 'subGrupos',
    Image: '/icons/boxes.svg',
    title: 'Sub Grupos',
    icon: null,
    subMenu: [
      { href: '/Cadastro-SubGrupo', title: 'Cadastrar' },
      { href: '/Pesquisar-Subgrupo', title: 'Pesquisar' },
    ],
  },
  {
    id: 'produtos',
    Image: '/icons/box2-fill.svg',
    title: 'Itens',
    icon: null,
    subMenu: [

      { href: '/Cadastro-Produtos', title: 'Cadastrar' },
      { href: '/Pesquisar-Itens', title: 'Pesquisar' },
    ],
  },
];

export default function GestaoEstoque() {


  return (
    <>
      <BarraInicial />
      <div className="container-fluid ">
        <div className="row bg-light">
          <div className="col-2 " style={{ padding: "0px" }}>
            <Sidebar menuItems={menuItens} />
          </div>
        </div>
      </div>
    </>
  );
}