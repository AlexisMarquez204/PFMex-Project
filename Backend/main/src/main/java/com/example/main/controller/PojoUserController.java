package com.example.main.controller;

import com.example.main.Dao.DaoUserData;
import com.example.main.model.PojoUserData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/usuarios")
public class PojoUserController {

    private final DaoUserData dao = new DaoUserData();

    @PostMapping
    public ResponseEntity<Map<String, Object>> crearUsuario(@RequestBody PojoUserData nuevoUsuario) {
        Map<String, Object> respuesta = new HashMap<>();

        int idGenerado = dao.insertarUsuario(
            nuevoUsuario.getEmail(),
            nuevoUsuario.getPassword(),
            nuevoUsuario.getState()
        );

        if (idGenerado > 0) {
            respuesta.put("id",      idGenerado);
            respuesta.put("mensaje", "Usuario registrado correctamente");
            return ResponseEntity.ok(respuesta);
        } else {
            respuesta.put("id",      -1);
            respuesta.put("mensaje", "Error al registrar usuario");
            return ResponseEntity.status(500).body(respuesta);
        }
    }
}
