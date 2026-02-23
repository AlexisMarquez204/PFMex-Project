package com.example.main.controller;

import com.example.main.Dao.DaoSocioeconomicoCompleto;
import com.example.main.Dao.DaoTipoCuenta;
import com.example.main.model.PojoSocioeconomicoCompleto;
import com.example.main.model.PojoTipoCuenta;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/socioeconomico")
public class SocioeconomicoController {

    private final DaoSocioeconomicoCompleto dao = new DaoSocioeconomicoCompleto();

    @GetMapping("/sesion-usuario")
    public ResponseEntity<?> obtenerIdUsuario(HttpSession session) {
        Integer idUsuario = (Integer) session.getAttribute("idUsuario");
        System.out.println("📌 Sesión - ID: " + idUsuario + ", SessionID: " + session.getId());
        
        if (idUsuario != null) {
            return ResponseEntity.ok(Map.of("idUsuario", idUsuario));
        } else {
            return ResponseEntity.status(401).body(Map.of("mensaje", "No hay sesión activa"));
        }
    }

    @PostMapping("/completo")
    public ResponseEntity<String> guardarSocioeconomico(@RequestBody PojoSocioeconomicoCompleto payload, HttpSession session) {
        
        System.out.println("\n=== NUEVA SOLICITUD /completo ===");
        System.out.println("📦 Payload recibido:");
        System.out.println("  - idUsuario: " + payload.getIdUsuario());
        System.out.println("  - nivelEstudios: " + payload.getNivelEstudios());
        System.out.println("  - situacionLaboral: " + payload.getSituacionLaboral());
        System.out.println("  - ingresoMensual: " + payload.getIngresoMensual());
        System.out.println("  - mesesLaborando: " + payload.getMesesLaborando());
        System.out.println("  - otrasDeudas: " + payload.getOtrasDeudas());
        System.out.println("  - gastosMensuales: " + payload.getGastosMensuales());
        
        // 1. Verificar sesión
        Integer idUsuario = (Integer) session.getAttribute("idUsuario");
        System.out.println("🔐 Sesión - ID en sesión: " + idUsuario);
        
        if (idUsuario == null) {
            System.out.println("❌ Error: No hay sesión activa");
            return ResponseEntity.status(401).body("No hay sesión activa.");
        }

        // 2. Verificar IDs
        if (payload.getIdUsuario() != idUsuario) {
            System.out.println("❌ Error: ID no coincide - Payload: " + payload.getIdUsuario() + ", Sesión: " + idUsuario);
            return ResponseEntity.status(403).body("ID de usuario no coincide.");
        }

        // 3. Validar campos obligatorios
        if (payload.getNivelEstudios() == null || payload.getNivelEstudios().trim().isEmpty()) {
            System.out.println("❌ Error: nivelEstudios vacío");
            return ResponseEntity.badRequest().body("El nivel de estudios es obligatorio.");
        }
        
        if (payload.getSituacionLaboral() == null || payload.getSituacionLaboral().trim().isEmpty()) {
            System.out.println("❌ Error: situacionLaboral vacío");
            return ResponseEntity.badRequest().body("La situación laboral es obligatoria.");
        }

        // 4. Guardar en base de datos
        System.out.println("💾 Intentando guardar en BD...");
        boolean exito = dao.insertarSocioeconomico(payload);

        if (exito) {
            System.out.println("✅ Éxito: Datos guardados correctamente");
            return ResponseEntity.ok("Datos socioeconómicos guardados correctamente.");
        } else {
            System.out.println("❌ Error: Falló la inserción en BD");
            return ResponseEntity.status(500).body("Error al guardar en la base de datos.");
        }
    }
    
}