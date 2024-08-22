import React from 'react';
import ReactInputMask from 'react-input-mask';

function InputWithLabel({ label, id, tipoInput, value, handleChange, required, mask, readOnly, disabled, className }) {

  const renderLabel = (label, required) => {
    return required ? (
      <label htmlFor={id} className="form-label">
        {label}<span style={{ color: 'red' }}>*</span>
      </label>
    ) : (
      <label htmlFor={id} className="form-label">{label}</label>
    );
  };

  const formatarParaReal = (valor) => {
    // Verificar se o tipo de entrada é monetário
    if (tipoInput === "monetario") {
      // Verificar se o valor é um número antes de aplicar a formatação
      if (!isNaN(valor)) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(parseFloat(valor));
      }
    }
    // Se não for um número ou não for monetário, retornar o valor original
    return valor;
  };

  const inputField = mask ? (
    <ReactInputMask
      id={id}
      mask={mask}
      type={tipoInput}
      value={value}
      onChange={handleChange}
      className={`form-control ${disabled ? 'disabled' : ''}`}
      placeholder={`${label}`}
      readOnly={readOnly}
      disabled={disabled}
    />
  ) : (
    <input
      id={id}
      type={tipoInput}
      value={value}
      onChange={handleChange}
      className={`form-control ${className} ${disabled ? 'disabled' : ''}`}
      placeholder={`${label}`}
      readOnly={readOnly}
      disabled={disabled}
    />
  );

  return (
    <div className="mb-3">
      {renderLabel(label, required)}
      {inputField}
    </div>
  );
}

export default InputWithLabel;
