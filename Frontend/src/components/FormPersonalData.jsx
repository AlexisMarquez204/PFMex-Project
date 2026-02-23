import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPersonalData.css";

function FormPersonalData() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [estado, setEstado] = useState("");
  const [errores, setErrores] = useState({});
  const [mensajeServidor, setMensajeServidor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const estadosMexico = [
    "Aguascalientes","Baja California","Baja California Sur","Campeche",
    "Chiapas","Chihuahua","Ciudad de México","Coahuila","Colima",
    "Durango","Guanajuato","Guerrero","Hidalgo","Jalisco","México",
    "Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla",
    "Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora",
    "Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas"
  ];

  const validateForm = () => {
    const erroresTemp = {};

    if (!correo) erroresTemp.correo = "El correo es obligatorio.";
    if (!estado) erroresTemp.estado = "Debes seleccionar un estado.";

    if (!password) erroresTemp.password = "La contraseña es obligatoria.";
    else {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;
      if (!regex.test(password)) {
        erroresTemp.password = "La contraseña no cumple con todos los requisitos.";
      }
    }

    if (!confirmPassword) erroresTemp.confirmPassword = "Debes confirmar la contraseña.";
    else if (password && confirmPassword && password !== confirmPassword) {
      erroresTemp.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const passwordRulesStatus = () => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[@$!%*?#&]/.test(password)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setEnviando(true);
    setMensajeServidor("");

    const usuario = { email: correo, password, state: estado };

    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(usuario),
      });

      const texto = await response.text();
      setMensajeServidor(texto);

      if (response.ok) {
        setCorreo(""); setPassword(""); setConfirmPassword(""); setEstado("");
        setErrores({});
        navigate("/datospersonales");
      }
    } catch (error) {
      console.error("Error en fetch:", error);
      setMensajeServidor("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  const rules = passwordRulesStatus();

  return (
    <div className="socio-wrapper">
      <div className="socio-card">
        <div className="socio-header">
          <div className="progress-bar"><div className="progress-fill" style={{ width: "25%" }} /></div>
          <h2>Registro</h2>
          <p>Paso 1 de 4 — Ingresa tu correo, contraseña y estado de nacimiento.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="socio-body">
            <div className="row">
              <div className="field">
                <label>Correo <span className="req">*</span></label>
                <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
                {errores.correo && <p className="error-text">{errores.correo}</p>}
              </div>
              <div className="field">
                <label>Estado <span className="req">*</span></label>
                <select value={estado} onChange={e => setEstado(e.target.value)}>
                  <option value="">-- Selecciona un estado --</option>
                  {estadosMexico.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                {errores.estado && <p className="error-text">{errores.estado}</p>}
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Contraseña <span className="req">*</span></label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                {errores.password && <p className="error-text">{errores.password}</p>}
                <div className="password-rules">
                  <p className={rules.length ? "rule-ok" : "rule-fail"}>• Al menos 8 caracteres</p>
                  <p className={rules.uppercase ? "rule-ok" : "rule-fail"}>• Al menos una letra mayúscula</p>
                  <p className={rules.lowercase ? "rule-ok" : "rule-fail"}>• Al menos una letra minúscula</p>
                  <p className={rules.number ? "rule-ok" : "rule-fail"}>• Al menos un número</p>
                  <p className={rules.symbol ? "rule-ok" : "rule-fail"}>• Al menos un símbolo (@$!%*?#&)</p>
                </div>
              </div>
              <div className="field">
                <label>Confirma tu contraseña <span className="req">*</span></label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                {errores.confirmPassword && <p className="error-text">{errores.confirmPassword}</p>}
              </div>
            </div>

            {mensajeServidor && <div className="server-message">{mensajeServidor}</div>}
          </div>

          <div className="socio-footer">
            <button type="submit" className="btn-submit" disabled={enviando}>{enviando ? "Registrando..." : "Continuar →"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPersonalData;