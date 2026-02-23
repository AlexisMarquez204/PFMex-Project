import { useRef, useEffect, useState } from "react";
import React from "react";
import "./App.css";
import Formulario from "./components/FormPersonalData";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const [navColor, setNavColor] = useState("blue");

  const [tipoPrestamo, setTipoPrestamo] = useState("personal");
  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState("");
  const [errorMonto, setErrorMonto] = useState("");
  const [resultado, setResultado] = useState(null);

  // 🔥 ESTADOS DEL MODAL
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

  // 🔥 FUNCIONES DEL MODAL
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