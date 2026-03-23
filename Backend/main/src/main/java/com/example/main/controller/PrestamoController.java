package com.example.main.controller;

import com.example.main.Dao.DaoPrestamo;
import com.example.main.model.PojoPrestamo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/prestamos")
public class PrestamoController {

    private final DaoPrestamo dao = new DaoPrestamo();

    @PostMapping("/crear")
    public ResponseEntity<?> crearPrestamo(@RequestBody PojoPrestamo payload, HttpSession session) {
        
        System.out.println("\n=== POST /api/prestamos/crear ===");
        
        try {
            // 1. Verificar sesión
            Integer idUsuario = (Integer) session.getAttribute("idUsuario");
            System.out.println("🔐 ID en sesión: " + idUsuario);
            
            if (idUsuario == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("mensaje", "No hay sesión activa");
                return ResponseEntity.status(401).body(error);
            }
            
            // 2. Asignar ID de usuario
            payload.setIdUsuario(idUsuario);
            
            // 3. Validar datos
            if (payload.getMontoAutorizado() == null || payload.getMontoAutorizado() <= 0) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("mensaje", "Monto inválido");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (payload.getTasaInteres() == null || payload.getTasaInteres() <= 0) {
                payload.setTasaInteres(12.0);
            }
            
            if (payload.getPlazoMeses() == null || payload.getPlazoMeses() <= 0) {
                payload.setPlazoMeses(12);
            }
            
            // 4. Guardar en BD
            System.out.println("💾 Guardando préstamo...");
            boolean exito = dao.insertarPrestamo(payload);
            
            if (exito) {
                System.out.println("✅ Préstamo guardado - ID: " + payload.getId());
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("mensaje", "Préstamo creado exitosamente");
                response.put("data", payload);
                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Error al guardar");
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("mensaje", "Error al guardar en la base de datos");
                return ResponseEntity.status(500).body(error);
            }
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/ultimo")
    public ResponseEntity<?> obtenerUltimoPrestamo(@RequestParam Integer idUsuario, HttpSession session) {
        
        System.out.println("\n=== GET /api/prestamos/ultimo ===");
        System.out.println("📌 ID Usuario: " + idUsuario);
        
        try {
            // Verificar sesión
            Integer idSesion = (Integer) session.getAttribute("idUsuario");
            if (idSesion == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "mensaje", "No hay sesión activa"));
            }
            
            // Verificar autorización
            if (!idUsuario.equals(idSesion)) {
                return ResponseEntity.status(403).body(Map.of("success", false, "mensaje", "No autorizado"));
            }
            
            // Obtener préstamo
            PojoPrestamo prestamo = dao.obtenerUltimoPrestamoPorUsuario(idUsuario);
            
            if (prestamo != null) {
                System.out.println("✅ Préstamo encontrado - ID: " + prestamo.getId() + 
                                 ", Monto: " + prestamo.getMontoAutorizado());
                return ResponseEntity.ok(Map.of("success", true, "data", prestamo));
            } else {
                System.out.println("⚠️ No hay préstamos para el usuario");
                return ResponseEntity.ok(Map.of("success", false, "mensaje", "No hay préstamos registrados"));
            }
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "mensaje", e.getMessage()));
        }
    }
    
    @GetMapping("/usuario")
    public ResponseEntity<?> obtenerPrestamosPorUsuario(@RequestParam Integer idUsuario, HttpSession session) {
        
        System.out.println("\n=== GET /api/prestamos/usuario ===");
        
        try {
            Integer idSesion = (Integer) session.getAttribute("idUsuario");
            if (idSesion == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "mensaje", "No hay sesión activa"));
            }
            
            if (!idUsuario.equals(idSesion)) {
                return ResponseEntity.status(403).body(Map.of("success", false, "mensaje", "No autorizado"));
            }
            
            java.util.List<PojoPrestamo> prestamos = dao.obtenerPrestamosPorUsuario(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", prestamos);
            response.put("total", prestamos.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "mensaje", e.getMessage()));
        }
    }
    
    @PostMapping("/pagar")
    public ResponseEntity<?> registrarPago(@RequestBody Map<String, Object> payload, HttpSession session) {
        
        System.out.println("\n=== POST /api/prestamos/pagar ===");
        
        try {
            // Verificar sesión
            Integer idSesion = (Integer) session.getAttribute("idUsuario");
            if (idSesion == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "mensaje", "No hay sesión activa"));
            }
            
            // Obtener datos del pago
            Integer idPrestamo = ((Number) payload.get("idPrestamo")).intValue();
            Double monto = ((Number) payload.get("monto")).doubleValue();
            
            System.out.println("💰 Pagando préstamo " + idPrestamo + " - Monto: " + monto);
            
            // Verificar que el préstamo existe y pertenece al usuario
            PojoPrestamo prestamo = dao.obtenerPrestamoPorId(idPrestamo);
            if (prestamo == null) {
                return ResponseEntity.status(404).body(Map.of("success", false, "mensaje", "Préstamo no encontrado"));
            }
            
            if (!prestamo.getIdUsuario().equals(idSesion)) {
                return ResponseEntity.status(403).body(Map.of("success", false, "mensaje", "No autorizado"));
            }
            
            // Registrar pago
            boolean exito = dao.registrarPago(idPrestamo, monto);
            
            if (exito) {
                System.out.println("✅ Pago registrado exitosamente");
                return ResponseEntity.ok(Map.of("success", true, "mensaje", "Pago registrado correctamente"));
            } else {
                System.out.println("❌ Error al registrar pago");
                return ResponseEntity.status(500).body(Map.of("success", false, "mensaje", "Error al registrar pago"));
            }
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "mensaje", e.getMessage()));
        }
    }
}