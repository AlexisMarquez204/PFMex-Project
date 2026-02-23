package com.example.main.controller;

import com.example.main.Dao.DaoDatosPersonales;
import com.example.main.model.PojoDatosPersonales;
import com.example.main.model.PojoDireccion;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/datos-personales-completo")
public class DatosPersonalesController {

    private final DaoDatosPersonales dao = new DaoDatosPersonales();

    public static class RegistroCompletoDTO {
        private PojoDatosPersonales datosPersonales;
        private PojoDireccion direccion;

        public PojoDatosPersonales getDatosPersonales() { return datosPersonales; }
        public void setDatosPersonales(PojoDatosPersonales datosPersonales) { this.datosPersonales = datosPersonales; }
        public PojoDireccion getDireccion() { return direccion; }
        public void setDireccion(PojoDireccion direccion) { this.direccion = direccion; }
    }

    @PostMapping
    public ResponseEntity<String> crearRegistroCompleto(@RequestBody RegistroCompletoDTO payload, HttpSession session) {

        Integer idUsuario = (Integer) session.getAttribute("idUsuario");
        if (idUsuario == null) {
            return ResponseEntity.status(401).body("No hay sesión activa. Debes registrarte primero.");
        }

        PojoDatosPersonales datosPersonales = payload.getDatosPersonales();
        PojoDireccion direccion = payload.getDireccion();

        if (datosPersonales == null || direccion == null) {
            return ResponseEntity.badRequest().body("Datos incompletos en la petición.");
        }

        datosPersonales.setId_usuario(idUsuario);
        direccion.setId_usuario(idUsuario);

        boolean exito = dao.insertarRegistroCompleto(datosPersonales, direccion);

        if (exito) {
            return ResponseEntity.ok("Información guardada correctamente en ambas tablas.");
        } else {
            return ResponseEntity.status(500).body("Error crítico al guardar en la base de datos.");
        }
    }
}