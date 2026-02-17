package com.example.main.controller;

import com.example.main.Dao.DaoUserData;
import com.example.main.model.PojoUserData;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/usuarios")
public class PojoUserController {

    private final DaoUserData dao = new DaoUserData();

    @PostMapping
    public String crearUsuario(@RequestBody PojoUserData nuevoUsuario) {
        boolean exito = dao.UploadDataUser(
            nuevoUsuario.getEmail(),
            nuevoUsuario.getPassword(),
            nuevoUsuario.getState()
        );

        if (exito) {
            return "Usuario registrado correctamente";
        } else {
            return "Error al registrar usuario";
        }
    }
}
