import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

import "./UserDashboard.css";

function UserDashboard() {

  const MONTO_TOTAL = 15000;
  const PAGO_MENSUAL = 1500;
  const DESTINATARIO = "Prestamos Financieros MX SA";
  const CUENTA_FAKE = "012345678901234567";

  const [activeSection, setActiveSection] = useState("resumen");
  const [abonado, setAbonado] = useState(0);
  const [ultimoPago, setUltimoPago] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [copiado, setCopiado] = useState(false);

  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
const [nombreUsuario, setNombreUsuario] = useState("Alexis Marquez");
const [correoUsuario, setCorreoUsuario] = useState("alexis@email.com");
const [celular, setCelular] = useState("5512345678");
const [editandoCelular, setEditandoCelular] = useState(false);
const [guardadoCelular, setGuardadoCelular] = useState(false);

  /* --------- CARGAR DATOS --------- */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("prestamoData"));
    if (data) {
      setAbonado(data.abonado || 0);
      setUltimoPago(data.ultimoPago || null);
      setHistorial(data.historial || []);
      setNumeroCuenta(data.numeroCuenta || "442123456789012345");
    } else {
      setNumeroCuenta("442123456789012345");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("prestamoData", JSON.stringify({
  abonado,
  ultimoPago,
  historial,
  numeroCuenta,
  nombreUsuario,
  correoUsuario,
  celular
}));
}, [abonado, ultimoPago, historial, numeroCuenta, nombreUsuario, correoUsuario, celular]);

  /* --------- ESTADO --------- */

  const progreso = Math.round((abonado / MONTO_TOTAL) * 100);

  const calcularEstado = () => {
    if (abonado >= MONTO_TOTAL) return "liquidado";
    if (!ultimoPago) return "pendiente";

    const hoy = new Date();
    const ultimo = new Date(ultimoPago);

    const meses =
      (hoy.getFullYear() - ultimo.getFullYear()) * 12 +
      (hoy.getMonth() - ultimo.getMonth());

    if (meses === 0) return "activo";
    if (meses === 1) return "pendiente";
    return "atrasado";
  };

  const estado = calcularEstado();

  const puedePagar = () => {
    if (!ultimoPago) return true;
    const hoy = new Date();
    const ultimo = new Date(ultimoPago);
    return (
      hoy.getMonth() !== ultimo.getMonth() ||
      hoy.getFullYear() !== ultimo.getFullYear()
    );
  };

  const generarPago = () => {
    if (!puedePagar()) return alert("Ya pagaste este mes.");
    if (abonado >= MONTO_TOTAL) return alert("Préstamo liquidado.");

    const fecha = new Date();

    setAbonado(prev => prev + PAGO_MENSUAL);
    setUltimoPago(fecha);

    setHistorial(prev => [
      {
        fecha: fecha.toLocaleDateString(),
        monto: PAGO_MENSUAL
      },
      ...prev
    ]);
  };

  const copiarCuenta = () => {
    navigator.clipboard.writeText(CUENTA_FAKE);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const guardarNumero = () => {
    if (numeroCuenta.length < 10) return alert("Número inválido");
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };
  const guardarCelular = () => {
  if (celular.length !== 10)
    return alert("El celular debe tener 10 dígitos");

  setEditandoCelular(false);
  setGuardadoCelular(true);
  setTimeout(() => setGuardadoCelular(false), 2000);
};

  const data = [
    { name: "Pagado", value: progreso },
    { name: "Restante", value: 100 - progreso }
  ];

  const COLORS = ["#2563eb", "#e5e7eb"];

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">PFMex</div>

        <nav>
          <button onClick={() => setActiveSection("resumen")} className={activeSection === "resumen" ? "active" : ""}>
            Resumen
          </button>

          <button onClick={() => setActiveSection("pago")} className={activeSection === "pago" ? "active" : ""}>
            Pagar
          </button>

          <button onClick={() => setActiveSection("historial")} className={activeSection === "historial" ? "active" : ""}>
            Historial
          </button>

          <button onClick={() => setActiveSection("perfil")} className={activeSection === "perfil" ? "active" : ""}>
            Perfil
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main">

        <header className="topbar">
          <h1>Bienvenido 👋</h1>
          <p className="welcome-text">
            Gestiona tu préstamo de forma sencilla y segura.
          </p>
        </header>

        <div className="container">

          {/* RESUMEN */}
          {activeSection === "resumen" && (
            <div className="dashboard-grid">

              <div className="card chart-card">
                <div>
                  <span className="label">Monto total</span>
                  <h2>${MONTO_TOTAL.toLocaleString()} MXN</h2>
                  <p>{progreso}% pagado</p>
                </div>

                <div className="chart-box">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={data}
                        innerRadius={55}
                        outerRadius={75}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="center-number">{progreso}%</div>
                </div>
              </div>

              <div className={`card status-card ${estado}`}>
                <span className="label">Estado</span>
                <h3>
                  {estado === "activo" && "Activo"}
                  {estado === "pendiente" && "Pendiente"}
                  {estado === "atrasado" && "Atrasado"}
                  {estado === "liquidado" && "Liquidado"}
                </h3>
              </div>

            </div>
          )}

          {/* PAGO */}
          {activeSection === "pago" && (
            <div className="payment-card">
              <h2>Datos para realizar el pago</h2>

              <div className="payment-info">
                <div className="info-row">
                  <span>Destinatario:</span>
                  <strong>{DESTINATARIO}</strong>
                </div>

                <div className="info-row">
                  <span>Número de cuenta:</span>
                  <div className="copy-box">
                    <strong>{CUENTA_FAKE}</strong>
                    <button onClick={copiarCuenta}>
                      {copiado ? "Copiado ✔" : "Copiar"}
                    </button>
                  </div>
                </div>

                <div className="info-row">
                  <span>Concepto:</span>
                  <strong>Pago mensual préstamo</strong>
                </div>

                <div className="info-row">
                  <span>Monto:</span>
                  <strong>${PAGO_MENSUAL.toLocaleString()} MXN</strong>
                </div>
              </div>

              <button
                className="pay-button"
                disabled={!puedePagar() || abonado >= MONTO_TOTAL}
                onClick={generarPago}
              >
                Generar abono
              </button>
            </div>
          )}

          {/* HISTORIAL */}
          {activeSection === "historial" && (
            <div className="history-card">
              <h2>Historial de pagos</h2>

              {historial.length === 0 && (
                <p>No hay pagos registrados.</p>
              )}

              {historial.map((item, index) => (
                <div key={index} className="history-row">
                  <span>{item.fecha}</span>
                  <strong>${item.monto.toLocaleString()} MXN</strong>
                </div>
              ))}
            </div>
          )}

          {/* PERFIL */}
          {activeSection === "perfil" && (
            <div className="profile-card">
              <h2>Datos de depósito</h2>

              <div className="form-view">

                <div className="field">
                  <label>Banco</label>
                  <input value="BBVA" disabled />
                </div>

                <div className="field">
                  <label>Tipo</label>
                  <input value="Cuenta" disabled />
                </div>

                <div className="field">
                  <label>Número de cuenta / tarjeta</label>

                  {editando ? (
                    <div className="edit-row">
                      <input
                        value={numeroCuenta}
                        onChange={(e) => setNumeroCuenta(e.target.value)}
                      />
                      <button onClick={guardarNumero}>
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="edit-row">
                      <input value={numeroCuenta} disabled />
                      <button onClick={() => setEditando(true)}>
                        Editar
                      </button>
                    </div>
                  )}
                </div>

                <div className="field">
                  <label>Motivo</label>
                  <textarea value="Gastos personales" disabled />
                </div>

              </div>

              {guardado && (
                <div className="success-message">
                  Número actualizado correctamente ✔
                </div>
              )}
              <hr />

<h2>Datos personales</h2>

<div className="form-view">

  <div className="field">
    <label>Nombre de usuario</label>
    <input value={nombreUsuario} disabled />
  </div>

  <div className="field">
    <label>Correo</label>
    <input value={correoUsuario} disabled />
  </div>

  <div className="field">
    <label>Número celular</label>

    {editandoCelular ? (
      <div className="edit-row">
        <input
          value={celular}
          maxLength="10"
          onChange={(e) =>
            setCelular(e.target.value.replace(/\D/g, ""))
          }
        />
        <button onClick={guardarCelular}>
          Guardar
        </button>
      </div>
    ) : (
      <div className="edit-row">
        <input value={celular} disabled />
        <button onClick={() => setEditandoCelular(true)}>
          Editar
        </button>
      </div>
    )}
  </div>

</div>

{guardadoCelular && (
  <div className="success-message">
    Celular actualizado correctamente ✔
  </div>
)}
            </div>
          )}
            
        </div>
        
      </main>
    </div>
  );
}

export default UserDashboard;