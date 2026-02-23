// src/components/FormSocioeconomico.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormSocioeconomico.css";

function FormSocioeconomico() {
  const navigate = useNavigate();

  // Estados del formulario
  const [nivelEstudios, setNivelEstudios] = useState("");
  const [situacionLaboral, setSituacionLaboral] = useState("");
  const [ingresoMensual, setIngresoMensual] = useState("");
  const [mesesLaborando, setMesesLaborando] = useState("");
  const [otrasDeudas, setOtrasDeudas] = useState("0");
  const [gastosMensuales, setGastosMensuales] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Estados de control
  const [errores, setErrores] = useState([]);
  const [mensajeServidor, setMensajeServidor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);

  // Obtener ID del usuario
  useEffect(() => {
    const obtenerIdUsuario = async () => {
      try {
        console.log("🔍 Obteniendo ID de usuario...");
        const response = await fetch("http://localhost:8080/socioeconomico/sesion-usuario", {
          method: "GET",
          credentials: "include",
        });

        console.log("📥 Respuesta status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Usuario autenticado - ID:", data.idUsuario);
          setIdUsuario(data.idUsuario);
        } else {
          const data = await response.json();
          console.log("❌ Error:", data);
          setMensajeServidor("No hay sesión activa");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.error("❌ Error de conexión:", error);
        setMensajeServidor("Error de conexión con el servidor");
      } finally {
        setCargando(false);
      }
    };

    obtenerIdUsuario();
  }, [navigate]);

  const validateForm = () => {
    const errs = [];
    if (!nivelEstudios) errs.push("El nivel de estudios es obligatorio.");
    if (!situacionLaboral) errs.push("La situación laboral es obligatoria.");
    if (!ingresoMensual) errs.push("El ingreso mensual es obligatorio.");
    if (!mesesLaborando) errs.push("Los meses laborando son obligatorios.");
    if (!gastosMensuales) errs.push("Los gastos mensuales son obligatorios.");
    if (!aceptaTerminos) errs.push("Debes aceptar los términos y condiciones.");
    
    // Validaciones numéricas
    if (ingresoMensual && isNaN(Number(ingresoMensual))) {
      errs.push("El ingreso mensual debe ser un número.");
    }
    if (mesesLaborando && isNaN(Number(mesesLaborando))) {
      errs.push("Los meses laborando deben ser un número.");
    }
    if (gastosMensuales && isNaN(Number(gastosMensuales))) {
      errs.push("Los gastos mensuales deben ser un número.");
    }
    if (otrasDeudas && isNaN(Number(otrasDeudas))) {
      errs.push("Otras deudas debe ser un número.");
    }

    setErrores(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setEnviando(true);
    setMensajeServidor("");

    const payload = {
      idUsuario: idUsuario,
      nivelEstudios: nivelEstudios,
      situacionLaboral: situacionLaboral,
      ingresoMensual: Number(ingresoMensual) || 0,
      mesesLaborando: Number(mesesLaborando) || 0,
      otrasDeudas: Number(otrasDeudas) || 0,
      gastosMensuales: Number(gastosMensuales) || 0
    };

    console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch("http://localhost:8080/socioeconomico/completo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const texto = await response.text();
      console.log("📥 Respuesta del servidor:", response.status, texto);
      setMensajeServidor(texto);

      if (response.ok) {
        setTimeout(() => {
          navigate("/tipocuenta");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Error en fetch:", error);
      setMensajeServidor("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="socio-wrapper">
        <div className="socio-card" style={{ padding: "40px", textAlign: "center" }}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="socio-wrapper">
      <div className="socio-card">
        <div className="socio-header">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "75%" }} />
          </div>
          <h2>Datos Socioeconómicos</h2>
          <p>Paso 3 de 4 — Completa tu información económica.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="socio-body">
            {/* Nivel de estudios */}
            <div className="row">
              <div className="field">
                <label>Nivel de Estudios <span className="req">*</span></label>
                <select 
                  value={nivelEstudios} 
                  onChange={e => setNivelEstudios(e.target.value)}
                  disabled={enviando}
                >
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
                <select 
                  value={situacionLaboral} 
                  onChange={e => setSituacionLaboral(e.target.value)}
                  disabled={enviando}
                >
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

            {/* Ingreso y meses */}
            <div className="row">
              <div className="field">
                <label>Ingreso Mensual ($) <span className="req">*</span></label>
                <input 
                  type="number" 
                  value={ingresoMensual} 
                  onChange={e => setIngresoMensual(e.target.value)} 
                  min="0" 
                  step="0.01"
                  placeholder="0.00"
                  disabled={enviando}
                />
              </div>
              <div className="field">
                <label>Meses Laborando <span className="req">*</span></label>
                <input 
                  type="number" 
                  value={mesesLaborando} 
                  onChange={e => setMesesLaborando(e.target.value)} 
                  min="0"
                  placeholder="0"
                  disabled={enviando}
                />
              </div>
            </div>

            {/* Gastos y deudas */}
            <div className="row">
              <div className="field">
                <label>Gastos Mensuales ($) <span className="req">*</span></label>
                <input 
                  type="number" 
                  value={gastosMensuales} 
                  onChange={e => setGastosMensuales(e.target.value)} 
                  min="0" 
                  step="0.01"
                  placeholder="0.00"
                  disabled={enviando}
                />
              </div>
              <div className="field">
                <label>Otras Deudas ($)</label>
                <input 
                  type="number" 
                  value={otrasDeudas} 
                  onChange={e => setOtrasDeudas(e.target.value)} 
                  min="0" 
                  step="0.01"
                  placeholder="0.00"
                  disabled={enviando}
                />
                <span className="hint">Opcional</span>
              </div>
            </div>

            {/* Términos */}
            <div className="check-row">
              <input 
                type="checkbox" 
                checked={aceptaTerminos} 
                onChange={e => setAceptaTerminos(e.target.checked)} 
                disabled={enviando}
              />
              <p>Acepto los Términos y Condiciones. <span className="req">*</span></p>
            </div>

            {/* Errores */}
            {errores.length > 0 && (
              <div className="error-list">
                {errores.map((err, i) => <p key={i}>• {err}</p>)}
              </div>
            )}
            
            {/* Mensaje del servidor */}
            {mensajeServidor && (
              <div className="server-message">
                {mensajeServidor}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="socio-footer">
            <button 
              type="button" 
              className="btn-back" 
              onClick={() => navigate(-1)} 
              disabled={enviando}
            >
              ← Regresar
            </button>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={enviando}
            >
              {enviando ? "Guardando..." : "Continuar →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormSocioeconomico;