import React, { useState } from "react";
import "./FormPersonalData.css";

function FormPersonalData() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [estado, setEstado] = useState("");
  const [errores, setErrores] = useState([]);

  const estadosMexico = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
    "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima",
    "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México",
    "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
    "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
    "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
  ];

  const validateForm = () => {
    const erroresTemp = [];

    if (!correo) erroresTemp.push("El correo es obligatorio.");
    if (!password) erroresTemp.push("La contraseña es obligatoria.");
    if (!confirmPassword) erroresTemp.push("Debes confirmar la contraseña.");
    if (!estado) erroresTemp.push("Debes seleccionar un estado.");

    // Validación de contraseña segura
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;
    if (password && !regex.test(password)) {
      erroresTemp.push(
        "La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y un símbolo."
      );
    }

    // Contraseñas iguales
    if (password && confirmPassword && password !== confirmPassword) {
      erroresTemp.push("Las contraseñas no coinciden.");
    }

    setErrores(erroresTemp);

    return erroresTemp.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert(`Registro exitoso!\nCorreo: ${correo}\nEstado: ${estado}`);
    }
  };

  // Validaciones visuales de la contraseña
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?#&]/.test(password),
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Regístrate</legend>

        <label>Correo</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="password-requirements">
          <p className={validations.length ? "valid" : ""}>Mínimo 8 caracteres</p>
          <p className={validations.upper ? "valid" : ""}>Al menos una mayúscula</p>
          <p className={validations.lower ? "valid" : ""}>Al menos una minúscula</p>
          <p className={validations.number ? "valid" : ""}>Al menos un número</p>
          <p className={validations.symbol ? "valid" : ""}>Al menos un símbolo (@$!%*?#&)</p>
        </div>

        <label>Confirma tu contraseña</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label>Selecciona tu estado de nacimiento</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">-- Selecciona un estado --</option>
          {estadosMexico.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        {errores.map((err, index) => (
          <div key={index} className="error-message">{err}</div>
        ))}

        <button type="submit">Registrar</button>
      </fieldset>
    </form>
  );
}

export default FormPersonalData;
