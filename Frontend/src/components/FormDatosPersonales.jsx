// src/components/FormDatosPersonales.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./FormDatosPersonales.css";

function FormDatosPersonales() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idUsuario = parseInt(searchParams.get("userId") || "0", 10);

  // ── DATOS PERSONALES ─────────────────────────
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");

  // ── DIRECCIÓN ─────────────────────────
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [numero, setNumero] = useState("");

  const [errores, setErrores] = useState([]);
  const [mensajeServidor, setMensajeServidor] = useState("");
  const [enviando, setEnviando] = useState(false);

  const validateForm = () => {
    const errs = [];

    if (!nombre) errs.push("El nombre es obligatorio.");
    if (!apellidoPaterno) errs.push("El apellido paterno es obligatorio.");
    if (!fechaNacimiento) errs.push("La fecha de nacimiento es obligatoria.");
    if (!estadoCivil) errs.push("Debes seleccionar un estado civil.");
    if (!provincia) errs.push("La provincia es obligatoria.");
    if (!ciudad) errs.push("La ciudad es obligatoria.");
    if (!codigoPostal) errs.push("El código postal es obligatorio.");
    if (!idUsuario) errs.push("No se recibió el ID del usuario.");

    setErrores(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setEnviando(true);
    setMensajeServidor("");

    const payload = {
      datosPersonales: {
        id_usuario: idUsuario,
        nombre,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        fecha_nacimiento: fechaNacimiento,
        telefono,
        estado_civil: estadoCivil,
      },
      direccion: {
        id_usuario: idUsuario,
        provincia,
        ciudad,
        localizacion,
        codigo_postal: codigoPostal,
        numero,
      },
    };

    try {
      const response = await fetch("http://localhost:8080/datos-personales-completo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMensajeServidor("✓ " + data.mensaje);
        navigate(`/socioeconomico?userId=${idUsuario}`);
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
          <div className="progress-bar"><div className="progress-fill" style={{ width: "50%" }} /></div>
          <h2>Datos Personales</h2>
          <p>Paso 2 de 4 — Completa tu información personal y de domicilio.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="socio-body">

            {/* DATOS PERSONALES */}
            <div className="row">
              <div className="field">
                <label>Nombre <span className="req">*</span></label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>

              <div className="field">
                <label>Apellido Paterno <span className="req">*</span></label>
                <input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Apellido Materno</label>
                <input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
              </div>

              <div className="field">
                <label>Fecha de Nacimiento <span className="req">*</span></label>
                <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Teléfono</label>
                <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>

              <div className="field">
                <label>Estado Civil <span className="req">*</span></label>
                <select value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  <option>Soltero</option>
                  <option>Casado</option>
                  <option>Divorciado</option>
                  <option>Viudo</option>
                </select>
              </div>
            </div>

            {/* DIRECCIÓN */}
            <div className="row">
              <div className="field">
                <label>Provincia / Estado <span className="req">*</span></label>
                <input type="text" value={provincia} onChange={(e) => setProvincia(e.target.value)} />
              </div>

              <div className="field">
                <label>Ciudad <span className="req">*</span></label>
                <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Calle / Localización</label>
                <input type="text" value={localizacion} onChange={(e) => setLocalizacion(e.target.value)} />
              </div>

              <div className="field">
                <label>Código Postal <span className="req">*</span></label>
                <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Número</label>
                <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} />
              </div>
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

export default FormDatosPersonales;