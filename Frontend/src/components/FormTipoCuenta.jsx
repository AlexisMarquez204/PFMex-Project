// src/components/FormTipoCuenta.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormTipoCuenta.css";

function FormTipoCuenta() {
  const navigate = useNavigate();

  // Estados del formulario
  const [tipoCuenta, setTipoCuenta] = useState("tarjeta");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreBanco, setNombreBanco] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [motivo, setMotivo] = useState("");

  // Estados de control
  const [errores, setErrores] = useState([]);
  const [mensajeServidor, setMensajeServidor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  
  // NUEVO: Estado para controlar la pantalla de carga final
  const [mostrarCargaFinal, setMostrarCargaFinal] = useState(false);
  const [progreso, setProgreso] = useState(0);

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

  // Obtener ID del usuario
  useEffect(() => {
    const obtenerIdUsuario = async () => {
      try {
        console.log("🔍 Obteniendo ID de usuario para TipoCuenta...");
        const response = await fetch("http://localhost:8080/tipo-cuenta/sesion-usuario", {
          method: "GET",
          credentials: "include",
        });

        console.log("📥 Respuesta status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Usuario autenticado - ID:", data.idUsuario);
          setIdUsuario(data.idUsuario);
        } else {
          console.log("❌ Error al obtener sesión");
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

  // Efecto para la barra de progreso cuando se muestra la carga final
  useEffect(() => {
    let interval;
    if (mostrarCargaFinal) {
      setProgreso(0);
      interval = setInterval(() => {
        setProgreso(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2; // Incrementa 2% cada vez (más rápido)
        });
      }, 30); // Cada 30ms
    }
    return () => clearInterval(interval);
  }, [mostrarCargaFinal]);

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
    } else {
      errs.push("Debes seleccionar un tipo de cuenta.");
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

    console.log("📤 Enviando payload:", payload);

    try {
      const response = await fetch("http://localhost:8080/tipo-cuenta/completo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const texto = await response.text();
      console.log("📥 Respuesta:", response.status, texto);
      
      if (response.ok) {
        setMensajeServidor("✅ " + texto);
        // Mostrar pantalla de carga
        setMostrarCargaFinal(true);
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMensajeServidor("❌ " + texto);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMensajeServidor("❌ Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

  // Pantalla de carga inicial
  if (cargando) {
    return (
      <div className="socio-wrapper">
        <div className="socio-card" style={{ padding: "40px", textAlign: "center" }}>
          <div className="spinner" style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #2DC653",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  // Pantalla de carga final (después de guardar)
  if (mostrarCargaFinal) {
    return (
      <div className="socio-wrapper">
        <div className="socio-card" style={{ padding: "40px", textAlign: "center" }}>
          <div style={{ marginBottom: "30px" }}>
            <div className="spinner" style={{
              width: "60px",
              height: "60px",
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #2DC653",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite"
            }}></div>
            <h3 style={{ color: "#064E48", marginBottom: "10px" }}>¡Procesando!</h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Tus datos se han guardado correctamente
            </p>
            
            {/* Barra de progreso */}
            <div style={{
              width: "100%",
              height: "8px",
              background: "#f0f0f0",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "10px"
            }}>
              <div style={{
                height: "100%",
                width: `${progreso}%`,
                background: "linear-gradient(90deg, #2DC653, #0D7A73)",
                borderRadius: "10px",
                transition: "width 0.1s ease"
              }} />
            </div>
            
            <p style={{ fontSize: "12px", color: "#999" }}>
              Redirigiendo al dashboard... {progreso}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="socio-wrapper">
      <div className="socio-card">
        <div className="socio-header">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "100%" }} />
          </div>
          <h2>Tipo de Cuenta</h2>
          <p>Paso 4 de 4 — Selecciona tu método de pago preferido.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="socio-body">
            {/* Tipo de cuenta - Radio buttons */}
            <div className="tipo-cuenta-group">
              <label className="tipo-label">Tipo de Cuenta <span className="req">*</span></label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="tipoCuenta"
                    value="tarjeta"
                    checked={tipoCuenta === "tarjeta"}
                    onChange={(e) => setTipoCuenta(e.target.value)}
                    disabled={enviando || mostrarCargaFinal}
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
                    disabled={enviando || mostrarCargaFinal}
                  />
                  <span>Efectivo / Transferencia</span>
                </label>
              </div>
            </div>

            {/* Campos para TARJETA */}
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
                      disabled={enviando || mostrarCargaFinal}
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
                      disabled={enviando || mostrarCargaFinal}
                    >
                      <option value="">-- Selecciona un banco --</option>
                      {bancos.map((banco, index) => (
                        <option key={index} value={banco}>{banco}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label>Número de Cuenta (opcional)</label>
                    <input
                      type="text"
                      value={numeroCuenta}
                      onChange={(e) => setNumeroCuenta(e.target.value)}
                      placeholder="Número de cuenta"
                      maxLength="30"
                      disabled={enviando || mostrarCargaFinal}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campos para EFECTIVO */}
            {tipoCuenta === "efectivo" && (
              <>
                <div className="row">
                  <div className="field">
                    <label>Motivo <span className="req">*</span></label>
                    <select
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      disabled={enviando || mostrarCargaFinal}
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
                        disabled={enviando || mostrarCargaFinal}
                      />
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="field">
                    <label>Número de Cuenta (opcional)</label>
                    <input
                      type="text"
                      value={numeroCuenta}
                      onChange={(e) => setNumeroCuenta(e.target.value)}
                      placeholder="Si tienes una cuenta, ingresa el número"
                      maxLength="30"
                      disabled={enviando || mostrarCargaFinal}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Errores */}
            {errores.length > 0 && (
              <div className="error-list">
                {errores.map((err, i) => <p key={i}>• {err}</p>)}
              </div>
            )}
            
            {/* Mensaje del servidor */}
            {mensajeServidor && (
              <div className={`server-message ${mensajeServidor.includes("❌") ? "error-message" : ""}`}>
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
              disabled={enviando || mostrarCargaFinal}
            >
              ← Regresar
            </button>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={enviando || mostrarCargaFinal}
            >
              {enviando ? "Guardando..." : "Finalizar →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormTipoCuenta;