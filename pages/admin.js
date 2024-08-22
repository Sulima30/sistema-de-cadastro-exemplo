import BarraInicial from "@/components/BarraInicial";
import MenuModulos from "@/components/NavegacaoModulos";
import Sidebar from "@/components/Sidebar";


export default function AdminPage() {
  return (
    <div>
      <BarraInicial />
      <MenuModulos
        items={[
          { href: '/Cadastros/Gestao-Cadastral', label: 'Cadastros', isActive: true, isDisabled: false },
          // { href: '/Estoque/Gestao-Estoque', label: 'Gestão de Estoque', isActive: false, isDisabled: true },
          { href: '/Comercial/Gestao-Comercial', label: 'Comercial', isActive: false, isDisabled: false },
          // { href: '/Financeiro/Gestao-Financeira', label: 'Gestão Financeira', isActive: false, isDisabled: true },
        ]}
      />
      <div className="container-fluid">
        <h1>Bem-vindo, Admin</h1>
        <div className="row">
          <div className="col-lg-12" style={{ padding: '0px' }}>
            {/* Seu conteúdo aqui */}
          </div>
        </div>
      </div>
    </div>
  );
}
