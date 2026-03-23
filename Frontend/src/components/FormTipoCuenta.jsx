// src/components/FormTipoCuenta.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormTipoCuenta.css";

function FormTipoCuenta() {
  const navigate = useNavigate();

  const [tipoCuenta, setTipoCuenta] = useState("tarjeta");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreBanco, setNombreBanco] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [motivo, setMotivo] = useState("");
  const [errores, setErrores] = useState([]);
  const [mensajeServidor, setMensajeServidor] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [mostrarModalAutorizacion, setMostrarModalAutorizacion] = useState(false);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [datosEstudio, setDatosEstudio] = useState(null);
  
  // Datos de autorización de crédito
  const [montoMaximoAutorizado, setMontoMaximoAutorizado] = useState(0);
  const [montoMinimoAutorizado, setMontoMinimoAutorizado] = useState(5000);
  const [tasaInteres, setTasaInteres] = useState(12);
  const [plazoMaximo, setPlazoMaximo] = useState(12);
  const [puntajeCredito, setPuntajeCredito] = useState(0);
  const [nivelCredito, setNivelCredito] = useState("");
  const [razonesCredito, setRazonesCredito] = useState([]);
  
  // Estados para el préstamo seleccionado
  const [montoSeleccionado, setMontoSeleccionado] = useState(5000);
  const [mesesSeleccionados, setMesesSeleccionados] = useState(6);

  const bancos = [
    "Banco Azteca",
    "Bancoppel",
    "BBVA",
    "Citibanamex",
    "HSBC",
    "Santander",
    "Scotiabank",
    "Otro"
  ];

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const obtenerDatosUsuario = async () => {
    try {
      const response = await fetch("http://localhost:8080/tipo-cuenta/sesion-usuario", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIdUsuario(data.idUsuario);
        await obtenerDatosEstudioSocioeconomico(data.idUsuario);
      } else {
        setMensajeServidor("No hay sesión activa");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMensajeServidor("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const obtenerDatosEstudioSocioeconomico = async (idUsuario) => {
    try {
      const response = await fetch(`http://localhost:8080/socioeconomico/usuario/${idUsuario}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setDatosEstudio(data);
        calcularMontoAutorizado(data);
      } else {
        // Datos por defecto si no hay estudio
        const datosDefault = {
          ingresosMensuales: 12000,
          antiguedadLaboral: 2,
          tipoEmpleo: "Empleado fijo",
          tieneDeudas: false,
          capacidadAhorro: 15,
          gastosFijos: 6000,
          scoreCredito: 650
        };
        setDatosEstudio(datosDefault);
        calcularMontoAutorizado(datosDefault);
      }
    } catch (error) {
      console.error("Error al obtener estudio:", error);
      const datosDefault = {
        ingresosMensuales: 12000,
        antiguedadLaboral: 2,
        tipoEmpleo: "Empleado fijo",
        tieneDeudas: false,
        capacidadAhorro: 15,
        gastosFijos: 6000,
        scoreCredito: 650
      };
      setDatosEstudio(datosDefault);
      calcularMontoAutorizado(datosDefault);
    }
  };

  const calcularMontoAutorizado = (datos) => {
    if (!datos) return;

    const ingresos = datos.ingresosMensuales || 0;
    const antiguedad = datos.antiguedadLaboral || 0;
    const capacidadAhorro = datos.capacidadAhorro || 0;
    const gastosFijos = datos.gastosFijos || 0;
    const tieneDeudas = datos.tieneDeudas || false;
    const tipoEmpleo = datos.tipoEmpleo || "";
    const scoreCredito = datos.scoreCredito || 600;
    
    let puntaje = 0;
    let razones = [];

    // 1. Evaluar ingresos mensuales
    if (ingresos >= 50000) {
      puntaje += 40;
      razones.push("Ingresos mensuales altos (> $50,000)");
    } else if (ingresos >= 35000) {
      puntaje += 30;
      razones.push("Ingresos mensuales muy buenos ($35,000 - $50,000)");
    } else if (ingresos >= 25000) {
      puntaje += 25;
      razones.push("Ingresos mensuales buenos ($25,000 - $35,000)");
    } else if (ingresos >= 15000) {
      puntaje += 20;
      razones.push("Ingresos mensuales moderados ($15,000 - $25,000)");
    } else if (ingresos >= 8000) {
      puntaje += 15;
      razones.push("Ingresos mensuales básicos ($8,000 - $15,000)");
    } else {
      puntaje += 5;
      razones.push("Ingresos mensuales limitados (< $8,000)");
    }

    // 2. Evaluar antigüedad laboral
    if (antiguedad >= 5) {
      puntaje += 20;
      razones.push("Antigüedad laboral sólida (> 5 años)");
    } else if (antiguedad >= 3) {
      puntaje += 15;
      razones.push("Antigüedad laboral estable (3-5 años)");
    } else if (antiguedad >= 1) {
      puntaje += 10;
      razones.push("Antigüedad laboral aceptable (1-3 años)");
    } else {
      puntaje += 5;
      razones.push("Antigüedad laboral reciente (< 1 año)");
    }

    // 3. Evaluar tipo de empleo
    if (tipoEmpleo === "Empleado fijo") {
      puntaje += 15;
      razones.push("Empleo estable");
    } else if (tipoEmpleo === "Negocio propio") {
      puntaje += 12;
      razones.push("Negocio propio");
    } else if (tipoEmpleo === "Empleado temporal") {
      puntaje += 8;
      razones.push("Empleo temporal");
    }

    // 4. Evaluar deudas
    if (!tieneDeudas) {
      puntaje += 15;
      razones.push("Sin deudas registradas");
    } else {
      puntaje -= 10;
      razones.push("Presencia de deudas existentes");
    }

    // 5. Evaluar capacidad de ahorro
    if (capacidadAhorro >= 30) {
      puntaje += 20;
      razones.push("Excelente capacidad de ahorro");
    } else if (capacidadAhorro >= 20) {
      puntaje += 15;
      razones.push("Buena capacidad de ahorro");
    } else if (capacidadAhorro >= 10) {
      puntaje += 10;
      razones.push("Capacidad de ahorro moderada");
    }

    // 6. Evaluar score crediticio
    if (scoreCredito >= 750) {
      puntaje += 20;
      razones.push("Score crediticio excelente");
    } else if (scoreCredito >= 700) {
      puntaje += 15;
      razones.push("Score crediticio muy bueno");
    } else if (scoreCredito >= 650) {
      puntaje += 10;
      razones.push("Score crediticio bueno");
    } else if (scoreCredito >= 600) {
      puntaje += 5;
      razones.push("Score crediticio regular");
    }

    // Calcular monto máximo basado en el puntaje
    let montoMax = 5000;
    let nivel = "";
    
    if (puntaje >= 100) {
      montoMax = 50000;
      nivel = "Excelente";
    } else if (puntaje >= 85) {
      montoMax = 40000;
      nivel = "Muy Bueno";
    } else if (puntaje >= 70) {
      montoMax = 30000;
      nivel = "Bueno";
    } else if (puntaje >= 55) {
      montoMax = 20000;
      nivel = "Regular";
    } else if (puntaje >= 40) {
      montoMax = 10000;
      nivel = "Básico";
    } else {
      montoMax = 5000;
      nivel = "Mínimo";
    }

    setMontoMaximoAutorizado(montoMax);
    setMontoMinimoAutorizado(5000);
    setMontoSeleccionado(montoMax);
    setPuntajeCredito(puntaje);
    setNivelCredito(nivel);
    setRazonesCredito(razones);
  };

  const handleMontoChange = (e) => {
    let valor = parseInt(e.target.value) || 0;
    valor = Math.min(valor, montoMaximoAutorizado);
    valor = Math.max(valor, montoMinimoAutorizado);
    setMontoSeleccionado(valor);
  };

  const handleMesesChange = (e) => {
    let valor = parseInt(e.target.value) || 1;
    valor = Math.min(valor, plazoMaximo);
    valor = Math.max(valor, 1);
    setMesesSeleccionados(valor);
  };

  const calcularPagoMensual = (monto, meses, tasa) => {
    if (!monto || !meses || !tasa) return 0;
    const tasaMensual = tasa / 100 / 12;
    const pago = monto * tasaMensual * Math.pow(1 + tasaMensual, meses) / (Math.pow(1 + tasaMensual, meses) - 1);
    return Math.ceil(pago);
  };

  const guardarPrestamoEnBackend = async () => {
    const pagoMensual = calcularPagoMensual(montoSeleccionado, mesesSeleccionados, tasaInteres);
    const prestamoData = {
      idUsuario: idUsuario,
      idTipoPrestamo: 1,
      montoSolicitado: montoSeleccionado,
      tasaInteres: tasaInteres,
      plazoMeses: mesesSeleccionados,
      montoAutorizado: montoSeleccionado,
      pagoMensual: pagoMensual
    };
    
    const response = await fetch("http://localhost:8080/api/prestamos/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(prestamoData),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, data };
    } else {
      throw new Error(data.mensaje || "Error al guardar");
    }
  };

  const handleAceptarAutorizacion = () => {
    setMostrarModalAutorizacion(false);
    setMostrarModalConfirmacion(true);
  };

  const handleConfirmarPrestamo = async () => {
    setEnviando(true);
    try {
      await guardarPrestamoEnBackend();
      setMostrarModalConfirmacion(false);
      navigate("/userDashboard", { 
        state: { 
          montoAutorizado: montoSeleccionado,
          pagoMensual: calcularPagoMensual(montoSeleccionado, mesesSeleccionados, tasaInteres),
          tasaInteres: tasaInteres,
          plazo: mesesSeleccionados
        } 
      });
    } catch (error) {
      setMensajeServidor(`Error: ${error.message}`);
      setTimeout(() => setMensajeServidor(""), 3000);
    } finally {
      setEnviando(false);
    }
  };

  const validarTarjeta = (numero) => {
    const soloNumeros = numero.replace(/\s/g, "");
    return /^\d{16}$/.test(soloNumeros);
  };

  const formatearTarjeta = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    const grupos = numeros.match(/.{1,4}/g);
    return grupos ? grupos.join(" ") : numeros;
  };

  const handleTarjetaChange = (e) => {
    const formateado = formatearTarjeta(e.target.value);
    setNumeroTarjeta(formateado);
  };

  const validateForm = () => {
    const errs = [];

    if (tipoCuenta === "tarjeta") {
      if (!numeroTarjeta) {
        errs.push("El número de tarjeta es obligatorio.");
      } else if (!validarTarjeta(numeroTarjeta)) {
        errs.push("El número de tarjeta debe tener 16 dígitos.");
      }
      
      if (!nombreBanco) {
        errs.push("El nombre del banco es obligatorio.");
      }
    } else if (tipoCuenta === "efectivo") {
      if (!motivo) {
        errs.push("El motivo es obligatorio para cuentas en efectivo.");
      }
    }

    setErrores(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!idUsuario) {
      setMensajeServidor("Error: No hay sesión activa");
      return;
    }

    setEnviando(true);
    setMensajeServidor("");

    const payload = {
      idUsuario: idUsuario,
      tipoCuenta: tipoCuenta,
      numeroTarjeta: tipoCuenta === "tarjeta" ? numeroTarjeta.replace(/\s/g, "") : null,
      nombreBanco: tipoCuenta === "tarjeta" ? nombreBanco : null,
      numeroCuenta: numeroCuenta || null,
      motivo: tipoCuenta === "efectivo" ? motivo : null
    };

    try {
      const response = await fetch("http://localhost:8080/tipo-cuenta/completo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMensajeExito("Datos guardados correctamente");
        setTimeout(() => setMensajeExito(""), 3000);
        setMostrarModalAutorizacion(true);
      } else {
        const texto = await response.text();
        setMensajeServidor("Error: " + texto);
        setTimeout(() => setMensajeServidor(""), 3000);
      }
    } catch (error) {
      setMensajeServidor("Error de conexión");
      setTimeout(() => setMensajeServidor(""), 3000);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="socio-wrapper">
        <div className="socio-card" style={{ padding: "40px", textAlign: "center" }}>
          <div className="spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="socio-wrapper">
        <div className="socio-card">
          <div className="socio-header">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "100%" }} />
            </div>
            <h2>Solicitud de Préstamo</h2>
            <p>Completa los datos para finalizar tu solicitud.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="socio-body">
              {/* Método de Pago */}
              <div className="tipo-cuenta-group">
                <label className="tipo-label">Método de Pago <span className="req">*</span></label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="tipoCuenta"
                      value="tarjeta"
                      checked={tipoCuenta === "tarjeta"}
                      onChange={(e) => setTipoCuenta(e.target.value)}
                      disabled={enviando}
                    />
                    <span>Tarjeta de crédito/débito</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="tipoCuenta"
                      value="efectivo"
                      checked={tipoCuenta === "efectivo"}
                      onChange={(e) => setTipoCuenta(e.target.value)}
                      disabled={enviando}
                    />
                    <span>Efectivo / Transferencia</span>
                  </label>
                </div>
              </div>

              {tipoCuenta === "tarjeta" && (
                <>
                  <div className="row">
                    <div className="field">
                      <label>Número de Tarjeta <span className="req">*</span></label>
                      <input
                        type="text"
                        value={numeroTarjeta}
                        onChange={handleTarjetaChange}
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        disabled={enviando}
                      />
                      <span className="hint">16 dígitos</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="field">
                      <label>Banco <span className="req">*</span></label>
                      <select
                        value={nombreBanco}
                        onChange={(e) => setNombreBanco(e.target.value)}
                        disabled={enviando}
                      >
                        <option value="">-- Selecciona un banco --</option>
                        {bancos.map((banco, index) => (
                          <option key={index} value={banco}>{banco}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {tipoCuenta === "efectivo" && (
                <>
                  <div className="row">
                    <div className="field">
                      <label>Motivo <span className="req">*</span></label>
                      <select
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        disabled={enviando}
                      >
                        <option value="">-- Selecciona un motivo --</option>
                        <option value="No tengo cuenta bancaria">No tengo cuenta bancaria</option>
                        <option value="Prefiero efectivo">Prefiero efectivo</option>
                        <option value="Problemas con mi banco">Problemas con mi banco</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                  {motivo === "Otro" && (
                    <div className="row">
                      <div className="field">
                        <label>Especifica el motivo</label>
                        <textarea
                          value={numeroCuenta}
                          onChange={(e) => setNumeroCuenta(e.target.value)}
                          placeholder="Describe el motivo..."
                          rows="3"
                          disabled={enviando}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {errores.length > 0 && (
                <div className="error-list">
                  {errores.map((err, i) => <p key={i}>• {err}</p>)}
                </div>
              )}
              
              {mensajeServidor && (
                <div className="server-message error-message">
                  {mensajeServidor}
                </div>
              )}
              
              {mensajeExito && (
                <div className="server-message success-message">
                  {mensajeExito}
                </div>
              )}
            </div>

            <div className="socio-footer">
              <button type="button" className="btn-back" onClick={() => navigate(-1)} disabled={enviando}>
                ← Regresar
              </button>
              <button type="submit" className="btn-submit" disabled={enviando}>
                {enviando ? "Guardando..." : "Continuar →"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Autorización de Crédito */}
      {mostrarModalAutorizacion && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header autorizacion">
              <div className="header-icon">✓</div>
              <h2>¡Crédito Autorizado!</h2>
            </div>
            <div className="modal-body">
              <div className="autorizacion-content">
                <div className="puntaje-container">
                  <span className="puntaje-label">Puntaje crediticio</span>
                  <div className="puntaje-valor">{puntajeCredito}/140</div>
                  <div className="puntaje-nivel">{nivelCredito}</div>
                </div>

                <div className="monto-autorizado">
                  <span className="monto-label">Monto máximo autorizado</span>
                  <div className="monto-valor">${montoMaximoAutorizado.toLocaleString()} MXN</div>
                  <div className="monto-rango">Monto mínimo: ${montoMinimoAutorizado.toLocaleString()} MXN</div>
                </div>

                <div className="tasa-info">
                  <span>Tasa de interés: {tasaInteres}% anual</span>
                  <span>Plazo máximo: {plazoMaximo} meses</span>
                </div>

                <div className="razones-container">
                  <h4>Factores considerados:</h4>
                  <ul>
                    {razonesCredito.slice(0, 5).map((razon, index) => (
                      <li key={index}>{razon}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-aceptar" onClick={handleAceptarAutorizacion}>
                Continuar con la solicitud
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Préstamo */}
      {mostrarModalConfirmacion && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header confirmacion">
              <h2>Personaliza tu Préstamo</h2>
            </div>
            <div className="modal-body">
              <div className="resumen-prestamo">
                <div className="info-autorizado">
                  <span className="label">Monto máximo autorizado:</span>
                  <strong className="monto-max">${montoMaximoAutorizado.toLocaleString()} MXN</strong>
                </div>
                
                <div className="monto-editable">
                  <label>Monto a solicitar:</label>
                  <div className="monto-control-modal">
                    <input
                      type="range"
                      min={montoMinimoAutorizado}
                      max={montoMaximoAutorizado}
                      step={1000}
                      value={montoSeleccionado}
                      onChange={handleMontoChange}
                      className="monto-slider-modal"
                    />
                    <div className="monto-input-modal">
                      <span className="moneda">$</span>
                      <input
                        type="number"
                        value={montoSeleccionado}
                        onChange={handleMontoChange}
                        min={montoMinimoAutorizado}
                        max={montoMaximoAutorizado}
                        step={1000}
                        className="monto-number-modal"
                      />
                      <span className="moneda">MXN</span>
                    </div>
                  </div>
                </div>

                <div className="plazo-editable">
                  <label>Plazo (meses):</label>
                  <div className="plazo-control-modal">
                    <input
                      type="range"
                      min="1"
                      max={plazoMaximo}
                      value={mesesSeleccionados}
                      onChange={handleMesesChange}
                      className="plazo-slider-modal"
                    />
                    <div className="plazo-input-modal">
                      <input
                        type="number"
                        value={mesesSeleccionados}
                        onChange={handleMesesChange}
                        min="1"
                        max={plazoMaximo}
                        className="plazo-number-modal"
                      />
                      <span>meses</span>
                    </div>
                  </div>
                </div>

                <div className="detalles-prestamo-modal">
                  <div className="detalle-item">
                    <span>Tasa de interés:</span>
                    <strong>{tasaInteres}% anual</strong>
                  </div>
                  <div className="detalle-item">
                    <span>Plazo seleccionado:</span>
                    <strong>{mesesSeleccionados} meses</strong>
                  </div>
                  <div className="detalle-item">
                    <span>Pago mensual:</span>
                    <strong className="pago-mensual-modal">
                      ${calcularPagoMensual(montoSeleccionado, mesesSeleccionados, tasaInteres).toLocaleString()} MXN
                    </strong>
                  </div>
                  <div className="detalle-item total">
                    <span>Total a pagar:</span>
                    <strong>
                      ${(calcularPagoMensual(montoSeleccionado, mesesSeleccionados, tasaInteres) * mesesSeleccionados).toLocaleString()} MXN
                    </strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setMostrarModalConfirmacion(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={handleConfirmarPrestamo} disabled={enviando}>
                {enviando ? "Procesando..." : "Confirmar Préstamo"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #2DC653;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-container {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 550px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        .modal-header {
          padding: 25px;
          text-align: center;
        }
        
        .modal-header.autorizacion {
          background: linear-gradient(135deg, #2DC653, #064E48);
          color: white;
        }
        
        .modal-header.confirmacion {
          background: #064E48;
          color: white;
        }
        
        .header-icon {
          width: 60px;
          height: 60px;
          background: white;
          color: #2DC653;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 15px;
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 22px;
        }
        
        .modal-body {
          padding: 25px;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .modal-footer {
          display: flex;
          gap: 15px;
          padding: 20px 25px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
        }
        
        .autorizacion-content {
          text-align: center;
        }
        
        .puntaje-container {
          margin-bottom: 25px;
        }
        
        .puntaje-label {
          font-size: 14px;
          color: #666;
        }
        
        .puntaje-valor {
          font-size: 42px;
          font-weight: bold;
          color: #2DC653;
        }
        
        .puntaje-nivel {
          font-size: 18px;
          color: #064E48;
          font-weight: 500;
        }
        
        .monto-autorizado {
          background: #e8f5e9;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .monto-label {
          font-size: 14px;
          color: #666;
          display: block;
        }
        
        .monto-valor {
          font-size: 32px;
          font-weight: bold;
          color: #2DC653;
        }
        
        .monto-rango {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        
        .tasa-info {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background: #f0f0f0;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .razones-container {
          text-align: left;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 12px;
        }
        
        .razones-container h4 {
          margin: 0 0 10px 0;
          color: #064E48;
        }
        
        .razones-container ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .razones-container li {
          font-size: 12px;
          color: #555;
          margin: 5px 0;
        }
        
        .info-autorizado {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #e8f5e9;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .monto-max {
          color: #2DC653;
          font-size: 18px;
        }
        
        .monto-editable, .plazo-editable {
          margin-bottom: 20px;
        }
        
        .monto-editable label, .plazo-editable label {
          display: block;
          font-weight: 500;
          margin-bottom: 10px;
          color: #333;
        }
        
        .monto-slider-modal, .plazo-slider-modal {
          width: 100%;
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          -webkit-appearance: none;
          margin-bottom: 15px;
        }
        
        .monto-slider-modal::-webkit-slider-thumb, .plazo-slider-modal::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #2DC653;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .monto-input-modal, .plazo-input-modal {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .monto-number-modal, .plazo-number-modal {
          width: 150px;
          padding: 8px;
          font-size: 16px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        .detalles-prestamo-modal {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 15px;
          margin-top: 20px;
        }
        
        .detalle-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .detalle-item:last-child {
          border-bottom: none;
        }
        
        .detalle-item.total {
          border-top: 1px solid #e0e0e0;
          border-bottom: none;
          margin-top: 5px;
          padding-top: 12px;
          font-weight: bold;
        }
        
        .pago-mensual-modal {
          color: #2DC653;
          font-size: 18px;
        }
        
        .btn-aceptar {
          width: 100%;
          padding: 14px;
          background: #2DC653;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .btn-cancelar {
          flex: 1;
          padding: 12px;
          background: #f0f0f0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .btn-confirmar {
          flex: 2;
          padding: 12px;
          background: #2DC653;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .btn-confirmar:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .error-message {
          background: #fee;
          color: #c00;
          border: 1px solid #fcc;
        }
        
        .success-message {
          background: #efe;
          color: #2c6;
          border: 1px solid #cfc;
        }
        
        .server-message {
          padding: 10px;
          border-radius: 8px;
          margin-top: 15px;
          text-align: center;
        }
      `}</style>
    </>
  );
}

export default FormTipoCuenta;