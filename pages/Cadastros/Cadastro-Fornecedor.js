import Breadcump from '@/components/Breadcump';
import { MyButton } from '@/components/MyButton';
import InputWithLabel from '@/components/Input';
import SelectInput from '@/components/Select-Input';
import { NavTelasOperacionais } from '@/components/Navegacao-Operacao';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

function CadastroFornecedor() {
  const [showConfirmation, setShowConfirmation] = useState(false);


  const inputDateRef = useRef(null);

  const abrirSeletorData = () => {
    // Verifica se inputDateRef e inputDateRef.current não são nulos
    if (inputDateRef && inputDateRef.current) {
      // Define o foco no input de data quando o botão é clicado
      inputDateRef.current.focus();
    }
  };
  useEffect(() => {
    if (inputDateRef.current) {
      inputDateRef.current.focus();
    }
  }, []);


  const [formData, setFormData] = useState({
    porte: '',
    atuacao: '',
    segmentoAtuacao: '',
    cnpj: '',
    codCliente: '',
    dtAbertura: '',
    razaoSocial: '',
    nomeFantasia: '',
    temIE: '',
    nrInscEstadual: '',
    temIM: '',
    nrInscMunicipal: '',
    cnae: '',
    descCnae: '',
    tipoEnd: '',
    endereco: '',
    nrEnd: '',
    complementoEnd: '',
    cidade: '',
    nrCep: '',
    tipoUF: '',
    telefone: '',
    celular: '',
    temWhatsApp: '',
    email: '',
  });


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (id === 'cnpj') {
      const cnpjPrefix = value.replace(/[^\d]/g, '').slice(0, 6); // Obtém os primeiros 6 dígitos do CPF
      setFormData({
        ...formData,
        [id]: value,
        codCliente: `CLI-${cnpjPrefix}`,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Exibe a mensagem de confirmação
  };

  const handleFinalizarCadastro = async () => {

    try {
      const response = await axios.post('http://localhost:4000/api/cadastro-fornecedor', formData);
      console.log(response.data);
      alert('Cadastro Realizado com sucesso!')
      setFormData({
        porte: '',
        atuacao: '',
        segmentoAtuacao: '',
        cnpj: '',
        codCliente: '',
        dtAbertura: '',
        razaoSocial: '',
        nomeFantasia: '',
        temIE: '',
        nrInscEstadual: '',
        temIM: '',
        nrInscMunicipal: '',
        cnae: '',
        descCnae: '',
        tipoEnd: '',
        endereco: '',
        nrEnd: '',
        complementoEnd: '',
        cidade: '',
        nrCep: '',
        tipoUF: '',
        telefone: '',
        celular: '',
        temWhatsApp: '',
        email: '',
        tipoPgto: '',
        tipoCondPgto: '',
        codBanco: '',
        nomeBanco: '',
        agenciaBancaria: '',
        agenciaDV: '',
        numeroConta: '',
        contaDV: '',
      });
      setShowConfirmation(false);
    } catch (error) {
      alert('Existem campos obrigatórios não preenchidos!')
      console.log('Erro ao enviar os dados: ', error);
    }
  };

  const router = useRouter();

  const handleCEPChange = async () => {
    try {
      const response = await axios.get(`http://viacep.com.br/ws/${formData.nrCep}/json/`);
      console.log('Response from ViaCEP:', response.data);
      const { logradouro, localidade, uf } = response.data;
      const ufAbreviation = ufMap[uf]; // Obtendo a abreviação do estado corretamente
      setFormData({
        ...formData,
        endereco: logradouro,
        cidade: localidade,
        tipoUF: ufAbreviation // Usando a abreviação do estado
      });
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
    }
  };

  const handleCancelar = () => {
    setShowConfirmation(false)
  };

  const handleCancelarTela = () => {
    router.back()
  };

  const optionsAtuacao = [
    { value: 'Comércio', label: 'Comércio' },
    { value: 'Indústria', label: 'Indústria' },
    { value: 'Serviço', label: 'Serviço' },

  ];
  const optionsPorte = [
    { value: 'Pequena', label: 'Pequena' },
    { value: 'Média', label: 'Média' },
    { value: 'Grande', label: 'Grande' },
    { value: 'MEI', label: 'Microempreendedor Individual (MEI)' }
  ];

  const optionsSegmento = [
    { value: 'Salão de Beleza', label: 'Salão de Beleza' },
    { value: 'Barbearia', label: 'Barbearia' },
    { value: 'Estúdio de Tatuagem', label: 'Estúdio de Tatuagem' },
    { value: 'Mercado', label: 'Mercado' },
    { value: 'Padaria', label: 'Padaria' },
    { value: 'Restaurante', label: 'Restaurante' },
    { value: 'Lanchonete', label: 'Lanchonete' },
    { value: 'Farmácia', label: 'Farmácia' },
    { value: 'Ótica', label: 'Ótica' },
    { value: 'Loja de Roupas', label: 'Loja de Roupas' },
    { value: 'Papelaria', label: 'Papelaria' },
    { value: 'Loja de Móveis', label: 'Loja de Móveis' },
    { value: 'Construtora', label: 'Construtora' },
    { value: 'Consultoria Financeira', label: 'Consultoria Financeira' },
    { value: 'Escritório de Advocacia', label: 'Escritório de Advocacia' },
    { value: 'Estúdio de Design', label: 'Estúdio de Design' },
    { value: 'Clínica Médica', label: 'Clínica Médica' },
    { value: 'Academia', label: 'Academia' },
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Outro', label: 'Outro' }
  ];

  const ufMap = {
    "AC": "AC",
    "AL": "AL",
    "AP": "AP",
    "AM": "AM",
    "BA": "BA",
    "CE": "CE",
    "DF": "DF",
    "ES": "ES",
    "GO": "GO",
    "MA": "MA",
    "MT": "MT",
    "MS": "MS",
    "MG": "MG",
    "PA": "PA",
    "PB": "PB",
    "PR": "PR",
    "PE": "PE",
    "PI": "PI",
    "RJ": "RJ",
    "RN": "RN",
    "RS": "RS",
    "RO": "RO",
    "RR": "RR",
    "SC": "SC",
    "SP": "SP",
    "SE": "SE",
    "TO": "TO"
  };

  const optionsEscolha = [
    { value: '1', label: 'Sim' },
    { value: '2', label: 'Não' },
  ];

  const limparFormulario = () => {
    setFormData({
      cpfCliente: '',
      codCliente: '',
      dtNascimento: '',
      opcaoSexo: '',
      opcaoEtnias: '',
      nomeCompleto: '',
      nomeSocial: '',
      tipoEnd: '',
      endereco: '',
      nrEnd: '',
      complementoEnd: '',
      cidade: '',
      nrCep: '',
      tipoUF: '',
      telefone: '',
      celular: '',
      temWhatsApp: '',
      email: '',
    }); setShowConfirmation(false)
  };


  return (
    <>
      <NavTelasOperacionais
        nome_Sistema={"Spurgeon"}
      />
      <div className='page-holder fundo-formulario-sl'>

        <div class="container-fluid px-lg-4 ">
          <Breadcump
            link={"/Cadastros/Gestao-Cadastral"}
            primeiroNivel={"Gestão de Terceirizados"}
            segundoNivel={"Fornecedores"}
          />
          <div class="page-header">
            <h4 class="page-heading">Cadastro de Fornecedores - Fornecedor </h4>
          </div>
          <section>
            <form onSubmit={handleSubmit}>
              <div class="card mb-4">
                <div class="card-header"><h4 class="card-heading">Dados Empresariais</h4></div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-2">
                      <SelectInput id="porte" defaultValue="Não Informado" options={optionsPorte} label={"Porte"} value={formData.porte} handleChange={handleChange} />
                    </div>
                    <div class="col-lg-2">
                      <SelectInput id="atuacao" defaultValue="Não Informado" options={optionsAtuacao} label={"Ramo Empresarial"} value={formData.atuacao} handleChange={handleChange} />
                    </div>
                    <div class="col-lg-2">
                      <SelectInput id="segmentoAtuacao" defaultValue="Não Informado" options={optionsSegmento} label={"Atuação"} value={formData.segmentoAtuacao} handleChange={handleChange} />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"cnpj"}
                        mask="99.999.999/9999-99"
                        label={"CNPJ"}
                        tipoInput={"text"}
                        value={formData.cnpj} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"codCliente"}
                        label={"Cód. Cliente"}
                        tipoInput={"text"}
                        value={formData.codCliente}
                        handleChange={() => { }}
                        readOnly
                        required
                      />
                    </div>
                    <div class="col-lg-2">
                      <div style={{ position: "relative" }}>
                        <InputWithLabel
                          id={"dtAbertura"}
                          label={"Data de Abertura"}
                          tipoInput={"date"}
                          useRef={inputDateRef}
                          value={formData.dtAbertura} handleChange={handleChange}
                          required
                        />
                        <button class="btn btn-calendar-sl" type="button" onClick={abrirSeletorData}>
                          <Image src="/icons/calendar2-week-fill.svg" width={20} height={20} alt="Calendário" />
                        </button>
                      </div></div>
                  </div>
                  <div className='row'>
                    <div class="col-lg-6">
                      <InputWithLabel
                        id={"razaoSocial"}
                        label={"Razão Social"}
                        tipoInput={"text"}
                        value={formData.razaoSocial} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-6">
                      <InputWithLabel
                        id={"nomeFantasia"}
                        label={"Nome Fantasia"}
                        tipoInput={"text"}
                        value={formData.nomeFantasia} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-1">
                      <SelectInput id="temIE" defaultValue="Não Informado" options={optionsEscolha} label={"Tem IE?"} value={formData.temIE} handleChange={handleChange} />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"nrInscEstadual"}
                        label={"Número Insc. Estadual"}
                        tipoInput={"text"}
                        value={formData.nrInscEstadual} handleChange={handleChange}
                      />
                    </div>
                    <div class="col-lg-1">
                      <SelectInput id="temIM" defaultValue="Não Informado" options={optionsEscolha} label={"Tem IM?"} value={formData.temIM} handleChange={handleChange} />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"nrInscMunicipal"}
                        label={"Número Insc. Municipal"}
                        tipoInput={"text"}
                        value={formData.nrInscMunicipal} handleChange={handleChange}
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"cnae"}
                        label={"CNAE"}
                        tipoInput={"text"}
                        value={formData.cnae} handleChange={handleChange}
                      />
                    </div>
                    <div class="col-lg-5">
                      <InputWithLabel
                        id={"descCnae"}
                        label={"Descrição do CNAE"}
                        tipoInput={"text"}
                        value={formData.descCnae} handleChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div class="card-header"><h4 class="card-heading">Endereço Comercial</h4></div>
                <div class="card-body">
                  <div className='row'>
                    <div class="col-lg-7">
                      <InputWithLabel
                        id={"endereco"}
                        label={"Endereço"}
                        tipoInput={"text"}
                        value={formData.endereco} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"nrEnd"}
                        label={"Nr."}
                        tipoInput={"text"}
                        value={formData.nrEnd} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-4">
                      <InputWithLabel id="tipoEnd" defaultValue="Não Informado" label={"Bairro"} value={formData.tipoEnd} handleChange={handleChange} required />
                    </div>
                    <div class="col-lg-3">
                      <InputWithLabel
                        id={"complementoEnd"}
                        label={"Complemento"}
                        tipoInput={"text"}
                        value={formData.complementoEnd} handleChange={handleChange}
                      />
                    </div>
                    <div class="col-lg-6">
                      <InputWithLabel
                        id={"cidade"}
                        label={"Cidade"}
                        tipoInput={"text"}
                        value={formData.cidade} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-2" style={{ position: "relative" }}>
                      <InputWithLabel
                        id={"nrCep"}
                        mask="99999-999"
                        label={"CEP"}
                        tipoInput={"search"}
                        value={formData.nrCep} handleChange={handleChange}
                        required
                      />
                      <button class="btn btn-search-sl" type="button">
                        <Image src="/icons/search.svg" width={20} height={20} alt="Logo da Empresa" onClick={handleCEPChange} />
                      </button>
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id={"tipoUF"}
                        label={"UF"}
                        tipoInput={"text"}
                        value={formData.tipoUF} handleChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="card-header"><h4 class="card-heading">Informações de Contato</h4></div>
                <div class="card-body">
                  <div className='row'>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"telefone"}
                        mask="(99)9999-9999"
                        label={"Telefone"}
                        tipoInput={"text"}
                        value={formData.telefone} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"celular"}
                        mask="(99)9.9999-9999"
                        label={"Celular"}
                        tipoInput={"text"}
                        value={formData.celular} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-1">
                      <SelectInput id="temWhatsApp" defaultValue="Não Informado" options={optionsEscolha} label={"WhatsApp?"} value={formData.temWhatsApp} handleChange={handleChange} required />
                    </div>
                    <div class="col-lg-7">
                      <InputWithLabel
                        id={"email"}
                        label={"Email"}
                        tipoInput={"text"}
                        value={formData.email} handleChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div className="col-md-9"> {/* Utilize uma coluna de tamanho 9 para ocupar o espaço restante */}
                    <div className="ms-auto mb-4"> {/* Adicione a classe "ms-auto" para alinhar os elementos à direita */}
                      <MyButton name="Cancelar" onClick={handleCancelarTela} className='btn-sl-encerrar m-4' /> {/* Botão Cancelar */}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <MyButton name="Limpar" className='btn-sl m-1' onClick={limparFormulario} />
                    <MyButton name="Cadastrar" className='btn-sl m-1' onClick={() => setShowConfirmation(true)} /> {/* Botão Cadastrar com lógica de exibir confirmação */}
                    {
                      showConfirmation && ( // Exibe a confirmação apenas quando showConfirmation for verdadeiro
                        <div className="confirmation-overlay">
                          <div className="confirmation-box">
                            Você deseja confirmar o cadastro?
                            <button className="btn-sl-encerrar" onClick={handleCancelar}>Cancelar</button>
                            <button className="btn-sl" onClick={handleFinalizarCadastro}>Finalizar Cadastro</button>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div >

    </>)

}
export default CadastroFornecedor;