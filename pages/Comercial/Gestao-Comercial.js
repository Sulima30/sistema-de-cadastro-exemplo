import BarraInicial from "@/components/BarraInicial";
import Sidebar from "@/components/Sidebar";
import React, { useEffect } from "react";

const menuComercial = [
  {
    id: 'gerarPedido',
    Image: '/icons/cash-coin.svg',
    title: 'Gerar Pedido',
    icon: null,
    subMenu: [
      { href: '/Comercial/Cadastro-Pedido-de-Venda', title: 'Gerar Pedido' },
    ],
  },
  {
    id: 'AprovPedidos',
    Image: '/icons/cash.svg',
    title: 'Aprovar Pedidos',
    icon: null,
    subMenu: [
      { href: '/Comercial/Aprovar-Pedido', title: 'Aprovar Pedido' },
    ],
  },
  {
    id: 'faturarPedido',
    Image: '/icons/cash-stack.svg',
    title: 'Faturar Pedido',
    icon: null,
    subMenu: [
      { href: '/Comercial/Faturar-Pedido', title: 'Faturar Pedido' },
    ],
  },
  {
    id: 'pesquisarPedidosdeVenda',
    Image: '/icons/search.svg',
    title: 'Pesquisar Pedidos',
    href: '/Pesquisar-Pedidos-de-Venda',
  },
];

export default function GestaoComercial() {


  return (
    <>
      <BarraInicial />
      <div className="container-fluid ">
        <div className="row bg-light">
          <div className="col-2 " style={{ padding: "0px" }}>
            <Sidebar menuItems={menuComercial} />
          </div>
        </div>
      </div>
    </>
  );
}