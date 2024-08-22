import React, { useState, useEffect } from 'react';

const MoneyInput = ({ id, tipoInput, label, value, onChange, readOnly, disabled }) => {
  // Estado local para armazenar o valor digitado pelo usuário
  const [inputValue, setInputValue] = useState('');

  // Função para formatar o valor no formato de moeda brasileiro
  const formatarParaReal = (valor) => {
    if (!isNaN(valor)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(parseFloat(valor));
    }
    return 'R$ 0,00'; // Retorna R$ 0,00 se o valor não for um número
  };

  // Função para limpar o valor quando o input é clicado
  const handleInputClick = () => {
    setInputValue('');
    onChange(0);
  };

  useEffect(() => {
    setInputValue(formatarParaReal(value));
  }, [value]);

  // Função para lidar com a mudança no valor do input
  const handleChange = (event) => {
    // Obtém o valor do input
    const novoValor = event.target.value;
    // Remove a formatação de moeda para obter apenas o número
    const numero = parseFloat(novoValor.replace(/[^\d]/g, '')) / 100;
    // Verifica se o valor é maior que zero
    if (numero >= 0) {
      // Atualiza o estado local com o valor digitado pelo usuário
      setInputValue(formatarParaReal(numero)); // Formata o valor para exibição
      // Chama a função onChange passando o valor não formatado
      onChange(numero || 0);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        id={id}
        type={tipoInput}
        value={inputValue}
        onChange={handleChange} // Lidar com a mudança no valor
        onClick={handleInputClick} // Limpar o valor ao clicar no input
        className='form-control'
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  );
};

export default MoneyInput;
