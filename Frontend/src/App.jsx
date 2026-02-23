import { useRef, useEffect, useState } from "react";
import React from "react";
import "./App.css";
import Formulario from "./components/FormPersonalData";
import { useNavigate } from "react-router-dom";

function App() {
  // Estado para controlar el campo "Otro mensaje"
const [mostrarOtroMensaje, setMostrarOtroMensaje] = useState(false);
const [nombre, setNombre] = useState("");
const [telefono, setTelefono] = useState("");
const [mensajeSelect, setMensajeSelect] = useState("");
const [otroMensaje, setOtroMensaje] = useState("");

// Efecto para mostrar/ocultar el campo "Otro mensaje"
useEffect(() => {
  setMostrarOtroMensaje(mensajeSelect === "Otro");
}, [mensajeSelect]);

// Función para enviar por WhatsApp
const enviarWhatsApp = () => {
  if (!nombre || !telefono || !mensajeSelect) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  let textoMensaje = mensajeSelect;
  if (mensajeSelect === 'Otro') {
    if (!otroMensaje) {
      alert('Por favor escribe tu mensaje');
      return;
    }
    textoMensaje = otroMensaje;
  }
  
  const texto = `Hola, soy ${nombre}. Mi teléfono es ${telefono}. ${textoMensaje}`;
  const url = `https://wa.me/5658690768?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
  
  // Opcional: Limpiar el formulario
  // setNombre("");
  // setTelefono("");
  // setMensajeSelect("");
  // setOtroMensaje("");
};
  const navigate = useNavigate();

  const [navColor, setNavColor] = useState("blue");

  const [tipoPrestamo, setTipoPrestamo] = useState("personal");
  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState("");
  const [errorMonto, setErrorMonto] = useState("");
  const [resultado, setResultado] = useState(null);

  // Estados del modal
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [aceptado, setAceptado] = useState(false);

  const heroRef = useRef(null);
  const nosotrosRef = useRef(null);
  const contactoRef = useRef(null);

  const configuracionPrestamo = {
    personal: { minimo: 200, tasa: 0.07 },
    negocio: { minimo: 50000, tasa: 0.08 },
    hipotecario: { minimo: 750000, tasa: 0.09 },
  };

  const configActual = configuracionPrestamo[tipoPrestamo];

  useEffect(() => {
    const sections = [
      { ref: heroRef, color: "blue" },
      { ref: nosotrosRef, color: "white" },
      { ref: contactoRef, color: "white" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find(
              (s) => s.ref.current === entry.target
            );
            if (section) setNavColor(section.color);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => {
      if (section.ref.current) observer.observe(section.ref.current);
    });

    return () => {
      sections.forEach((section) => {
        if (section.ref.current)
          observer.unobserve(section.ref.current);
      });
    };
  }, []);

  useEffect(() => {
    if (monto && Number(monto) < configActual.minimo) {
      setErrorMonto(
        `El monto mínimo para préstamo ${tipoPrestamo} es $${configActual.minimo}`
      );
    } else {
      setErrorMonto("");
    }
  }, [monto, tipoPrestamo]);

  const formularioValido =
    monto &&
    plazo &&
    Number(monto) >= configActual.minimo;

  const calcularPrestamo = () => {
    const P = Number(monto);
    const i = configActual.tasa;
    const n = Number(plazo);

    const pagoMensual =
      (P * i) / (1 - Math.pow(1 + i, -n));

    const totalPagar = pagoMensual * n;

    setResultado({
      pagoMensual: pagoMensual.toFixed(2),
      totalPagar: totalPagar.toFixed(2),
      tasa: configActual.tasa * 100,
    });
  };

  const abrirAviso = () => {
    setMostrarAviso(true);
  };

  const cerrarAviso = () => {
    setMostrarAviso(false);
    setAceptado(false);
  };

  const aceptarAviso = () => {
    if (aceptado) {
      setMostrarAviso(false);
      setAceptado(false);
      navigate("/formulario");
    }
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav
        className={`navbar ${
          navColor === "blue" ? "navbar-blue" : "navbar-white"
        }`}
      >
        <div className="logo">PFMex</div>

        <ul className="nav-links">
          <li onClick={() => heroRef.current.scrollIntoView({ behavior: "smooth" })}>
            Inicio
          </li>
          <li onClick={() => nosotrosRef.current.scrollIntoView({ behavior: "smooth" })}>
            Nosotros
          </li>
          <li onClick={() => contactoRef.current.scrollIntoView({ behavior: "smooth" })}>
            Contacto
          </li>
        </ul>

        <div className="nav-buttons">
          <button
            className={`btn-outline ${navColor === "white" ? "btn-dark" : ""}`}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button className="btn-primary" onClick={abrirAviso}>
            Solicitar préstamo
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="section hero">
        <div className="hero-text fade-in">
          <h1>Préstamos rápidos y seguros</h1>
          <p>
            Obtén financiamiento en minutos con tasas competitivas y aprobación digital.
          </p>
          <button className="btn-primary large" onClick={abrirAviso}>
            Continuar con el Préstamo
          </button>
        </div>

        <div className="loan-card fade-in delay">
          <h3>Simula tu préstamo</h3>

          <label>Tipo de préstamo</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="personal"
                checked={tipoPrestamo === "personal"}
                onChange={(e) => setTipoPrestamo(e.target.value)}
              />
              Personal
            </label>

            <label>
              <input
                type="radio"
                value="negocio"
                checked={tipoPrestamo === "negocio"}
                onChange={(e) => setTipoPrestamo(e.target.value)}
              />
              Negocio
            </label>

            <label>
              <input
                type="radio"
                value="hipotecario"
                checked={tipoPrestamo === "hipotecario"}
                onChange={(e) => setTipoPrestamo(e.target.value)}
              />
              Hipotecario
            </label>
          </div>

          <label>Monto</label>
          <input
            type="number"
            placeholder={`Monto mínimo $${configActual.minimo}`}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          {errorMonto && <p className="error-text">{errorMonto}</p>}

          <label>Plazo (meses)</label>
          <input
            type="number"
            placeholder="12"
            value={plazo}
            onChange={(e) => setPlazo(e.target.value)}
          />

          <button
            className="btn-primary full"
            disabled={!formularioValido}
            onClick={calcularPrestamo}
          >
            Calcular
          </button>

          {resultado && (
            <div className="resultado-box">
              <h4>Resumen del préstamo</h4>

              <div className="resultado-item">
                <span>Tasa mensual:</span>
                <span>{resultado.tasa}%</span>
              </div>

              <div className="resultado-item">
                <span>Pago mensual:</span>
                <span>${resultado.pagoMensual}</span>
              </div>

              <div className="resultado-item">
                <span>Total a pagar:</span>
                <span>${resultado.totalPagar}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN NOSOTROS */}
      <section ref={nosotrosRef} className="section nosotros">
        <div className="nosotros-container">
          <h2 className="fade-in">Sobre Nosotros</h2>
          
          <div className="nosotros-grid">
            {/* Video iframe */}
            <div className="video-wrapper fade-in delay">
              <h3>¿Cómo funciona un crédito?</h3>
              <div className="video-container">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/LlG-5q7VSQI" 
                  title="¿Cómo funciona un crédito?"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="video-caption">
                Aprende los conceptos básicos de los créditos y cómo elegir el mejor para ti.
              </p>
            </div>

            {/* Texto de nosotros */}
            <div className="nosotros-text fade-in delay-2">
              <h3>Nuestra Historia</h3>
              <p>
                PFMex nació en 2026 con la misión de democratizar el acceso al crédito en México. 
                Creemos que todas las personas merecen oportunidades financieras justas y transparentes.
              </p>
              
              <h3>Nuestra Misión</h3>
              <p>
                Proporcionar soluciones financieras accesibles, rápidas y seguras que impulsen 
                los sueños y proyectos de nuestros clientes.
              </p>
              
              <h3>Nuestros Valores</h3>
              <ul>
                <li>Transparencia en cada proceso</li>
                <li>Compromiso con nuestros clientes</li>
                <li>Innovación constante</li>
                <li>Responsabilidad social</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

  {/* SECCIÓN CONTACTO */}
<section ref={contactoRef} className="section contacto">
  <div className="contacto-container">
    <h2 className="fade-in">Contáctanos</h2>
    
    <div className="contacto-grid">
      {/* Información de contacto */}
      <div className="contacto-info fade-in delay">
        <div className="info-item">
          <h3>📍 Dirección</h3>
          <p>Carretera Federal México Pachuca, Estado de México, CP 03100</p>
        </div>
        
        <div className="info-item">
          <h3>📞 Teléfono</h3>
          <p>5658690768</p>
        </div>
        
        <div className="info-item">
          <h3>✉️ Email</h3>
          <p>banco@pfmex.com</p>
        </div>
        
        <div className="info-item">
          <h3>🕒 Horario</h3>
          <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
          <p>Sábados: 10:00 AM - 2:00 PM</p>
        </div>
      </div>

      {/* Formulario de contacto con WhatsApp */}
      <div className="contacto-form fade-in delay-2">
        <h3>Contáctanos por WhatsApp</h3>
        
        <div className="form-group">
          <label>Nombre</label>
          <input 
            type="text" 
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Teléfono</label>
          <input 
            type="tel" 
            placeholder="55 1234 5678"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Mensaje</label>
          <select 
            value={mensajeSelect}
            onChange={(e) => setMensajeSelect(e.target.value)}
          >
            <option value="" disabled>Selecciona un mensaje</option>
            <option value="Hola, me interesa información sobre los préstamos personales">Información sobre préstamos personales</option>
            <option value="Hola, quisiera conocer los requisitos para un préstamo de negocio">Requisitos para préstamo de negocio</option>
            <option value="Hola, necesito ayuda con mi solicitud de crédito">Ayuda con mi solicitud</option>
            <option value="Hola, me gustaría saber las tasas de interés actuales">Tasas de interés</option>
            <option value="Hola, quiero saber el estado de mi solicitud">Estado de mi solicitud</option>
            <option value="Hola, tengo dudas sobre los plazos de pago">Dudas sobre plazos de pago</option>
            <option value="Otro">Otro mensaje</option>
          </select>
        </div>

        {mostrarOtroMensaje && (
          <div className="form-group">
            <label>Escribe tu mensaje</label>
            <textarea 
              rows="3" 
              placeholder="Escribe tu mensaje aquí..."
              value={otroMensaje}
              onChange={(e) => setOtroMensaje(e.target.value)}
            ></textarea>
          </div>
        )}
        
        <button 
          type="button" 
          className="btn-primary full" 
          onClick={enviarWhatsApp}
        >
          Enviar por WhatsApp
        </button>
      </div>
    </div>

    {/* Mapa */}
    <div className="mapa-container fade-in">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.241907232864!2d-98.98265012477874!3d19.702322481635424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ede97b7a236d%3A0x2f0274813819e530!2sUTTEC%20-%20Universidad%20Tecnol%C3%B3gica%20de%20Tec%C3%A1mac!5e0!3m2!1ses-419!2smx!4v1771835521169!5m2!1ses-419!2smx"
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: "12px" }}
        allowFullScreen=""
        loading="lazy"
        title="Ubicación PFMex"
      ></iframe>
    </div>
  </div>
</section>

      {/* MODAL */}
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

export default App;