import "./Login.css";
import imagen from "../assets/usuario.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      
      
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
      </div>

   
      <div className="login-card">

        <img src={imagen} alt="Imagen" className="login-top-image" />

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Contraseña" />

        <button className="btn-access">
          Acceso
        </button>

        <button 
          className="btn-register"
          onClick={() => navigate("/formulario")}
          >
          ¿No tienes cuenta?
        </button>

      </div>
    </div>
  );
}

export default Login;
