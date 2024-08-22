import Breadcump from '@/components/Breadcump';
import { MyButton } from '@/components/MyButton';
import InputWithLabel from '@/components/Input';
import { NavTelasOperacionais } from '@/components/Navegacao-Operacao';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from 'docx';
import { useRouter } from 'next/router';
import axios from 'axios';
import Pagination from '@/components/Pagination';
// import { codCliente } from '../backend/controllers/testDatas';

function PesquisarClientePJ() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tipo, setTipo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    Aprovado: false,
    Reprovado: false,
    'Aguardando Aprovação': false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filterName) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: !selectedFilters[filterName],
    });
    // Lógica para aplicar os filtros selecionados
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleItemClick = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const filteredMovimentacoes = movimentacoes.filter(mov =>
    mov.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
    mov.codCliente.toString().includes(search)
  );

  const handleCloseFilter = () => {
    // Lógica para fechar o filtro

    // Exibe a contagem de itens selecionados
    alert(`${selectedItems.length} selecionados`);
  };


  useEffect(() => {
    fetchMovimentacoes();
  }, [page, search, startDate, endDate, itemsPerPage]);
  // codCliente


  const fetchMovimentacoes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/Pesquisar-Clientes-PJ', {
        params: {
          page,
          limit: itemsPerPage,
          search,
          codCliente,
          startDate,
          endDate
        }
      });
      setMovimentacoes(response.data.movimentacoes);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching movimentacoes:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Bloqueado";
      case 2:
        return "Desbloqueado";
      default:
        return "Desconhecido";
    }
  };

  const handleEditarCliente = (codCliente) => {
    console.log('codCliente do cliente:', codCliente);
    router.push(`/Atualizar-Cadastro-Pessoa-Juridica?codCliente=${codCliente}`);
  };

  const router = useRouter();

  const exportToExcel = () => {
    const table = document.getElementById('myTable');
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet JS" });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'table.xlsx');
  };

  const exportToPDF = () => {
    const input = document.getElementById('myTable');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Adicionar cabeçalho
        const headerText = 'Relação de Clientes';
        pdf.setFontSize(16);
        pdf.text(headerText, 10, 10); // Posição do cabeçalho

        // Adicionar imagem da tabela
        pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight - 20); // Ajuste a posição conforme necessário

        pdf.save("table.pdf");
      });
  };

  const exportToWord = () => {
    const table = document.getElementById('myTable');
    const rows = Array.from(table.rows);
    const tableRows = rows.map(row => {
      const cells = Array.from(row.cells).map(cell => new TableCell({
        children: [new Paragraph(cell.innerText)]
      }));
      return new TableRow({ children: cells });
    });

    const doc = new Document({
      sections: [{
        children: [
          new Table({
            rows: tableRows
          })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "table.docx");
    });
  };

  return (
    <>
      <NavTelasOperacionais
        nome_Sistema={"Spurgeon"}
      />
      <div className='page-holder fundo-formulario-sl'>
        <div className="container-fluid px-lg-4">
          <Breadcump
            link={"/Cadastros/Gestao-Cadastral"}
            primeiroNivel={"Gestão de Cadastro"}
            segundoNivel={"Pesquisar Cliente Pessoa Jurídica"}
          />
          <section>
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="card-heading">Pesquisa Dinâmica</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3">
                    <form className="ms-auto me-4 d-none d-lg-block" id="searchForm">
                      <div className="input-group input-group-sm">
                        <input
                          className="form-control"
                          id="searchInput"
                          type="text"
                          value={search}
                          onChange={handleSearch}
                          placeholder="Pesquisar Fornecedor..."
                        />
                        <button
                          className="btn btn-search-sl-pd"
                          type="button"
                          onClick={fetchMovimentacoes}
                        >
                          <Image
                            src="/icons/search.svg"
                            width={20}
                            height={20}
                            alt="Pesquisar"
                          />
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-lg-9">
                    <button
                      className="btn-filtrar"
                      onClick={toggleFilters}
                    >
                      {showFilters ? 'Fechar Filtros' : 'Abrir Filtros'}
                    </button>
                    {showFilters && (
                      <div className="dropdown">
                        <div>
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedFilters.Aprovado}
                              onChange={() => handleFilterChange('Aprovado')}
                            />
                            Aprovado
                          </label>
                        </div>
                        <div>
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedFilters.Reprovado}
                              onChange={() => handleFilterChange('Reprovado')}
                            />
                            Reprovado
                          </label>
                        </div>
                        <div>
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedFilters['Aguardando Aprovação']}
                              onChange={() => handleFilterChange('Aguardando Aprovação')}
                            />
                            Aguardando Aprovação
                          </label>
                        </div>
                        {/* Adicione mais filtros conforme necessário */}
                      </div>
                    )}
                  </div>
                </div>
                <div className='row'>
                  <div className="col-lg-2 mt-3">
                    <Link href={'/Cadastros/Cadastro-Pessoa-Juridica'}>
                      <button className="btn-sl-mini">
                        <Image
                          src="/icons/plus-square-fill.svg"
                          width={15}
                          height={15}
                          style={{ margin: '0 10px', filter: 'invert(80%) sepia(5%) saturate(0%) hue-rotate(180deg) brightness(90%) contrast(88%)' }}
                          alt="desc imagem"
                        />
                        Novo Cadastro
                      </button>
                    </Link>
                  </div>
                  <div className='col-lg-9 mt-3'>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="card card-table mb-4">
              <div className="card-header">
                <div className="card-heading">Tabela de Fornecedores</div>
                <div className="dataTable-wrapper dataTable-loading no-footer sortable fixed-columns">
                  <div className="dataTable-top">
                    <div className="dataTable-dropdown">
                      <label>
                        Exibição por página
                        <select className="dataTable-selector form-select form-select-sm"
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}>
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                          <option value="25">25</option>
                        </select>
                      </label>
                    </div>
                    <div className='col-lg-1'>
                      <div className="dropdown mt-3">
                        <button className="btn btn-secondary  btn-filtrar dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                          Opções
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          <li><a className="dropdown-item" href="#" onClick={exportToExcel}>
                            <Image src="/icons/files.svg" width={15} height={15} style={{ margin: "0 10px" }} alt="desc imagem" /> Exportar Excel
                          </a></li>
                          <li><a className="dropdown-item" href="#" onClick={exportToPDF}>
                            <Image src="/icons/filetype-pdf.svg" width={15} height={15} style={{ margin: "0 10px" }} alt="desc imagem" /> Exportar PDF
                          </a></li>
                          <li><a className="dropdown-item" href="#" onClick={exportToWord}>
                            <Image src="/icons/file-earmark-word.svg" width={15} height={15} style={{ margin: "0 10px" }} alt="desc imagem" /> Exportar Word
                          </a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="dataTable-container border-0">
                    <table className="table table-hover mb-0 dataTable-table table-striped" id="myTable">
                      <thead>
                        <tr>
                          <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                            <a href="#" className="dataTable-sorter">Cód. Cliente</a>
                          </th>
                          <th data-sortable="" style={{ width: "16%", textAlign: "center" }}>
                            <a href="#" className="dataTable-sorter">Nome do Fornecedor</a>
                          </th>
                          <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                            <a href="#" className="dataTable-sorter">Telefone</a>
                          </th>
                          <th data-sortable="" style={{ width: "11%", textAlign: "center" }}>
                            <a href="#" className="dataTable-sorter">Celular</a>
                          </th>
                          <th data-sortable="" style={{ width: "12%", textAlign: "center" }}>
                            <a href="#" className="dataTable-sorter">E-mail</a>
                          </th>
                          <th data-sortable="" style={{ width: "16%", textAlign: "center" }}>
                            <a href="#" className="dataTable-sorter">Cidade</a>
                          </th>
                          <th data-sortable="" style={{ width: "16%", textAlign: "center" }}>
                            <a href="#" className="dataTable-sorter">Ações</a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {movimentacoes.map(item => (
                          <tr key={item.id}>
                            <td style={{ textAlign: "center" }}>{item.codCliente}</td>
                            <td>{item.razaoSocial}</td>
                            <td style={{ textAlign: "center" }}>{item.telefone}</td>
                            <td style={{ textAlign: "center" }}>{item.celular}</td>
                            <td style={{ textAlign: "center" }}>{item.email}</td>
                            <td style={{ textAlign: "center" }}>{item.cidade}</td>
                            <td style={{ textAlign: "center" }}>
                              <MyButton className="btn-editar sm" name="Editar" onClick={() => handleEditarCliente(item.codCliente)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="dataTable-bottom">
                    <div className="dataTable-info">
                      Mostrando {((page - 1) * itemsPerPage) + 1} a {Math.min(page * itemsPerPage, totalItems)} de {totalItems} entradas
                    </div>
                    <Pagination
                      page={page}
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      setPage={setPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default PesquisarClientePJ;
