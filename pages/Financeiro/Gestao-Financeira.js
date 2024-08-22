import BarraInicial from "@/components/BarraInicial";
import Sidebar from "@/components/Sidebar";
import React, { useEffect } from "react";

const menuCadastroFinanceiro = [
  {
    id: 'CentroCusto',
    Image: '/icons/cash-coin.svg',
    title: 'Centro de Custo',
    icon: null,
    subMenu: [
      { href: 'Cadastro-CentroCustos', title: 'Cadastrar' },
      { href: '/Pesquisar-Centro-de-Custos', title: 'Pesquisar' },
    ],
  },
  {
    id: 'CentroContabil',
    Image: '/icons/cash.svg',
    title: 'Conta Contábil',
    icon: null,
    subMenu: [
      { href: '/Cadastro-Centro-Contabil', title: 'Cadastrar' },
      { href: '/Pesquisar-Conta-Contabil', title: 'Pesquisar' },
    ],
  },
  {
    id: 'classeValor',
    Image: '/icons/cash-stack.svg',
    title: 'Classe de Valor',
    icon: null,
    subMenu: [
      { href: '/Cadastro-Classe-de-Valor', title: 'Cadastrar' },
      { href: '/Pesquisar-Classe-De-Valor', title: 'Pesquisar' },
    ],
  },
];
const menuFinanceiro = [
  {
    id: 'baixarPagamentos',
    Image: '@/icons/cash-stack.svg',
    title: 'Baixar Fatura',
    icon: null,
    subMenu: [
      { href: '/Pesquisar-Pagamentos', title: 'Baixar Fatura' },
    ],
  },
  {
    id: 'renegociacoes',
    Image: '/icons/cash-stack.svg',
    title: 'Renegociar Fatura',
    icon: null,
    subMenu: [
      { href: '/Pesquisar-Renegociacoes', title: 'Renegociar Fatura' },
    ],
  },
  {
    id: 'estorno',
    Image: '/icons/cash-stack.svg',
    title: 'Reembolsar Fatura',
    icon: null,
    subMenu: [
      { href: '/Pesquisar-Reembolsos', title: 'Reembolsar Fatura' },
    ],
  },
  {
    id: 'consultaClientes',
    Image: '/icons/search.svg',
    title: 'Pesquisar',
    href: '/Pesquisar-Contas-a-Receber'

  },
]

const menuContasaPagar = [
  {
    id: 'contaAPagar',
    Image: '/icons/cash-coin.svg',
    title: 'Contas a Pagar',
    icon: null,
    subMenu: [
      { href: '/Cadastro-Contas-a-Pagar', title: 'Cadastrar Conta' },
      { href: 'index-cms.html', title: 'Alterar Conta' },
    ],
  },
  {
    id: 'AprovPagamentos',
    Image: '/icons/cash.svg',
    title: 'Aprov. Pagamento',
    icon: null,
    subMenu: [
      { href: '/Aprovar-Contas-a-Pagar', title: 'Aprovar/Reprovar' },
    ],
  },
  {
    id: 'baixarContas',
    Image: '/icons/cash-stack.svg',
    title: 'Efetuar Pagamento',
    icon: null,
    subMenu: [
      { href: '/Efetuar-Pagamentos-Contas', title: 'Efetuar Pagamento' },
    ],
  },
  {
    id: 'consultaClientes',
    Image: '/icons/search.svg',
    title: 'Pesquisar Contas',
    href: '/Pesquisar-Contas-a-Pagar'
  },
]

const menuMovimentacoesBancarias = [
  {
    id: 'saldoBanco',
    Image: '/icons/cash-coin.svg',
    title: 'Saldos Bancários',
    icon: null,
    subMenu: [
      { href: '/Cadastro-Saldo-Bancario', title: 'Registrar Saldo' },
      { href: '/Login', title: 'Pesquisar' },
    ],
  },
]

export default function GestaoEstoque() {


  return (
    <>
      <BarraInicial />
      <div className="container-fluid ">
        <div className="row bg-light">
          <div className="col-2 " style={{ padding: "0px" }}>
            <Sidebar menuItems={menuFinanceiro} />
          </div>
        </div>
      </div>
    </>
  );
}