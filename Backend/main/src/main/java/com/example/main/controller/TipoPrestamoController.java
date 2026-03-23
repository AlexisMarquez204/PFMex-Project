package com.example.main.controller;

import com.example.main.Dao.DaoTipoPrestamo;
import com.example.main.model.PojoTipoPrestamo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/tipos-prestamo")
public class TipoPrestamoController {

    private final DaoTipoPrestamo dao = new DaoTipoPrestamo();

    @GetMapping
    public ResponseEntity<?> obtenerTiposPrestamo() {
        try {
            List<PojoTipoPrestamo> tipos = dao.obtenerTodos();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", tipos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerTipoPrestamoPorId(@PathVariable Integer id) {
        try {
            PojoTipoPrestamo tipo = dao.obtenerPorId(id);
            if (tipo != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", tipo);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("mensaje", "Tipo de préstamo no encontrado");
                return ResponseEntity.status(404).body(error);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}