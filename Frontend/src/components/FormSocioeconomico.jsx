// src/components/FormSocioeconomico.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./FormSocioeconomico.css";

function FormSocioeconomico() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idUsuario = parseInt(searchParams.get("userId") || "0", 10);

  // ── Campos tabla: socioeconomica (RF-07) ─────────────────────────
  const [nivelEstudios,    setNivelEstudios]    = useState("");
  const [situacionLaboral, setSituacionLaboral] = useState("");
  const [ingresoMensual,   setIngresoMensual]   = useState("");
  const [mesesLaborando,   setMesesLaborando]   = useState("");
  const [otrasDeudas,      setOtrasDeudas]      = useState("0");
  const [gastosMensuales,  setGastosMensuales]  = useState("");

  const [aceptaTerminos,  setAceptaTerminos]  = useState(false);
  const [errores,         setErrores]         = useState([]);
  const [mensajeServidor, setMensajeServidor] = useState("");
  const [enviando,        setEnviando]        = useState(false);

  // Validación (RF-08)
  const validateForm = () => {
    const errs = [];

    if (!nivelEstudios)    errs.push("El nivel de estudios es obligatorio.");
    if (!situacionLaboral) errs.push("La situación laboral es obligatoria.");

    if (!ingresoMensual || isNaN(Number(ingresoMensual)) || Number(ingresoMensual) < 0)
      errs.push("El ingreso mensual debe ser un número mayor o igual a 0.");

    if (!mesesLaborando || isNaN(Number(mesesLaborando)) || Number(mesesLaborando) < 0)
      errs.push("Los meses laborando deben ser un número mayor o igual a 0.");

    if (isNaN(Number(otrasDeudas)) || Number(otrasDeudas) < 0)
      errs.push("Otras deudas debe ser un número mayor o igual a 0.");

    if (!gastosMensuales || isNaN(Number(gastosMensuales)) || Number(gastosMensuales) < 0)
      errs.push("Los gastos mensuales deben ser un número mayor o igual a 0.");

    if (!aceptaTerminos)
      errs.push("Debes aceptar los términos y condiciones.");

    setErrores(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setEnviando(true);
    setMensajeServidor("");

    const payload = {
      idUsuario,
      nivelEstudios,
      situacionLaboral,
      ingresoMensual:  Number(ingresoMensual),
      mesesLaborando:  Number(mesesLaborando),
      otrasDeudas:     Number(otrasDeudas),
      gastosMensuales: Number(gastosMensuales),
    };

    try {
      const response = await fetch("http://localhost:8080/socioeconomico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMensajeServidor("✓ " + data.mensaje);
        // El siguiente paso lo maneja el compañero del dashboard
        // navigate("/userDashboard");
      } else {
        setMensajeServidor("Error: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensajeServidor("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="socio-wrapper">
      <div className="socio-card">

        <div className="socio-header">
          <div className="progress-bar"><div className="progress-fill" /></div>
          <h2>Datos Socioeconómicos</h2>
          <p>Paso 3 de 4 — Completa tu información económica. Los campos con * son obligatorios.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="socio-body">

            <div className="row">
              <div className="field">
                <label>Nivel de Estudios <span className="req">*</span></label>
                <select value={nivelEstudios} onChange={(e) => setNivelEstudios(e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  <option>Sin estudios</option>
                  <option>Primaria</option>
                  <option>Secundaria</option>
                  <option>Preparatoria / Bachillerato</option>
                  <option>Técnico / Tecnológico</option>
                  <option>Licenciatura / Ingeniería</option>
                  <option>Posgrado</option>
                </select>
              </div>

              <div className="field">
                <label>Situación Laboral <span className="req">*</span></label>
                <select value={situacionLaboral} onChange={(e) => setSituacionLaboral(e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  <option>Empleado de tiempo completo</option>
                  <option>Empleado de medio tiempo</option>
                  <option>Trabajador independiente</option>
                  <option>Empresario / Emprendedor</option>
                  <option>Pensionado / Jubilado</option>
                  <option>Estudiante</option>
                  <option>Sin empleo actualmente</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Ingreso Mensual Neto ($) <span className="req">*</span></label>
                <input
                  type="number" placeholder="Ej. 15000" min="0" step="0.01"
                  value={ingresoMensual} onChange={(e) => setIngresoMensual(e.target.value)}
                />
                <span className="hint">Monto en pesos mexicanos</span>
              </div>

              <div className="field">
                <label>Meses Laborando <span className="req">*</span></label>
                <input
                  type="number" placeholder="Ej. 24" min="0"
                  value={mesesLaborando} onChange={(e) => setMesesLaborando(e.target.value)}
                />
                <span className="hint">En tu empleo actual</span>
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Gastos Mensuales ($) <span className="req">*</span></label>
                <input
                  type="number" placeholder="Ej. 8000" min="0" step="0.01"
                  value={gastosMensuales} onChange={(e) => setGastosMensuales(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Otras Deudas Activas ($)</label>
                <input
                  type="number" placeholder="0 si no tienes" min="0" step="0.01"
                  value={otrasDeudas} onChange={(e) => setOtrasDeudas(e.target.value)}
                />
                <span className="hint">Suma total de deudas vigentes</span>
              </div>
            </div>

            <div className="check-row">
              <input
                type="checkbox" id="terminos"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              <p>
                He leído y acepto los <a href="#">Términos y Condiciones</a> y el{" "}
                <a href="#">Aviso de Privacidad</a> de PF-Mex.
              </p>
            </div>

            {errores.length > 0 && (
              <div className="error-list">
                {errores.map((err, i) => <p key={i}>• {err}</p>)}
              </div>
            )}

            {mensajeServidor && (
              <div className="server-message">{mensajeServidor}</div>
            )}

          </div>

          <div className="socio-footer">
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>
              ← Regresar
            </button>
            <button type="submit" className="btn-submit" disabled={enviando}>
              {enviando ? "Guardando..." : "Continuar →"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default FormSocioeconomico;
