import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./FormDatosPersonales.css";

function FormDatosPersonales() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Obtener idUsuario desde la URL
  const idUsuario = parseInt(searchParams.get("userId") || "0", 10);

  // --- ESTADOS: DATOS PERSONALES ---
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");

  // --- ESTADOS: DIRECCIÓN (Nueva Tabla) ---
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [numero, setNumero] = useState("");

  const [errores, setErrores] = useState([]);
  const [mensajeServidor, setMensajeServidor] = useState("");
  const [cargando, setCargando] = useState(false);

  // Validación del formulario completo
  const validateForm = () => {
    const erroresTemp = [];

    // Validar Datos Personales
    if (!nombre) erroresTemp.push("El nombre es obligatorio.");
    if (!apellidoPaterno) erroresTemp.push("El apellido paterno es obligatorio.");
    if (!fechaNacimiento) erroresTemp.push("La fecha de nacimiento es obligatoria.");
    if (!estadoCivil) erroresTemp.push("Debes seleccionar un estado civil.");

    // Validar Dirección
    if (!provincia) erroresTemp.push("La provincia es obligatoria.");
    if (!ciudad) erroresTemp.push("La ciudad es obligatoria.");
    if (!codigoPostal) erroresTemp.push("El código postal es obligatorio.");

    if (!idUsuario) erroresTemp.push("No se recibió el ID del usuario.");

    setErrores(erroresTemp);
    return erroresTemp.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setCargando(true);

    // Estructura que incluye ambas tablas
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
      setMensajeServidor(data.mensaje);

      if (response.ok) {
        alert("Información guardada correctamente.");
        navigate(`/socioeconomico?userId=${idUsuario}`);
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <legend>Registro de Información</legend>

        <div className="form-content-wrapper">
          {/* COLUMNA IZQUIERDA: Datos Personales */}
          <fieldset className="form-section">
            <h3>Datos Personales</h3>
            
            <label>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />

            <label>Apellido Paterno</label>
            <input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />

            <label>Apellido Materno</label>
            <input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />

            <label>Fecha de Nacimiento</label>
            <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />

            <label>Teléfono</label>
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

            <label>Estado Civil</label>
            <select value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)}>
              <option value="">-- Selecciona --</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viudo">Viudo</option>
            </select>
          </fieldset>

          {/* COLUMNA DERECHA: Dirección */}
          <fieldset className="form-section">
            <h3>Dirección</h3>

            <label>Provincia / Estado</label>
            <input type="text" value={provincia} onChange={(e) => setProvincia(e.target.value)} />

            <label>Ciudad</label>
            <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />

            <label>Calle / Localización</label>
            <input type="text" value={localizacion} onChange={(e) => setLocalizacion(e.target.value)} />

            <label>Código Postal</label>
            <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />

            <label>Número</label>
            <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </fieldset>
        </div>

        <div className="form-footer">
          {errores.map((err, index) => (
            <div key={index} className="error-message">{err}</div>
          ))}

          {mensajeServidor && <div className="server-message">{mensajeServidor}</div>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Guardar y continuar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormDatosPersonales;