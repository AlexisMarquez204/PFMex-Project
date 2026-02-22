package com.example.main.controller;

import com.example.main.Dao.DaoDatosPersonales;
import com.example.main.model.PojoDatosPersonales;
import com.example.main.model.PojoDireccion;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/datos-personales-completo")
public class DatosPersonalesController {

    private final DaoDatosPersonales dao = new DaoDatosPersonales();

    /**
     * Esta clase actúa como un contenedor (DTO) para recibir 
     * los dos objetos que enviamos desde el Frontend en una sola petición.
     */
    public static class RegistroCompletoDTO {
        private PojoDatosPersonales datosPersonales;
        private PojoDireccion direccion;

        // Getters y Setters para que Spring pueda mapear el JSON
        public PojoDatosPersonales getDatosPersonales() { return datosPersonales; }
        public void setDatosPersonales(PojoDatosPersonales datosPersonales) { this.datosPersonales = datosPersonales; }
        public PojoDireccion getDireccion() { return direccion; }
        public void setDireccion(PojoDireccion direccion) { this.direccion = direccion; }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crearRegistroCompleto(@RequestBody RegistroCompletoDTO payload) {
        Map<String, Object> respuesta = new HashMap<>();

        // Extraemos los POJOs del contenedor
        PojoDatosPersonales datosPersonales = payload.getDatosPersonales();
        PojoDireccion direccion = payload.getDireccion();

        // Validamos que los objetos no lleguen nulos
        if (datosPersonales == null || direccion == null) {
            respuesta.put("mensaje", "Error: Datos incompletos en la petición");
            return ResponseEntity.badRequest().body(respuesta);
        }

        // Llamamos al DAO para realizar la inserción de ambas tablas
        // Pasamos los objetos completos para mantener el código limpio
        boolean exito = dao.insertarRegistroCompleto(datosPersonales, direccion);

        if (exito) {
            respuesta.put("mensaje", "Información guardada correctamente en ambas tablas");
            return ResponseEntity.ok(respuesta);
        } else {
            respuesta.put("mensaje", "Error crítico al guardar en la base de datos");
            return ResponseEntity.status(500).body(respuesta);
        }
    }
}