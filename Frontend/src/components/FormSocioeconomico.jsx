import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormSocioeconomico.css";

function FormSocioeconomico() {
  const navigate = useNavigate();

  // Estados del formulario base
  const [nivelEstudios, setNivelEstudios] = useState("");
  const [situacionLaboral, setSituacionLaboral] = useState("");
  const [ingresoMensual, setIngresoMensual] = useState("");
  const [mesesLaborando, setMesesLaborando] = useState("");
  const [otrasDeudas, setOtrasDeudas] = useState("0");
  const [gastosMensuales, setGastosMensuales] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Estados para el tipo de préstamo y campos adicionales
  const [showModal, setShowModal] = useState(true);
  const [loanType, setLoanType] = useState(null); // 'personal', 'negocio', 'hipotecario'

  // Campos para préstamo de negocio
  const [rubro, setRubro] = useState("");
  const [mesesFuncionando, setMesesFuncionando] = useState("");

  // Campos para préstamo hipotecario
  const [valorPropiedad, setValorPropiedad] = useState("");
  const [direccionPropiedad, setDireccionPropiedad] = useState("");
  const [tipoPropiedad, setTipoPropiedad] = useState("");

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

    // Validaciones según tipo de préstamo
    if (loanType === "negocio") {
      if (!rubro) errs.push("El rubro del negocio es obligatorio.");
      if (!mesesFuncionando) errs.push("Los meses funcionando son obligatorios.");
      if (mesesFuncionando && isNaN(Number(mesesFuncionando))) {
        errs.push("Los meses funcionando deben ser un número.");
      }
    }

    if (loanType === "hipotecario") {
      if (!valorPropiedad) errs.push("El valor de la propiedad es obligatorio.");
      if (valorPropiedad && isNaN(Number(valorPropiedad))) {
        errs.push("El valor de la propiedad debe ser un número.");
      }
      if (!direccionPropiedad) errs.push("La dirección de la propiedad es obligatoria.");
      if (!tipoPropiedad) errs.push("El tipo de propiedad es obligatorio.");
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
      gastosMensuales: Number(gastosMensuales) || 0,
      tipoPrestamo: loanType,
    };

    // Agregar campos específicos según el tipo
    if (loanType === "negocio") {
      payload.rubro = rubro;
      payload.mesesFuncionando = Number(mesesFuncionando) || 0;
    } else if (loanType === "hipotecario") {
      payload.valorPropiedad = Number(valorPropiedad) || 0;
      payload.direccionPropiedad = direccionPropiedad;
      payload.tipoPropiedad = tipoPropiedad;
    }

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

  const handleSelectLoanType = (type) => {
    setLoanType(type);
    setShowModal(false);
  };

  if (cargando) {
    return (
      <div className="socio-wrapper">
        <div className="socio-card loading-card">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="socio-wrapper">
      {/* Modal de selección de préstamo */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="socio-card" style={{ maxWidth: '400px', padding: '24px' }}>
            <h3 style={{ marginTop: 0, color: '#064E48' }}>¿Qué tipo de préstamo busca?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <button
                className="btn-opcion"
                onClick={() => handleSelectLoanType('personal')}
                style={{ width: '100%', padding: '12px' }}
              >
                Préstamo Personal
              </button>
              <button
                className="btn-opcion"
                onClick={() => handleSelectLoanType('negocio')}
                style={{ width: '100%', padding: '12px' }}
              >
                Préstamo de Negocio
              </button>
              <button
                className="btn-opcion"
                onClick={() => handleSelectLoanType('hipotecario')}
                style={{ width: '100%', padding: '12px' }}
              >
                Préstamo Hipotecario
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="socio-card">
        <div className="socio-header">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "75%" }} />
          </div>
          <h2>Datos Socioeconómicos</h2>
          <p>Paso 3 de 4 — Completa tu información económica.</p>
          {loanType && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#2DC653' }}>
              Préstamo seleccionado: <strong>{loanType === 'personal' ? 'Personal' : loanType === 'negocio' ? 'Negocio' : 'Hipotecario'}</strong>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="socio-body">
            {/* Campos base */}
            <div className="row">
              <div className="campo">
                <label>Nivel de Estudios <span className="required">*</span></label>
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
              <div className="campo">
                <label>Situación Laboral <span className="required">*</span></label>
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

            <div className="row">
              <div className="campo">
                <label>Ingreso Mensual ($) <span className="required">*</span></label>
                <div className="input-con-icono">
                  <span className="icono-moneda">$</span>
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
              </div>
              <div className="campo">
                <label>Meses Laborando <span className="required">*</span></label>
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

            <div className="row">
              <div className="campo">
                <label>Gastos Mensuales ($) <span className="required">*</span></label>
                <div className="input-con-icono">
                  <span className="icono-moneda">$</span>
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
              </div>
              <div className="campo">
                <label>Otras Deudas ($)</label>
                <div className="input-con-icono">
                  <span className="icono-moneda">$</span>
                  <input 
                    type="number" 
                    value={otrasDeudas} 
                    onChange={e => setOtrasDeudas(e.target.value)} 
                    min="0" 
                    step="0.01"
                    placeholder="0.00"
                    disabled={enviando}
                  />
                </div>
                <span className="ayuda-texto">Opcional</span>
              </div>
            </div>

            {/* Campos adicionales según tipo de préstamo */}
            {loanType === 'negocio' && (
              <>
                <hr style={{ margin: '24px 0 16px', border: '1px solid #f0f0f0' }} />
                <h4 style={{ margin: '0 0 16px', color: '#064E48', fontSize: '14px', fontWeight: 700 }}>
                  Datos del Negocio
                </h4>
                <div className="row">
                  <div className="campo">
                    <label>Rubro <span className="required">*</span></label>
                    <input
                      type="text"
                      value={rubro}
                      onChange={e => setRubro(e.target.value)}
                      placeholder="Ej. Restaurante, Tienda, Servicios..."
                      disabled={enviando}
                    />
                  </div>
                  <div className="campo">
                    <label>Meses funcionando <span className="required">*</span></label>
                    <input
                      type="number"
                      value={mesesFuncionando}
                      onChange={e => setMesesFuncionando(e.target.value)}
                      min="0"
                      placeholder="0"
                      disabled={enviando}
                    />
                  </div>
                </div>
              </>
            )}

            {loanType === 'hipotecario' && (
              <>
                <hr style={{ margin: '24px 0 16px', border: '1px solid #f0f0f0' }} />
                <h4 style={{ margin: '0 0 16px', color: '#064E48', fontSize: '14px', fontWeight: 700 }}>
                  Datos Hipotecarios
                </h4>
                <div className="row">
                  <div className="campo">
                    <label>Valor de la propiedad ($) <span className="required">*</span></label>
                    <div className="input-con-icono">
                      <span className="icono-moneda">$</span>
                      <input
                        type="number"
                        value={valorPropiedad}
                        onChange={e => setValorPropiedad(e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        disabled={enviando}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="campo">
                    <label>Dirección de la propiedad <span className="required">*</span></label>
                    <input
                      type="text"
                      value={direccionPropiedad}
                      onChange={e => setDireccionPropiedad(e.target.value)}
                      placeholder="Calle, número, colonia, ciudad..."
                      disabled={enviando}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="campo">
                    <label>Tipo de propiedad <span className="required">*</span></label>
                    <select
                      value={tipoPropiedad}
                      onChange={e => setTipoPropiedad(e.target.value)}
                      disabled={enviando}
                    >
                      <option value="">-- Selecciona --</option>
                      <option>Casa</option>
                      <option>Departamento</option>
                      <option>Terreno</option>
                      <option>Local comercial</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Checkbox de términos */}
            <div className={`campo-checkbox ${!aceptaTerminos && errores.includes('Debes aceptar los términos y condiciones.') ? 'campo-error' : ''}`}>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={aceptaTerminos} 
                  onChange={e => setAceptaTerminos(e.target.checked)} 
                  disabled={enviando}
                />
                <span>Acepto los <a href="/terminos" target="_blank">Términos y Condiciones</a>. <span className="required">*</span></span>
              </label>
            </div>

            {/* Errores */}
            {errores.length > 0 && (
              <div className="error-list" style={{ marginTop: '16px' }}>
                {errores.map((err, i) => <p key={i} className="error-mensaje">• {err}</p>)}
              </div>
            )}
            
            {/* Mensaje del servidor */}
            {mensajeServidor && (
              <div className={`mensaje-servidor ${mensajeServidor.includes('exitoso') ? 'exito' : 'error'}`}>
                <span className="mensaje-icono">{mensajeServidor.includes('exitoso') ? '' : ''}</span>
                <span className="mensaje-texto">{mensajeServidor}</span>
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
              disabled={enviando || !loanType}
            >
              {enviando ? (
                <>
                  <span className="spinner-small"></span> Guardando...
                </>
              ) : "Continuar →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormSocioeconomico;