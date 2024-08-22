import Breadcump from '@/components/Breadcump';
import { MyButton } from '@/components/MyButton';
import InputWithLabel from '@/components/Input';
import SelectInput from '@/components/Select-Input';
import Image from 'next/image';
import { NavTelasOperacionais } from '@/components/Navegacao-Operacao';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CadastroPF() {


  const [formData, setFormData] = useState({

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
  });

  const router = useRouter();
  const { codCliente } = router.query;


  useEffect(() => {
    const fetchFormData = async () => {
      try {
        if (codCliente) {
          const response = await axios.get(`http://localhost:4000/api/getCliente/${codCliente}`);
          setFormData(response.data);
        }
      } catch (error) {
        console.error('Erro ao obter dados do cliente:', error);
      }
    };

    fetchFormData();
  }, [codCliente]);

  const [showConfirmation, setShowConfirmation] = useState(false);


  const [cpfExists, setCpfExists] = useState(false);

  const handleChange = async (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (id === 'cpfCliente') {
      const cpfPrefix = value.replace(/[^\d]/g, '').slice(0, 6); // Obtém os primeiros 6 dígitos do CPF
      setFormData({
        ...formData,
        [id]: value,
        codCliente: `CLI-${cpfPrefix}`,
      });
      // Verificar se o CPF já está cadastrado
      try {
        console.log('Solicitando verificação de CPF para:', value);
        const response = await axios.get(`http://localhost:4000/api/checkCPF/${value}`);
        if (response.status === 201) {
          console.log('CPF já cadastrado');
          setCpfExists(true);
          alert('CPF Já Cadastrado!!!');
        } else {
          console.log('CPF disponível');
          setCpfExists(false);
        }
      } catch (error) {
        console.error('Erro ao verificar CPF:', error);
      }
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
      const response = await axios.post('https://spurgeonrestaurante.sullivanlima.com.br/backend/api/create_cliente_PF.php', formData);
      console.log(response.data);
      alert('Cadastro Realizado com sucesso!')
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
      });
      setShowConfirmation(false);
    } catch (error) {
      alert('Existem campos obrigatórios não preenchidos!')
      console.log('Erro ao enviar os dados: ', error);
    }
  };

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

  const optionsUF = [
    { value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' }
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

  const optionsEscolhaSexo = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Não Binário', label: 'Não Binário' },
    { value: 'Transgênero', label: 'Transgênero' },
    { value: 'Agênero', label: 'Agênero' },
    { value: 'Bigênero', label: 'Bigênero' },
    { value: 'Gênero Fluído', label: 'Gênero Fluído' },
    { value: 'Outro', label: 'Outro' },
  ];

  const optionsEtnias = [
    { value: 'Branco', label: 'Branco' },
    { value: 'Negro', label: 'Negro' },
    { value: 'Indígena', label: 'Indígena' },
    { value: 'Pardo', label: 'Pardo' },
    { value: 'Amarelo', label: 'Amarelo' },
    { value: 'Outra', label: 'Outra' }
  ];

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

  return (<>

    <NavTelasOperacionais
      nome_Sistema={"Spurgeon"}
    />
    <div className='page-holder fundo-formulario-sl'>

      <div class="container-fluid px-lg-4 ">
        <Breadcump
          link={"/Cadastros/Gestao-Cadastral"}
          primeiroNivel={"Gestão Cadastral"}
          segundoNivel={"Cliente Pessoa Física"}
        />

        <div class="page-header">
          <h4 class="page-heading">Cadastro de Clientes - Pessoa Física</h4>
        </div>
        <section>
          {FormData && (
            <form onSubmit={handleSubmit}>
              <div class="card mb-4">
                <div class="card-header">
                  <h4 class="card-heading">Dados Pessoais</h4>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-3">
                      <InputWithLabel
                        label={"CPF"}
                        required
                        id="cpfCliente"
                        mask="999.999.999-99"
                        type="text"
                        value={formData.cpfCliente}
                        handleChange={handleChange}
                        className="form-control"
                        placeholder="Digite o CPF"
                      />
                      {cpfExists && <p>Cadastro com este CPF já existe!</p>}
                    </div>
                    <div class="col-lg-3">
                      <InputWithLabel
                        id={"codCliente"}
                        label={"Cód. Cliente"}
                        required
                        tipoInput={"text"}
                        value={formData.codCliente}
                        handleChange={() => { }}
                        readOnly
                        disabled
                      />
                    </div>
                    <div class="col-lg-2" >
                      <div style={{ position: "relative" }}>
                        <InputWithLabel
                          id={"dtNascimento"}
                          label={"Data de Nascimento"}
                          required
                          tipoInput={"date"}
                          value={formData.dtNascimento}
                          handleChange={handleChange}
                        />
                        <button class="btn btn-calendar-sl" type="button"  >
                          <Image src="/icons/calendar2-week-fill.svg" width={20} height={20} alt="Calendário" />
                        </button>
                      </div>
                    </div>

                    <div class="col-lg-2">
                      <SelectInput id="opcaoSexo" defaultValue="Não Informado" options={optionsEscolhaSexo} label={"Orient. Sexual"}
                        value={formData.opcaoSexo} handleChange={handleChange} />
                    </div>
                    <div class="col-lg-2">
                      <SelectInput id="opcaoEtnias" defaultValue="Não Informado" options={optionsEtnias} label={"Etnia"} value={formData.opcaoEtnias} handleChange={handleChange} />
                    </div>
                  </div>
                  <div className='row'>
                    <div class="col-lg-6">
                      <InputWithLabel
                        id={"nomeCompleto"}
                        label={"Nome Completo"}
                        tipoInput={"text"}
                        value={formData.nomeCompleto}
                        handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-6">
                      <InputWithLabel
                        id={"nomeSocial"}
                        label={"Nome Social"}
                        tipoInput={"text"}
                        value={formData.nomeSocial}
                        handleChange={handleChange}
                      />
                    </div>
                  </div></div>

                <div class="card-header">
                  <h4 class="card-heading">Endereço</h4>
                </div>
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
                      <InputWithLabel id="tipoEnd" defaultValue="Não Informado" tipoInput={"text"} label={"Bairro"} value={formData.tipoEnd} handleChange={handleChange} />
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
                        label={"CEP"}
                        tipoInput={"search"}
                        value={formData.nrCep}
                        handleChange={handleChange}
                        mask="99999-999"
                        required
                      />
                      <button class="btn btn-search-sl" type="button">
                        <Image src="/icons/search.svg" width={20} height={20} alt="Logo da Empresa" onClick={handleCEPChange} />
                      </button>
                    </div>
                    <div class="col-lg-1">
                      <InputWithLabel
                        id="tipoUF"
                        options={optionsUF}
                        label="UF"
                        value={formData.tipoUF}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div class="card-header">
                  <h4 class="card-heading">Contato</h4>
                </div>
                <div class="card-body">
                  <div className='row'>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"telefone"}
                        label={"Telefone"}
                        tipoInput={"text"}
                        mask="(99)9999-9999"
                        value={formData.telefone} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-2">
                      <InputWithLabel
                        id={"celular"}
                        label={"Celular"}
                        tipoInput={"text"}
                        mask="(99)9.9999-9999"
                        value={formData.celular} handleChange={handleChange}
                        required
                      />
                    </div>
                    <div class="col-lg-1">
                      <SelectInput id="temWhatsApp" defaultValue="Não Informado" options={optionsEscolha} label={"WhatsApp?"} value={formData.temWhatsApp} handleChange={handleChange} />
                    </div>
                    <div class="col-lg-7">
                      <InputWithLabel
                        id={"email"}
                        label={"Email"}
                        tipoInput={"text"}
                        value={formData.email} handleChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div className="col-9"> {/* Utilize uma coluna de tamanho 9 para ocupar o espaço restante */}
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
            </form>)}
        </section>
      </div>
    </div>
  </>)

}
export default CadastroPF;