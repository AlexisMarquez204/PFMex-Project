import { useRef, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [navColor, setNavColor] = useState("blue");

  const heroRef = useRef(null);
  const nosotrosRef = useRef(null);
  const contactoRef = useRef(null);

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
            const section = sections.find((s) => s.ref.current === entry.target);
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
        if (section.ref.current) observer.unobserve(section.ref.current);
      });
    };
  }, []);

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className={`navbar ${navColor === "blue" ? "navbar-blue" : "navbar-white"}`}>
        <div className="logo">PFMex</div>
        <ul className="nav-links">
          <li onClick={() => heroRef.current.scrollIntoView({ behavior: "smooth" })}>Inicio</li>
          <li onClick={() => nosotrosRef.current.scrollIntoView({ behavior: "smooth" })}>Nosotros</li>
          <li onClick={() => contactoRef.current.scrollIntoView({ behavior: "smooth" })}>Contacto</li>
        </ul>
        <div className="nav-buttons">
          <button className={`btn-outline ${navColor === "white" ? "btn-dark" : ""}`}>Login</button>
          <button className="btn-primary">Solicitar préstamo</button>
        </div>
      </nav>

      {/* HERO / SIMULADOR */}
      <section ref={heroRef} className="section hero">
        <div className="hero-text fade-in">
          <h1>Préstamos rápidos y seguros</h1>
          <p>Obtén financiamiento en minutos con tasas competitivas y aprobación digital.</p>
          <button className="btn-primary large">Simular préstamo</button>
        </div>
        <div className="loan-card fade-in delay">
          <h3>Simula tu préstamo</h3>
          <label>Monto</label>
          <input type="number" placeholder="$10,000" />
          <label>Plazo (meses)</label>
          <input type="number" placeholder="12" />
          <button className="btn-primary full">Calcular</button>
        </div>
      </section>

      {/* NOSOTROS */}
      <section ref={nosotrosRef} className="section nosotros">
        <h1 className="fade-in">Nosotros</h1>
        <p className="fade-in delay">
          BancoPF es líder en soluciones financieras digitales. Nuestra misión es brindar
          acceso rápido y seguro a préstamos personales y para negocios.
        </p>
        <div className="nosotros-content fade-in delay-2">
          <h2>Nuestros valores</h2>
          <ul>
            <li>Transparencia en cada operación</li>
            <li>Rapidez en la aprobación de préstamos</li>
            <li>Seguridad de tus datos y operaciones</li>
            <li>Atención personalizada y soporte 24/7</li>
          </ul>
          <h2>Nuestra historia</h2>
          <p>
            Desde 2015, BancoPF ha ayudado a miles de clientes a cumplir sus metas
            financieras, ofreciendo soluciones digitales innovadoras y confiables.
          </p>
        </div>
      </section>

      {/* CONTACTO */}
      <section ref={contactoRef} className="section contacto">
        <h1 className="fade-in">Contacto</h1>
        <p className="fade-in delay">
          Escríbenos a contacto@bancopf.com o llámanos al +1 555 123 4567.
        </p>
        <div className="contacto-content fade-in delay-2">
          <h2>Ubicación</h2>
          <p>Calle Principal 123, Ciudad Financiera, País</p>
          <h2>Redes sociales</h2>
          <ul>
            <li>Facebook: /BancoPF</li>
            <li>Twitter: @BancoPF</li>
            <li>LinkedIn: /company/BancoPF</li>
          </ul>
          <h2>Horario de atención</h2>
          <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
        </div>
      </section>
    </div>
  );
}

export default App;
