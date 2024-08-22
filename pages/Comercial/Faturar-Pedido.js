import Breadcump from '@/components/Breadcump';
import { MyButton } from '@/components/MyButton';
import InputWithLabel from '@/components/Input';
import { NavTelasOperacionais } from '@/components/Navegacao-Operacao';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Pagination from '@/components/Pagination';
// import { numeroPedido } from '../backend/controllers/testDatas';
// import FaturaModal from './FaturamentoModal';


const FaturarPedido = () => {
  const [valorTotal, setValorTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [dataVencimento, setDataVencimento] = useState([]);
  const [valorParcela, setValorParcela] = useState(0);
  const [parcelaInfo, setParcelaInfo] = useState([]);

  const dataFatura = new Date();
  const openModal = (pedido) => {
    setPedidoSelecionado(pedido);
    setValorTotal(parseFloat(pedido.valorTotal));
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const [pedidosAprovados, setPedidosAprovados] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [expandedPedidoId, setExpandedPedidoId] = useState(null);

  const toggleDetalhesPedido = (pedidoId) => {
    setExpandedPedidoId((prevState) => (prevState === pedidoId ? null : pedidoId));
  };

  useEffect(() => {
    fetchPedidosAprovados();
  }, []);

  const fetchPedidosAprovados = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/Pedidos-Aprovados');
      // Filtrar os pedidos para excluir os pedidos cujo status seja 'Faturado'
      const pedidosNaoFaturados = response.data.pedidos.filter(pedido => pedido.statusPedidoVenda !== 'Faturado');
      setPedidosAprovados(pedidosNaoFaturados);
      setFilteredPedidos(pedidosNaoFaturados);
    } catch (error) {
      console.error('Erro ao buscar pedidos aprovados:', error);
      setError('Erro ao buscar pedidos aprovados.');
    }
  };

  useEffect(() => {
    const filtered = pedidosAprovados.filter(pedido =>
      pedido.numeroPedido.includes(searchTerm) || pedido.codCliente.includes(searchTerm)
    );
    setFilteredPedidos(filtered);
  }, [searchTerm, pedidosAprovados]);

  useEffect(() => {
    const total = pedidosAprovados.reduce((total, pedido) => total + (parseFloat(pedido.valorTotal) || 0), 0);
    setValorTotal(total);
  }, [pedidosAprovados]);


  const handleFormSubmit = async (numeroPedido) => {
    try {
      console.log('Enviando dados para o backend:', {
        numeroPedido,
        condPagamento,
        quantParcelas,
        outrasInformacoes,
        dataVencimento, // Certifique-se de que dataVencimento seja um array de datas
        valorParcela,
        parcelaInfo,
      });

      const response = await axios.post('http://localhost:4000/api/Faturar', {
        numeroPedido,
        condPagamento,
        quantParcelas,
        outrasInformacoes,
        dataVencimento: dataVencimento.map(date => new Date(date)), // Converta as strings de data para objetos Date
        valorParcela,
        parcelaInfo,
      });

      const pdfContent = await gerarPDF(); // Assumindo que gerarPDF retorna o conteúdo do PDF
      const formData = new FormData();
      formData.append('numeroPedido', numeroPedido);
      formData.append('pdf', new Blob([pdfContent], { type: 'application/pdf' }), 'fatura.pdf');

      const emailResponse = await axios.post('http://localhost:4000/api/send-invoice-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Resposta do envio de e-mail:', emailResponse.data);
      setSuccessMessage('Fatura gerada com sucesso!');
      console.log('Resposta do backend:', response.data);

    } catch (error) {
      console.error('Erro ao gerar fatura:', error);
      setError('Erro ao gerar fatura.');
    }
  };

  const handleGenerateInvoice = async (numeroPedido, pdfContent) => {
    try {
      const pedido = pedidosAprovados.find(pedido => pedido.numeroPedido === numeroPedido);
      if (!pedido) {
        setError('Pedido não encontrado.');
        return;
      }

      const dadosFatura = {
        numeroPedido,
        condPagamento: pedido.condPagamento, // Adicione mais campos conforme necessário
        quantParcelas: pedido.quantParcelas,
        outrasInformacoes: pedido.outrasInformacoes,
        dataVencimento: pedido.dataVencimento,
        valorParcela: pedido.valorParcela,
        parcelaInfo: pedido.parcelaInfo
      };

      const response = await axios.post('http://localhost:4000/api/Faturar', dadosFatura);

      // Enviar o PDF por email
      const formData = new FormData();
      formData.append('numeroPedido', numeroPedido);
      formData.append('pdf', new Blob([pdfContent], { type: 'application/pdf' }), 'Fatura.pdf');

      const emailResponse = await axios.post('http://localhost:4000/api/enviar-fatura-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage('Fatura gerada com sucesso!');
      setPedidosAprovados(pedidosAprovados.filter(pedido => pedido.numeroPedido !== numeroPedido));
      console.log('Resposta do envio de e-mail:', emailResponse.data);
      return emailResponse.data.message; // Opcional: retornar uma mensagem de sucesso

    } catch (error) {
      console.error('Erro ao gerar fatura:', error);
      setError('Erro ao gerar fatura.');
    }
  };



  const handleGenerateNFe = async (numeroPedido) => {
    try {
      const response = await axios.post('http://localhost:4000/api/Gerar-NFe', { numeroPedido });
      setSuccessMessage('NF-e gerada com sucesso!');
      setPedidosAprovados(pedidosAprovados.filter(pedido => pedido.numeroPedido !== numeroPedido));
    } catch (error) {
      console.error('Erro ao gerar NF-e:', error);
      setError('Erro ao gerar NF-e.');
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

  const gerarPDF = async (numeroPedido, condPagamento, quantParcelas, valorParcela, parcelaInfo) => {
    try {
      const timestamp = new Date().getTime();
      const response = await axios.get(`http://localhost:4000/api/gerar-pdf/${numeroPedido}`, {
        responseType: 'arraybuffer'
      });

      if (response.status !== 200) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cadastro_grupo_${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.open(url);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
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
            segundoNivel={"Faturar Pedidos"}
          />
          <section>
            <div className="card mb-4">
              <div className="card-header"><h4 className="card-heading">Pesquisa de Pedidos Aprovados</h4></div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3">
                    <form className="ms-auto me-4 d-none d-lg-block" id="searchForm">
                      <div className="input-group input-group-sm">
                        <input className="form-control" id="searchInput" type="text"
                          value={search}
                          onChange={handleSearch}
                          placeholder="Pesquisar Pedido..." />
                        <button className="btn btn-search-sl-pd" type="button" onClick={handleGenerateInvoice}>
                          <Image src="/icons/search.svg" width={20} height={20} alt="Pesquisar" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
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
              </div>
            </div>
          </section>
          <section>
            <div className="card card-table mb-4">
              <div className="card-header">
                <div className="card-heading">Tabela de Pedidos</div>
              </div>
              <div className="dataTable-wrapper dataTable-loading no-footer sortable fixed-columns">
                <div className="dataTable-container border-0">
                  <table className="table table-hover mb-0 dataTable-table table-striped">
                    <thead>
                      <tr>
                        <th style={{ width: "3%", textAlign: "center" }}>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "left" }}>
                          <a href="#" className="dataTable-sorter">Núm. Pedido</a>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Cód. Cliente</a>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Cliente</a>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Itens</a>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Valor Total</a>
                        </th>
                        <th data-sortable="" style={{ width: "12%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Data</a>
                        </th>
                        <th data-sortable="" style={{ width: "10%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Status</a>
                        </th>
                        <th data-sortable="" style={{ width: "20%", textAlign: "center" }}>
                          <a href="#" className="dataTable-sorter">Ações</a>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPedidos.map(pedido => (
                        <React.Fragment key={pedido.numeroPedido}>
                          <tr>
                            <td style={{ textAlign: "right" }}><button className="btn-detalhes m-1" onClick={() => toggleDetalhesPedido(pedido.numeroPedido)}>
                              {expandedPedidoId === pedido.numeroPedido ? '-' : '+'}
                            </button></td>
                            <td style={{ textAlign: "left" }}>{pedido.numeroPedido}</td>
                            <td style={{ textAlign: "center" }}>{pedido.codCliente}</td>
                            <td>{pedido.nomeCompleto}</td>
                            <td style={{ textAlign: "center" }}>{pedido.quantidadeItens}</td>
                            <td style={{ textAlign: "center" }}>R${pedido.valorTotal}</td>
                            <td style={{ textAlign: "center" }}>{new Date(pedido.dataVenda).toLocaleDateString()}</td>
                            <td style={{ textAlign: "center" }}>{pedido.statusPedidoVenda}</td>
                            <td style={{ textAlign: "center" }}>

                              <MyButton className="btn-gerarDocumento" onClick={() => openModal(pedido)} disabled={pedido.statusPedidoVenda !== 'Aprovado'} name='Gerar Fatura' />
                              <MyButton className="btn-gerarNFE" onClick={() => handleGenerateNFe(pedido.numeroPedido)} disabled={pedido.statusPedidoVenda !== 'Aprovado'} name='Gerar NF-e' />

                            </td>
                          </tr>
                          {expandedPedidoId === pedido.numeroPedido && (
                            <tr>
                              <td colSpan="12">
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                  {pedido.itens.map((item, index) => (
                                    <div key={item.id} style={{ flexBasis: '30%', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: index % 3 === 2 ? '0' : '10px' }}>
                                      <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '5px' }}>Cód Produto: {item.codProduto}</p>
                                      <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '5px' }}>Descrição: {item.nomeResumido}</p>
                                      <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '5px' }}>Unidade Medida: {item.unidMedida}</p>
                                      <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '5px' }}>Quantidade: {item.quantidade}</p>
                                      <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '5px' }}>Valor Unitário: R$ {item.precoUnitario}</p>
                                      <p style={{ paddingBottom: '5px', marginBottom: '5px' }}>Subtotal: R${item.subTotal}</p>
                                    </div>
                                  ))}
                                  <button onClick={() => gerarPDF(pedido.numeroPedido)}>Gerar PDF</button>
                                </div>
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
                {showModal && (
                  <FaturaModal
                    showModal={showModal}
                    closeModal={closeModal}
                    pedido={pedidoSelecionado}
                    handleFormSubmit={handleFormSubmit}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default FaturarPedido;
