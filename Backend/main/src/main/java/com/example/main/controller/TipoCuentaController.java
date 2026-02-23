package com.example.main.controller;

import com.example.main.Dao.DaoTipoCuenta;
import com.example.main.model.PojoTipoCuenta;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/tipo-cuenta")
public class TipoCuentaController {

    private final DaoTipoCuenta dao = new DaoTipoCuenta();

    @GetMapping("/sesion-usuario")
    public ResponseEntity<?> obtenerIdUsuario(HttpSession session) {
        try {
            System.out.println("📌 TipoCuenta - Solicitando ID de usuario");
            Integer idUsuario = (Integer) session.getAttribute("idUsuario");
            System.out.println("📌 ID encontrado: " + idUsuario);

            if (idUsuario != null) {
                Map<String, Integer> response = new HashMap<>();
                response.put("idUsuario", idUsuario);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(Map.of("mensaje", "No hay sesión activa"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/completo")
    public ResponseEntity<String> guardarTipoCuenta(@RequestBody PojoTipoCuenta payload, HttpSession session) {
        try {
            System.out.println("\n=== TIPOCUENTA: Guardando datos ===");
            
            Integer idUsuario = (Integer) session.getAttribute("idUsuario");
            if (idUsuario == null) {
                return ResponseEntity.status(401).body("No hay sesión activa");
            }

            payload.setIdUsuario(idUsuario);
            
            System.out.println("ID Usuario: " + payload.getIdUsuario());
            System.out.println("Tipo Cuenta: " + payload.getTipoCuenta());
            
            boolean exito = dao.insertarTipoCuenta(payload);
            
            if (exito) {
                System.out.println("✅ Datos guardados correctamente");
                return ResponseEntity.ok("Datos de cuenta guardados correctamente");
            } else {
                System.out.println("❌ Error al guardar en BD");
                return ResponseEntity.status(500).body("Error al guardar en la base de datos");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }
}