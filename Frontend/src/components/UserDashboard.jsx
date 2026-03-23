// src/components/UserDashboard.jsx
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useLocation } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  const location = useLocation();
  
  const [activeSection, setActiveSection] = useState("resumen");
  const [abonado, setAbonado] = useState(0);
  const [ultimoPago, setUltimoPago] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [copiado, setCopiado] = useState(false);
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [editandoTelefono, setEditandoTelefono] = useState(false);
  const [guardadoTelefono, setGuardadoTelefono] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState("");
  
  // Datos del usuario desde tabla datos_personales
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  
  // Datos de dirección
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [localizacion, setLocalizacion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [numeroDireccion, setNumeroDireccion] = useState("");
  
  // Datos del préstamo
  const [montoTotal, setMontoTotal] = useState(0);
  const [pagoMensual, setPagoMensual] = useState(0);
  const [tasaInteres, setTasaInteres] = useState(0);
  const [plazo, setPlazo] = useState(0);
  const [idPrestamo, setIdPrestamo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  
  const DESTINATARIO = "Prestamos Financieros MX SA";
  const CUENTA_FAKE = "012345678901234567";
  
  useEffect(() => {
    cargarDatos();
  }, []);
  
  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setMensajeTipo(tipo);
    setTimeout(() => {
      setMensaje("");
      setMensajeTipo("");
    }, 3000);
  };
  
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const sessionResponse = await fetch("http://localhost:8080/tipo-cuenta/sesion-usuario", {
        method: "GET",
        credentials: "include",
      });
      
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        const userId = sessionData.idUsuario;
        setIdUsuario(userId);
        
        await cargarDatosPersonales(userId);
        await cargarDatosPrestamo(userId);
      } else {
        mostrarMensaje("Error al obtener sesión", "error");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      mostrarMensaje("Error de conexión", "error");
    } finally {
      setCargando(false);
    }
  };
  
  const cargarDatosPersonales = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/datos-personales-completo/usuario/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const { datosPersonales, direccion } = data.data;
          
          if (datosPersonales) {
            setNombreUsuario(datosPersonales.nombre || "");
            setApellidoPaterno(datosPersonales.apellido_paterno || "");
            setApellidoMaterno(datosPersonales.apellido_materno || "");
            setTelefono(datosPersonales.telefono || "");
            setFechaNacimiento(datosPersonales.fecha_nacimiento || "");
            setEstadoCivil(datosPersonales.estado_civil || "");
          }
          
          if (direccion) {
            setProvincia(direccion.provincia || "");
            setCiudad(direccion.ciudad || "");
            setLocalizacion(direccion.localizacion || "");
            setCodigoPostal(direccion.codigo_postal || "");
            setNumeroDireccion(direccion.numero || "");
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar datos personales:", error);
    }
  };
  
  const cargarDatosPrestamo = async (userId) => {
    try {
      const prestamoResponse = await fetch(`http://localhost:8080/api/prestamos/ultimo?idUsuario=${userId}`, {
        method: "GET",
        credentials: "include",
      });
      
      if (prestamoResponse.ok) {
        const data = await prestamoResponse.json();
        if (data.success && data.data) {
          const prestamo = data.data;
          setMontoTotal(prestamo.montoAutorizado);
          setPagoMensual(prestamo.pagoMensual);
          setTasaInteres(prestamo.tasaInteres);
          setPlazo(prestamo.plazoMeses);
          setAbonado(prestamo.abonado || 0);
          setIdPrestamo(prestamo.id);
        }
      } else if (location.state) {
        setMontoTotal(location.state.montoAutorizado);
        setPagoMensual(location.state.pagoMensual);
        setTasaInteres(location.state.tasaInteres);
        setPlazo(location.state.plazo);
      }
    } catch (error) {
      console.error("Error al cargar préstamo:", error);
    }
  };
  
  const progreso = montoTotal > 0 ? Math.round((abonado / montoTotal) * 100) : 0;
  
  const calcularEstado = () => {
    if (abonado >= montoTotal) return "liquidado";
    if (!ultimoPago) return "pendiente";
    
    const hoy = new Date();
    const ultimo = new Date(ultimoPago);
    const meses = (hoy.getFullYear() - ultimo.getFullYear()) * 12 +
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
    return (hoy.getMonth() !== ultimo.getMonth() ||
            hoy.getFullYear() !== ultimo.getFullYear());
  };
  
  const generarPago = async () => {
    if (!puedePagar()) {
      mostrarMensaje("Ya pagaste este mes.", "error");
      return;
    }
    if (abonado >= montoTotal) {
      mostrarMensaje("Préstamo liquidado.", "error");
      return;
    }
    
    const fecha = new Date();
    
    try {
      const response = await fetch("http://localhost:8080/api/prestamos/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idPrestamo: idPrestamo,
          monto: pagoMensual
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAbonado(prev => prev + pagoMensual);
        setUltimoPago(fecha);
        setHistorial(prev => [
          { fecha: fecha.toLocaleDateString(), monto: pagoMensual },
          ...prev
        ]);
        mostrarMensaje("✅ Pago registrado correctamente", "success");
      } else {
        mostrarMensaje("❌ " + (data.mensaje || "Error al registrar pago"), "error");
      }
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("Error de conexión", "error");
    }
  };
  
  const copiarCuenta = () => {
    navigator.clipboard.writeText(CUENTA_FAKE);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    mostrarMensaje("Número de cuenta copiado", "success");
  };
  
  const guardarNumero = () => {
    if (numeroCuenta.length < 10) {
      mostrarMensaje("Número inválido", "error");
      return;
    }
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
    mostrarMensaje("Número actualizado correctamente", "success");
  };
  
  const guardarTelefono = async () => {
    if (telefono.length !== 10) {
      mostrarMensaje("El teléfono debe tener 10 dígitos", "error");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8080/datos-personales-completo/telefono", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ telefono: telefono })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setEditandoTelefono(false);
        setGuardadoTelefono(true);
        setTimeout(() => setGuardadoTelefono(false), 2000);
        mostrarMensaje("✅ Teléfono actualizado correctamente", "success");
      } else {
        mostrarMensaje("❌ " + (data.mensaje || "Error al actualizar teléfono"), "error");
      }
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("Error de conexión", "error");
    }
  };
  
  const data = [
    { name: "Pagado", value: progreso },
    { name: "Restante", value: 100 - progreso }
  ];
  
  const COLORS = ["#2563eb", "#e5e7eb"];
  
  // Nombre en mayúsculas para la bienvenida
  const nombreBienvenida = `${nombreUsuario} ${apellidoPaterno}`.trim().toUpperCase();
  const nombreCompleto = `${nombreUsuario} ${apellidoPaterno} ${apellidoMaterno}`.trim();
  
  if (cargando) {
    return (
      <div className="layout">
        <aside className="sidebar">
          <div className="brand">PFMex</div>
          <nav>
            <button className="active">Resumen</button>
            <button>Pagar</button>
            <button>Historial</button>
            <button>Perfil</button>
          </nav>
        </aside>
        <main className="main">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div className="spinner"></div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="layout">
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
      
      <main className="main">
        <header className="topbar">
          <h1>BIENVENIDO {nombreBienvenida || "USUARIO"}</h1>
          <p className="welcome-text">
            Gestiona tu préstamo de forma sencilla y segura.
          </p>
        </header>
        
        {mensaje && (
          <div className={`floating-message ${mensajeTipo}`}>
            {mensaje}
          </div>
        )}
        
        <div className="container">
          {activeSection === "resumen" && (
            <div className="dashboard-grid">
              <div className="card chart-card">
                <div>
                  <span className="label">Monto total</span>
                  <h2>${montoTotal.toLocaleString()} MXN</h2>
                  <p>{progreso}% pagado</p>
                  <p className="small-text">Plazo: {plazo} meses | Tasa: {tasaInteres}%</p>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={data} innerRadius={55} outerRadius={75} dataKey="value" stroke="none">
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
                <p className="small-text">Pago mensual: ${pagoMensual.toLocaleString()} MXN</p>
                <p className="small-text">Abonado: ${abonado.toLocaleString()} MXN</p>
              </div>
            </div>
          )}
          
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
                    <button onClick={copiarCuenta}>{copiado ? "Copiado" : "Copiar"}</button>
                  </div>
                </div>
                <div className="info-row">
                  <span>Concepto:</span>
                  <strong>Pago mensual préstamo</strong>
                </div>
                <div className="info-row">
                  <span>Monto:</span>
                  <strong>${pagoMensual.toLocaleString()} MXN</strong>
                </div>
                <div className="info-row">
                  <span>Saldo restante:</span>
                  <strong>${(montoTotal - abonado).toLocaleString()} MXN</strong>
                </div>
              </div>
              <button 
                className="pay-button" 
                disabled={!puedePagar() || abonado >= montoTotal} 
                onClick={generarPago}
              >
                {abonado >= montoTotal ? "Préstamo Liquidado" : "Generar abono"}
              </button>
            </div>
          )}
          
          {activeSection === "historial" && (
            <div className="history-card">
              <h2>Historial de pagos</h2>
              {historial.length === 0 && <p>No hay pagos registrados.</p>}
              {historial.map((item, index) => (
                <div key={index} className="history-row">
                  <span>{item.fecha}</span>
                  <strong>${item.monto.toLocaleString()} MXN</strong>
                </div>
              ))}
            </div>
          )}
          
          {activeSection === "perfil" && (
            <div className="profile-card">
              <h2>Datos personales</h2>
              <div className="form-view">
                <div className="field">
                  <label>Nombre</label>
                  <input value={nombreUsuario} disabled />
                </div>
                <div className="field">
                  <label>Apellido paterno</label>
                  <input value={apellidoPaterno} disabled />
                </div>
                <div className="field">
                  <label>Apellido materno</label>
                  <input value={apellidoMaterno} disabled />
                </div>
                <div className="field">
                  <label>Fecha de nacimiento</label>
                  <input value={fechaNacimiento} disabled />
                </div>
                <div className="field">
                  <label>Estado civil</label>
                  <input value={estadoCivil} disabled />
                </div>
                <div className="field">
                  <label>Teléfono</label>
                  {editandoTelefono ? (
                    <div className="edit-row">
                      <input 
                        value={telefono} 
                        maxLength="10" 
                        onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))} 
                      />
                      <button onClick={guardarTelefono}>Guardar</button>
                    </div>
                  ) : (
                    <div className="edit-row">
                      <input value={telefono} disabled />
                      <button onClick={() => setEditandoTelefono(true)}>Editar</button>
                    </div>
                  )}
                </div>
              </div>
              {guardadoTelefono && <div className="success-message">Teléfono actualizado correctamente</div>}
              
              <hr />
              <h2>Dirección</h2>
              <div className="form-view">
                <div className="field">
                  <label>Provincia/Estado</label>
                  <input value={provincia} disabled />
                </div>
                <div className="field">
                  <label>Ciudad</label>
                  <input value={ciudad} disabled />
                </div>
                <div className="field">
                  <label>Calle y localización</label>
                  <input value={localizacion} disabled />
                </div>
                <div className="field">
                  <label>Número exterior</label>
                  <input value={numeroDireccion} disabled />
                </div>
                <div className="field">
                  <label>Código postal</label>
                  <input value={codigoPostal} disabled />
                </div>
              </div>
              
              <hr />
              <h2>Datos de depósito</h2>
              <div className="form-view">
                <div className="field">
                  <label>Banco</label>
                  <input value="BBVA" disabled />
                </div>
                <div className="field">
                  <label>Tipo de cuenta</label>
                  <input value="Cuenta de débito" disabled />
                </div>
                <div className="field">
                  <label>Número de cuenta</label>
                  {editando ? (
                    <div className="edit-row">
                      <input value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value)} />
                      <button onClick={guardarNumero}>Guardar</button>
                    </div>
                  ) : (
                    <div className="edit-row">
                      <input value={numeroCuenta || "442123456789012345"} disabled />
                      <button onClick={() => setEditando(true)}>Editar</button>
                    </div>
                  )}
                </div>
              </div>
              {guardado && <div className="success-message">Número actualizado correctamente</div>}
            </div>
          )}
        </div>
      </main>
      
      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #2DC653;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .floating-message {
          position: fixed;
          top: 80px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .floating-message.success {
          background: #2DC653;
          color: white;
        }
        
        .floating-message.error {
          background: #dc3545;
          color: white;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .success-message {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 10px;
          border-radius: 8px;
          margin-top: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default UserDashboard;