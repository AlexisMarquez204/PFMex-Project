// src/components/Login.jsx
import "./Login.css";
import imagen from "../assets/usuario.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  
  // Estados para el modal
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [aceptado, setAceptado] = useState(false);

  // Función para abrir el modal al hacer clic en "¿No tienes cuenta?"
  const abrirModalRegistro = () => {
    setMostrarAviso(true);
    setAceptado(false); // Reiniciar el checkbox
  };

  const cerrarAviso = () => {
    setMostrarAviso(false);
    setAceptado(false);
  };

  const aceptarAviso = () => {
    if (aceptado) {
      localStorage.setItem("avisoPrivacidadAceptado", "true");
      setMostrarAviso(false);
      navigate("/formulario"); // Redirigir al formulario de registro
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

  const data = await response.json();
      
         console.log("DATA BACKEND:", data);
         console.log("NEXT:", data.next);


         if (response.ok) {
         localStorage.setItem("usuario", JSON.stringify(data.usuario || data));
         localStorage.setItem("isAuth", "true");

          if (data.next === "DATOS_PERSONALES") {
                 navigate("/datospersonales");
          }else {
                 navigate("/userDashboard");
          }
         } else {
                 setError(data.mensaje || "Error al iniciar sesión");
    }
    } catch (error) {
      console.error("Error de conexión:", error);
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrapper">
      
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>

      <div className="login-card">
        <img src={imagen} alt="Imagen" className="login-top-image" />

        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={cargando}
            required
          />
          
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={cargando}
            required
          />

          {error && (
            <div className="error-mensaje">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-access"
            disabled={cargando}
          >
            {cargando ? "Iniciando sesión..." : "Acceso"}
          </button>
        </form>

        <button 
          className="btn-register"
          onClick={abrirModalRegistro} // ← Ahora abre el modal en lugar de navegar directamente
          disabled={cargando}
        >
          ¿No tienes cuenta?
        </button>

      </div>

      {/* MODAL de Aviso de Privacidad - Solo aparece cuando se hace clic en el botón */}
      {mostrarAviso && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Aviso de Privacidad</h2>

            <div className="modal-content">
              <p>
                En PFMex recopilamos y tratamos sus datos personales conforme
                a la Ley Federal de Protección de Datos Personales.
              </p>

              <ul>
                <li>Uso de datos para evaluación crediticia</li>
                <li>Protección y resguardo seguro de información</li>
                <li>No compartimos datos sin consentimiento</li>
              </ul>

              <label className="check-container">
                <input
                  type="checkbox"
                  checked={aceptado}
                  onChange={(e) => setAceptado(e.target.checked)}
                />
                Acepto el <a 
                  href="/Aviso_de_Privacidad_PFMex.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  aviso de privacidad
                </a>
              </label>
            </div>

            <div className="modal-buttons">
              <button className="btn-outline" onClick={cerrarAviso}>
                Rechazar
              </button>

              <button
                className="btn-primary"
                disabled={!aceptado}
                onClick={aceptarAviso}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;