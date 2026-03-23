package com.example.main.controller;

import com.example.main.Dao.DaoDatosPersonales;
import com.example.main.model.PojoDatosPersonales;
import com.example.main.model.PojoDireccion;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

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
    
    // Nuevo endpoint GET para obtener datos personales
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerDatosPersonales(@PathVariable Integer idUsuario, HttpSession session) {
        
        System.out.println("\n=== GET /datos-personales-completo/usuario/" + idUsuario + " ===");
        
        try {
            Integer idSesion = (Integer) session.getAttribute("idUsuario");
            if (idSesion == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "mensaje", "No hay sesión activa"));
            }
            
            if (!idUsuario.equals(idSesion)) {
                return ResponseEntity.status(403).body(Map.of("success", false, "mensaje", "No autorizado"));
            }
            
            Map<String, Object> datos = dao.obtenerDatosCompletosPorUsuario(idUsuario);
            
            if (!datos.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", datos);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body(Map.of("success", false, "mensaje", "Datos no encontrados"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "mensaje", e.getMessage()));
        }
    }
    
    // Endpoint para actualizar teléfono
    @PutMapping("/telefono")
    public ResponseEntity<?> actualizarTelefono(@RequestBody Map<String, String> payload, HttpSession session) {
        
        System.out.println("\n=== PUT /datos-personales-completo/telefono ===");
        
        try {
            Integer idSesion = (Integer) session.getAttribute("idUsuario");
            if (idSesion == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "mensaje", "No hay sesión activa"));
            }
            
            String telefono = payload.get("telefono");
            if (telefono == null || telefono.length() != 10) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "mensaje", "Teléfono inválido"));
            }
            
            boolean exito = dao.actualizarTelefono(idSesion, telefono);
            
            if (exito) {
                return ResponseEntity.ok(Map.of("success", true, "mensaje", "Teléfono actualizado correctamente"));
            } else {
                return ResponseEntity.status(500).body(Map.of("success", false, "mensaje", "Error al actualizar teléfono"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "mensaje", e.getMessage()));
        }
    }
}