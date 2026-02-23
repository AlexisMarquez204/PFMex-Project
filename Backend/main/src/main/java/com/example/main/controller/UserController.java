package com.example.main.controller;

import com.example.main.Dao.DaoUserData;
import com.example.main.model.PojoUserData;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/usuarios")
public class UserController {
    // src/main/java/com/example/main/controller/UserController.java

@GetMapping("/sesion-usuario")
public ResponseEntity<?> obtenerIdUsuario(HttpSession session) {
    Integer idUsuario = (Integer) session.getAttribute("idUsuario");
    if (idUsuario == null) {
        return ResponseEntity.status(401).body("No hay sesión activa. Por favor regístrate primero.");
    }
    // Devuelve un JSON con el ID del usuario
    return ResponseEntity.ok(Map.of("idUsuario", idUsuario));
}

    private final DaoUserData dao = new DaoUserData();

    @PostMapping
    public ResponseEntity<String> registrarUsuario(@RequestBody PojoUserData usuario, HttpSession session) {
        int idUsuario = dao.UploadDataUserAndReturnId(usuario.getEmail(), usuario.getPassword(), usuario.getState());

        if (idUsuario > 0) {
            session.setAttribute("idUsuario", idUsuario);
            return ResponseEntity.ok("Registro exitoso, ID guardado en sesión.");
        } else {
            return ResponseEntity.status(500).body("Error al registrar el usuario.");
        }
    }
}