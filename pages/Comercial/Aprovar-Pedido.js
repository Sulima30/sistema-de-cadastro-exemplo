import Breadcump from '@/components/Breadcump';
import { MyButton } from '@/components/MyButton';
import InputWithLabel from '@/components/Input';
import { NavTelasOperacionais } from '@/components/Navegacao-Operacao';
import Link from 'next/link';
import Image from 'next/image';
import SignatureCanvas from 'react-signature-canvas';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';
import Pagination from '@/components/Pagination';

function AprovarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [expandedPedidoId, setExpandedPedidoId] = useState(null);
  const [assinatura, setAssinatura] = useState(null);
  const [signaturePad, setSignaturePad] = useState(null);

  const toggleDetalhesPedido = (pedidoId) => {
    setExpandedPedidoId((prevState) => (prevState === pedidoId ? null : pedidoId));
  };

  const mostrarFatura = (numeroPedido) => {
    setExpandedPedidoId(numeroPedido);
    // Limpar assinatura ao expandir um novo pedido
    if (signaturePad) signaturePad.clear();
  };

  const salvarAssinatura = (numeroPedido) => {
    const assinaturaBase64 = signaturePad.toDataURL();

    axios.post(`http://localhost:4000/api/Salvar`, { numeroPedido, assinatura: assinaturaBase64 })
      .then(response => {
        alert('Assinatura salva com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao salvar a assinatura:', error);
      });
  };

  const handleApproveAndSaveSignature = async (numeroPedido) => {
    salvarAssinatura(numeroPedido);
    handleApprove(numeroPedido);
    alert('Assinatura Aprovada');
    // Chame a API para enviar o e-mail
    try {
      const response = await axios.post('http://localhost:4000/api/send-email', { numeroPedido });

      if (response.status === 200) {
        alert('Assinatura Aprovada e E-mail enviado');
      } else {
        alert('Assinatura Aprovada, mas houve um erro ao enviar o e-mail');
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      alert('Assinatura Aprovada, mas houve um erro ao enviar o e-mail');
    }
  };


  useEffect(() => {
    fetchPedidos();
  }, [page, search, itemsPerPage]);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/Pedidos', {
        params: {
          page,
          limit: itemsPerPage,
          search,
        }
      });
      setPedidos(response.data.pedidos);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setError('Erro ao buscar pedidos.');
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

  const handleApprove = async (numeroPedido) => {
    try {
      await updatePedidoStatus(numeroPedido, 'Aprovado');
      setSuccessMessage(`Pedido aprovado com sucesso!`);
    } catch (error) {
      console.error('Erro ao aprovar o pedido:', error);
      setError('Erro ao aprovar o pedido.');
    }
  };

  const handleReject = async (numeroPedido) => {
    try {
      await updatePedidoStatus(numeroPedido, 'Reprovado');
      setSuccessMessage(`Pedido reprovado com sucesso!`);
    } catch (error) {
      console.error('Erro ao reprovar o pedido:', error);
      setError('Erro ao reprovar o pedido.');
    }
  };

  const updatePedidoStatus = async (numeroPedido, status) => {
    try {
      const response = await axios.post('http://localhost:4000/api/Atualizar-Status', { numeroPedido, status });
      const updatedPedidos = pedidos.map(pedido => {
        if (pedido.numeroPedido === numeroPedido) {
          return { ...pedido, statusPedidoVenda: status };
        }
        return pedido;
      });
      setPedidos(updatedPedidos);
    } catch (error) {
      throw new Error(error);
    }
  };
  const totalPages = Math.ceil(totalItems / itemsPerPage);


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
            link={"/Comercial/Gestao-Comercial"}
            primeiroNivel={"Gestão de Vendas"}
            segundoNivel={"Aprovar/Reprovar Pedidos"}
          />
          <section>
            <div className="card mb-4">
              <div className="card-header"><h4 className="card-heading">Pesquisa de Pedidos</h4></div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3">
                    <form className="ms-auto me-4 d-none d-lg-block" id="searchForm">
                      <div className="input-group input-group-sm">
                        <input className="form-control" id="searchInput" type="text"
                          value={search}
                          onChange={handleSearch}
                          placeholder="Pesquisar Pedido..." />
                        <button className="btn btn-search-sl-pd" type="button" onClick={fetchPedidos}>
                          <Image src="/icons/search.svg" width={20} height={20} alt="Pesquisar" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
              </div>
            </div>
          </section>
          <section>
            <div className="card card-table mb-4">
              <div className="card-header">
                <div className="card-heading">Tabela de Pedidos</div>
              </div>
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
                  <table className="table table-hover mb-0 dataTable-table table-striped">
                    <thead>
                      <tr>
                        <th style={{ width: "3%", textAlign: "center" }}>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Cód. Pedido</a>
                        </th>
                        <th data-sortable="" style={{ width: "16%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Cliente</a>
                        </th>
                        <th data-sortable="" style={{ width: "12%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Data</a>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Valor Total</a>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Itens</a>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Status</a>
                        </th>
                        <th data-sortable="" style={{ width: "16%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Ações</a>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map(pedido => (
                        <React.Fragment key={pedido.numeroPedido}>
                          <tr>
                            <td style={{ textAlign: "right" }}><button className="btn-detalhes m-1" onClick={() => toggleDetalhesPedido(pedido.numeroPedido)}>
                              {expandedPedidoId === pedido.numeroPedido ? '-' : '+'}
                            </button></td>
                            <td style={{ textAlign: "center" }}>{pedido.numeroPedido}</td>
                            <td>{pedido.codCliente}</td>
                            <td style={{ textAlign: "center" }}>{new Date(pedido.dataVenda).toLocaleDateString()}</td>
                            <td style={{ textAlign: "center" }}>R${pedido.valorTotal}</td>
                            <td style={{ textAlign: "center" }}>{pedido.quantidadeItens}</td>
                            <td style={{ textAlign: "center" }}>{pedido.statusPedidoVenda}</td>
                            <td style={{ textAlign: "center" }}>
                              <MyButton className="btn-aprovar" name='Aprovar' onClick={() => handleApproveAndSaveSignature(pedido.numeroPedido)} disabled={pedido.statusPedidoVenda !== 'Aguardando Aprovação'} />
                              <MyButton className="btn-reprovar" name='Reprovar' onClick={() => handleApprove(pedido.numeroPedido)} disabled={pedido.statusPedidoVenda !== 'Aguardando Aprovação'} />
                            </td>
                          </tr>
                          {expandedPedidoId === pedido.numeroPedido && (
                            <tr>
                              <td colSpan="7">
                                <table className="table table-hover mb-0">
                                  <thead>
                                    <tr>
                                      <th>Cód. Produto</th>
                                      <th>Nome Resumido</th>
                                      <th>Unid. Medida</th>
                                      <th>Quantidade</th>
                                      <th>Preço Unitário</th>
                                      <th>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Array.isArray(pedido.itens) && pedido.itens.length > 0 ? (
                                      pedido.itens.map(item => (
                                        <tr key={item.numeroPedido}>
                                          <td>{item.codProduto}</td>
                                          <td>{item.nomeResumido}</td>
                                          <td>{item.unidMedida}</td>
                                          <td>{item.quantidadeItem}</td>
                                          <td>{item.precoUnitarioItem}</td>
                                          <td>{item.subTotalItem}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum item encontrado</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                                <div className='text-center'>
                                  <h4>Assinatura do Cliente</h4>
                                  <SignatureCanvas
                                    ref={(ref) => { setSignaturePad(ref); }}
                                    penColor="black"
                                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                                  />
                                  <p>{pedido.nomeCompleto}</p>
                                  <p>{pedido.codCliente}</p>

                                </div>
                                <MyButton onClick={() => signaturePad.clear()} name='Refazer Assinatura' className='btn-sl' />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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
          </section>
        </div>
      </div>
    </>
  );
}

export default AprovarPedidos;
