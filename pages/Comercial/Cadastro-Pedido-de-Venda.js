import Breadcump from '@/components/Breadcump';
import { MyButton } from '@/components/MyButton';
import SelectInput from '@/components/Select-Input';
import InputWithLabel from '@/components/Input';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import ClienteModal from './ClienteModal';
// import ProdutoModal from './ProdutoModal';
import { NavTelasOperacionais } from '@/components/Navegacao-Operacao';
import MoneyInput from '@/components/Input-Monetario';

function CadastrarPedidoVenda() {

  const [codProduto, setCodProduto] = useState('');
  const [nomeItem, setNomeItem] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState('');

  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [subTotal, setSubTotal] = useState('');

  const [itens, setItens] = useState([]);

  const [Clientes, setClientes] = useState([]);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [Produtos, setProdutos] = useState([]);
  const [showModalProduto, setShowModalProduto] = useState(false);

  const [dataVenda, setDataVenda] = useState('');

  const [pedidoData, setPedidoData] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [quantTotalItem, setQuantTotalItem] = useState(0);
  const [totalPedido, setTotalPedido] = useState(0);
  const [numeroPedido, setnumeroPedido] = useState('');
  const [percDesconto, setPercDesconto] = useState(0);
  const [valorDescontado, setValorDescontado] = useState(0);
  const [acrescimoMoeda, setAcrescimoMoeda] = useState(0);
  const [totalFinalPedido, setTotalFinalPedido] = useState(0);

  const [formData, setFormData] = useState({
    codCliente: '',
    nomeCliente: '',
    statusPedidoVenda: 'Aguardando Aprovação',
    tipoEnd: '',
    enderecoCliente: '',
    nrEnd: '',
    complementoEnd: '',
    cidade: '',
    nrCep: '',
    tipoUF: '',
    telefone: '',
    celular: '',
    temWhatsApp: '',
    email: '',
    codVendedor: '',
    nomeVendedor: '',
    prazoCondVenda: '',
    observacaoCondVenda: '',
    codProduto: '',
    nomeResumido: '',
    unidMedida: '',
    quantidade: '',
    precoUnitario: '',
    subTotal: '',
    numeroPedido: '',
    quantTotalItem: '',
    totalPedido: '',
    percDesconto: '',
    valorDescontado: '',
    acrescimoMoeda: '',
    totalFinalPedido: '',
  });

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDataVenda(currentDate);
  }, []);

  useEffect(() => {
    const calcularSubtotal = () => {
      if (quantidade && precoUnitario) {
        const subtotalCalculado = (parseFloat(quantidade) * parseFloat(precoUnitario)).toFixed(2);
        setSubTotal(subtotalCalculado);
      } else {
        setSubTotal('');
      }
    };

    calcularSubtotal();
  }, [quantidade, precoUnitario]);

  const handlePesquisarCliente = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/todos-os-clientes');
      const Clientes = response.data;
      setClientes(Clientes);
      setShowModalCliente(true);
    } catch (error) {
      console.error('Erro ao buscar todos os Clientes:', error);
    }
  };

  const handlePesquisarProduto = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/todos-os-produtos');
      const Produtos = response.data;
      setProdutos(Produtos);
      setShowModalProduto(true);
    } catch (error) {
      console.error('Erro ao buscar todos os Produtos:', error);
    }
  };

  const handleCodigoProdutoChange = (codProduto, nomeResumido, unidMedida, saldoEstoque, precoUnitario) => {
    setFormData({
      ...formData,
      codProduto: codProduto,
      nomeResumido: nomeResumido,
      unidMedida: unidMedida,
      precoUnitario: precoUnitario,

    });
    setSaldoEstoque(saldoEstoque);
    setShowModalProduto(false);
  };


  const handleCodigoClienteChange = (codCliente, nomeCompleto, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email) => {

    setFormData({
      ...formData,
      codCliente: codCliente,
      nomeCompleto: nomeCompleto,
      tipoEnd: tipoEnd,
      endereco: endereco,
      nrEnd: nrEnd,
      complementoEnd: complementoEnd,
      cidade: cidade,
      nrCep: nrCep,
      tipoUF: tipoUF,
      telefone: telefone,
      celular: celular,
      temWhatsApp: temWhatsApp,
      email: email,


    });
    setShowModalCliente(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const router = useRouter();
  const handleCancelar = () => {
    setShowConfirmation(false)
  };

  const handleCancelarTela = () => {
    router.back()
  };

  const validateFields = () => {
    const requiredFields = ['codCliente', 'statusPedidoVenda', /* adicione outros campos necessários */];
    for (const field of requiredFields) {
      if (!formData[field]) {
        console.error(`Campo obrigatório não preenchido: ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data de venda:", dataVenda); // Verifica se a data de venda está correta
    console.log("Status do pedido:", formData.statusPedidoVenda);

    if (e.nativeEvent.submitter.textContent === 'Gerar Pedido') {
      if (validateFields()) {
        const dadosPedido = {
          numeroPedido,
          dataVenda,
          codCliente: formData.codCliente,
          statusPedidoVenda: formData.statusPedidoVenda,
          observacaoCondVenda: formData.observacaoCondVenda,
          prazoCondVenda: formData.prazoCondVenda,
          codVendedor: formData.codVendedor,
          nomeVendedor: formData.nomeVendedor,
          itens,
        };
        setPedidoData(dadosPedido);
        setShowConfirmation(true);
      } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
      }
    }
  };




  const handleGerarPedido = async () => {


    console.log("Função handleGerarPedido chamada!");
    console.log("Dados do pedido a serem enviados:", pedidoData);


    // Exibe os dados do pedido antes de serem enviados para o backend
    try {
      // Envie os dados do pedido para o backend
      const response = await axios.post('http://localhost:4000/api/Cadastrar-Pedido-De-Venda', pedidoData);

      if (response.status === 200) {

        // Pedido criado com sucesso
        alert('Pedido criado com sucesso!');
        // Fechar a tela de confirmação após o sucesso

        await registrarSaidaProduto();

        setShowConfirmation(false);

        router.back()

      } else {
        // Handle errors
        console.error('Erro ao criar pedido:', response.statusText);
        alert('Erro ao criar pedido: ' + response.statusText);
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao criar pedido: ' + error.message);
    }
  };

  const registrarSaidaProduto = async () => {
    try {
      // Iterar sobre os itens do pedido de venda e registrar a saída de cada produto
      for (const item of pedidoData.itens) {
        const { codProduto, nomeResumido, quantidade, tipo, precoUnitario, codCliente, nomeCliente, numeroPedido } = item;

        // Aqui você precisa chamar sua função de registro de saída de produtos
        // Certifique-se de passar os dados necessários, como codProduto, quantidade, etc.
        const response = await axios.post('http://localhost:4000/api/Registrar-Saida-Produto', {
          codProduto,
          nomeResumido,
          quantidade,
          tipo,
          precoUnitario,
          codCliente,
          nomeCliente,
          numeroPedido,

        });
        console.log('Dados enviados para o backend:', {
          codProduto,
          nomeResumido,
          quantidade,
          precoUnitario,
          codCliente,
          nomeCliente,
          numeroPedido,
        });

        if (response.status === 200) {
          console.log(`Saída de produto ${codProduto} registrada com sucesso.`);
        } else {
          console.error(`Erro ao registrar saída do produto ${codProduto}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Erro ao registrar saída de produtos:', error);
      // Você pode tratar erros aqui, se necessário
    }
  };



  const adicionarItem = () => {
    const novoItem = {
      codProduto: formData.codProduto,
      nomeResumido: formData.nomeResumido,
      unidMedida: formData.unidMedida,
      quantidade,
      precoUnitario,
      subTotal,
    };
    setItens([...itens, novoItem]);
    // Limpe os campos relacionados aos itens após adicionar
    setFormData({
      ...formData,
      codProduto: '',
      nomeResumido: '',
      unidMedida: '',
    });
    setQuantidade('');
    setPrecoUnitario('');
    setSubTotal('');
  };

  const removerItem = (index) => {
    const novaLista = itens.filter((item, i) => i !== index);
    setItens(novaLista);
  };





  const optionsPrazoPagamento = [
    { value: 'À Vista', label: 'À Vista' },
    { value: '7 dias', label: '7 dias' },
    { value: '15 dias', label: '15 dias' },
    { value: '30 dias', label: '30 dias' },
    { value: '60 dias', label: '60 dias' },
    { value: '90 dias', label: '90 dias' },
    { value: '120 dias', label: '120 dias' },
    { value: '180 dias', label: '180 dias' },
    { value: 'Condições Especiais', label: 'Condições Especiais' },
    { value: 'Outro', label: 'Outro' }
  ];


  useEffect(() => {
    // Gerar número de pedido de 6 dígitos apenas uma vez
    const newnumeroPedido = Math.floor(100000 + Math.random() * 900000);
    setnumeroPedido(newnumeroPedido.toString());
  }, []);

  useEffect(() => {
    // Calcular quantidade total de itens
    let total = 0;
    itens.forEach((item) => {
      total += parseInt(item.quantidade);
    });
    setQuantTotalItem(total);
  }, [itens]);

  useEffect(() => {
    // Calcular total do pedido
    let total = 0;
    itens.forEach((item) => {
      total += parseFloat(item.subTotal);
    });
    setTotalPedido(total.toFixed(2));
  }, [itens]);

  useEffect(() => {
    // Calcular valor final do pedido
    let valorFinal = parseFloat(totalPedido);

    // Aplicar desconto
    const desconto = (valorFinal * parseFloat(percDesconto)) / 100;
    setValorDescontado(desconto.toFixed(2));
    valorFinal -= desconto;

    // Adicionar acréscimo
    valorFinal += parseFloat(acrescimoMoeda);

    setTotalFinalPedido(valorFinal.toFixed(2));
  }, [totalPedido, percDesconto, acrescimoMoeda]);

  const [saldoEstoque, setSaldoEstoque] = useState(0); // Adicione um estado para saldo de estoque

  const handleChangeQuantidade = (e) => {
    const value = parseFloat(e.target.value);
    console.log('Quantidade inserida:', value);
    console.log('Saldo de estoque disponível:', saldoEstoque); // Verificar saldo atual

    if (isNaN(value) || value < 0) {
      alert('A quantidade não pode ser menor que 0.');
      return;
    }

    if (value > saldoEstoque) {
      alert(`Não foi possível realizar a venda, pois só temos ${saldoEstoque} quantidade em estoque. Favor rever a quantidade da venda.`);
      return;
    }

    setQuantidade(value);
  };

  return (
    <>
      {showModalCliente && <ClienteModal Clientes={Clientes} onClose={() => setShowModalCliente(false)} onSelect={handleCodigoClienteChange} />}
      {showModalProduto && <ProdutoModal Produtos={Produtos} onClose={() => setShowModalProduto(false)} onSelect={handleCodigoProdutoChange} />}
      <NavTelasOperacionais
        nome_Sistema={"Spurgeon"}
      />
      <div className='page-holder fundo-formulario-sl'>
        <div class="container-fluid px-lg-4 ">
          <Breadcump
            link={"/Comercial/Gestao-Comercial"}
            primeiroNivel={"Gestão de Vendas"}
            segundoNivel={"Gerar Pedido de Venda"}
          />
          <div class="page-header">
            <h4 class="page-heading">Gerar Pedido de Venda</h4>
          </div>
          <section>
            <form onSubmit={handleSubmit}>
              <div class="card mb-4">
                <div class="card-header"><h4 class="card-heading">Gerar Pedido de Venda</h4></div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-2" style={{ position: "relative" }}>

                      <InputWithLabel
                        id={"codCliente"}
                        label={"Cód. Cliente"}
                        tipoInput={"text"}
                        value={formData.codCliente}
                        handleChange={handleChange}

                      />
                      <button class="btn btn-search-sl" type="button">
                        <Image src="/icons/search.svg" width={20} height={20} alt="Logo da Empresa" onClick={handlePesquisarCliente} />
                      </button>
                    </div>
                    <div class="col-lg-6">
                      <InputWithLabel
                        id={"nomeCliente"}
                        label={"Nome do Cliente"}
                        tipoInput={"text"}
                        value={formData.nomeCompleto}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"dataVenda"}
                        label={"Data da Venda"}
                        tipoInput={"date"}
                        value={dataVenda}
                        handleChange={(e) => setDataVenda(e.target.value)}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"statusPedidoVenda"}
                        label={"Status do Pedido"}
                        tipoInput={"text"}
                        handleChange={(e) => setDataVenda(e.target.value)}
                        required
                        disabled
                      />
                      <input type="hidden" id="statusPedidoVenda" name="statusPedidoVenda" value={formData.statusPedidoVenda} />

                    </div>
                  </div>
                </div>
                <div class="card-header"><h4 class="card-heading">Endereço do Cliente</h4></div>
                <div class="card-body">
                  <div className='row'>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"tipoEnd"}
                        label={"Tipo Endereço"}
                        tipoInput={"text"}
                        value={formData.tipoEnd}
                        handleChange={handleChange}
                        required
                        disabled />
                    </div>
                    <div class="col-lg-9">
                      <InputWithLabel
                        id={"enderecoCliente"}
                        label={"Endereço"}
                        tipoInput={"text"}
                        value={formData.endereco}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"nrEnd"}
                        label={"Nr."}
                        tipoInput={"text"}
                        value={formData.nrEnd}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-3">
                      <InputWithLabel
                        id={"complementoEnd"}
                        label={"Complemento"}
                        tipoInput={"text"}
                        value={formData.complementoEnd}
                        handleChange={handleChange}
                        required
                        disabled

                      />
                    </div>
                    <div class="col-lg-6">
                      <InputWithLabel
                        id={"cidade"}
                        label={"Cidade"}
                        tipoInput={"text"}
                        value={formData.cidade}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"nrCep"}
                        label={"CEP"}
                        tipoInput={"text"}
                        value={formData.nrCep}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"tipoUF"}
                        label={"Estado"}
                        tipoInput={"text"}
                        value={formData.tipoUF}
                        handleChange={handleChange}
                        required
                        disabled />
                    </div>
                  </div>
                </div>
                <div class="card-header"><h4 class="card-heading">Informações de Contato</h4></div>
                <div class="card-body">
                  <div className='row'>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"telefone"}
                        label={"Telefone"}
                        tipoInput={"text"}
                        value={formData.telefone}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"celular"}
                        label={"Celular"}
                        tipoInput={"text"}
                        value={formData.celular}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"temWhatsApp"}
                        label={"WhatsApp?"}
                        tipoInput={"text"}
                        value={formData.temWhatsApp}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div class="col-lg-7">
                      <InputWithLabel
                        id={"email"}
                        label={"Email"}
                        tipoInput={"text"}
                        value={formData.email}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>

                </div>
                <div class="card-header"><h4 class="card-heading">Informações do Pedido de Venda</h4></div>
                <div class="card-body">
                  <div className='row'>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"codVendedor"}
                        label={"Cód. Vendedor"}
                        value={formData.codVendedor}
                        handleChange={handleChange}
                        tipoInput={"text"}
                      />
                    </div>
                    <div class="col-lg-4">
                      <InputWithLabel
                        id={"nomeVendedor"}
                        label={"Nome do Vendedor/Representante"}
                        value={formData.nomeVendedor}
                        handleChange={handleChange}
                        tipoInput={"text"}
                      />
                    </div>
                    <div class="col-lg-2">
                      <SelectInput id="prazoCondVenda" defaultValue="Não Informado" options={optionsPrazoPagamento} label={"Prazos Cond. Venda"}
                        value={formData.prazoCondVenda} handleChange={handleChange}
                      />
                    </div>
                    <div class="col-lg-4">
                      <InputWithLabel
                        id={"observacaoCondVenda"}
                        label={"Observação Cond. Venda"}
                        value={formData.observacaoCondVenda}
                        handleChange={handleChange}
                        tipoInput={"text"}
                      />
                    </div>
                  </div>
                </div>
                <div class="card-header"><h4 class="card-heading">Detalhes do Item do Pedido de Venda </h4></div>
                <div class="card-body">
                  <div className='row'>
                    <div class="col-lg-2" style={{ position: "relative" }}>
                      <InputWithLabel
                        id={"codProduto"}
                        label={"Cód. Item"}
                        tipoInput={"text"}
                        value={formData.codProduto}
                        handleChange={handleChange}
                        required
                        disabled
                      />
                      <button class="btn btn-search-sl" type="button">
                        <Image src="/icons/search.svg" width={20} height={20} alt="Logo da Empresa" onClick={handlePesquisarProduto} />
                      </button>
                    </div>
                    <div class="col-lg-4">
                      <InputWithLabel
                        id={"nomeResumido"}
                        label={"Descrição do Item"}
                        tipoInput={"text"}
                        value={formData.nomeResumido}
                        handleChange={handleChange}
                        required
                        disabled

                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"unidMedida"}
                        label={"Unid. Medida"}
                        tipoInput={"text"}
                        value={formData.unidMedida}
                        handleChange={handleChange}
                        required
                        disabled

                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"quantidade"}
                        label={"Quant."}
                        tipoInput={"text"}
                        value={quantidade}
                        handleChange={handleChangeQuantidade}
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"precoUnitario"}
                        label={"Preço Unit."}
                        tipoInput={"text"}
                        value={precoUnitario}
                        handleChange={(e) => setPrecoUnitario(e.target.value)}
                      />
                    </div>
                    <div class="col-lg-2">
                      <MoneyInput
                        id={"subTotal"}
                        label={"Sub Total (R$)"}
                        tipoInput={"text"}
                        value={subTotal}
                        readOnly
                        disabled
                      />

                    </div>
                    <div class="col-lg-1 mt-4">
                      <MyButton name="+" className="btn-adicionar" onClick={adicionarItem} />
                    </div>
                  </div>
                  {itens.map((item, index) => (
                    <div className='row item-container' key={index}>
                      <div className="col-lg-2">{item.codProduto}</div>
                      <div className="col-lg-4">{item.nomeResumido}</div>
                      <div className="col-lg-1">{item.unidMedida}</div>
                      <div className="col-lg-1">{item.quantidade}</div>
                      <div className="col-lg-1">{item.precoUnitario}</div>
                      <div className="col-lg-2">{item.subTotal}</div>
                      <div className="col-lg-1">
                        <MyButton name="-" className="btn-remover" onClick={() => removerItem(index)} />
                      </div>
                    </div>
                  ))}
                  <div className='row'>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"numeroPedido"}
                        label={"Nr. Do Pedido"}
                        tipoInput={"text"}
                        value={numeroPedido}
                        disabled
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"quantTotalItem"}
                        label={"Quant. Itens "}
                        tipoInput={"text"}
                        value={quantTotalItem}
                        disabled
                      />
                    </div>
                    <div class="col-lg-3">
                      <MoneyInput
                        id={"totalPedido"}
                        label={"Total do Pedido (R$)"}
                        tipoInput={"text"}
                        value={totalPedido}
                        disabled
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"percDesconto"}
                        label={"Desconto (%)"}
                        tipoInput={"text"}
                        value={percDesconto}
                        handleChange={(e) => setPercDesconto(e.target.value)}
                      />
                    </div>
                    <div class="col-lg-1">
                      <MoneyInput
                        id={"valorDescontado"}
                        label={"Valor Desc."}
                        tipoInput={"text"}
                        value={valorDescontado}
                        disabled
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"acrescimoMoeda"}
                        label={"Acréscimo (R$)"}
                        tipoInput={"text"}
                        value={acrescimoMoeda}
                        handleChange={(e) => setAcrescimoMoeda(e.target.value)}
                      />
                    </div>
                    <div class="col-lg-3">
                      <MoneyInput
                        id={"totalFinalPedido"}
                        label={"Total Final do Pedido (R$)"}
                        tipoInput={"text"}
                        value={totalFinalPedido}
                        disabled
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3 ms-auto">
                      <MyButton name="Gerar Pedido" className='btn-sl m-1' />
                      <MyButton name="Cancelar" className='btn-sl-encerrar m-4' onClick={handleCancelarTela} />
                    </div>
                    {
                      showConfirmation && ( // Condição para renderizar a tela de confirmação
                        <div className="confirmation-overlay">
                          <div className="confirmation-box">
                            Você deseja confirmar a geração do pedido?
                            <button className="btn-sl-encerrar" onClick={handleCancelar}>Cancelar</button>
                            <button className="btn-sl" onClick={handleGerarPedido}>Gerar Pedido</button>
                          </div>
                        </div>
                      )
                    }
                    <style jsx>{`
        .confirmation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .confirmation-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .btn {
          margin: 0 10px;
        }
      `}</style>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>)

}
export default CadastrarPedidoVenda;