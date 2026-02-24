package com.example.main.controller;

import com.example.main.Dao.DaoUsuarioLog;
import com.example.main.Dao.DaoUsuarioLog.UsuarioDB;
import com.example.main.model.PojoLogin;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ControlLogin {

    private final DaoUsuarioLog usuarioDao = new DaoUsuarioLog();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody PojoLogin req, HttpSession session) {

        if (req.email == null || req.password == null || req.email.isBlank() || req.password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Email y contraseña son requeridos"));
        }

        try {
            var user = usuarioDao.buscarPorEmail(req.email.trim());

            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("mensaje", "Credenciales inválidas"));
            }

            
            if (!req.password.equals(user.password)) {
                return ResponseEntity.status(401).body(Map.of("mensaje", "Credenciales inválidas"));
            }

            boolean perfilCompleto = usuarioDao.tieneDatosPersonales(user.id);
            String next = perfilCompleto ? "DASHBOARD" : "DATOS_PERSONALES";

            // Guardado de sesion
            Map<String, Object> usuario = new HashMap<>();
            usuario.put("id", user.id);
            usuario.put("email", user.email);
            session.setAttribute("USER", usuario);

            
            Map<String, Object> resp = new HashMap<>();
            resp.put("mensaje", "Login correcto");
            resp.put("usuario", usuario);
            resp.put("next", next);

            return ResponseEntity.ok(resp);

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error al consultar la BD"));
        }
    }

    //verificar sesión desde React
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object u = session.getAttribute("USER");
        if (u == null) return ResponseEntity.status(401).body(Map.of("mensaje", "No autenticado"));
        return ResponseEntity.ok(u);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada"));
    }
}