package com.example.main.controller;

import com.example.main.Dao.DaoSocioeconomicData;
import com.example.main.model.PojoSocioeconomicData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/socioeconomico")
public class SocioeconomicController {

    private final DaoSocioeconomicData dao = new DaoSocioeconomicData();

    @PostMapping
    public ResponseEntity<Map<String, String>> guardarDatos(
            @RequestBody PojoSocioeconomicData datos) {

        Map<String, String> resp = new HashMap<>();

        // Validación server-side (RF-08)
        if (datos.getIdUsuario() <= 0) {
            resp.put("mensaje", "ID de usuario inválido.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (datos.getSituacionLaboral() == null || datos.getSituacionLaboral().isBlank()) {
            resp.put("mensaje", "La situación laboral es obligatoria.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (datos.getIngresoMensual() < 0 || datos.getGastosMensuales() < 0) {
            resp.put("mensaje", "Los montos no pueden ser negativos.");
            return ResponseEntity.badRequest().body(resp);
        }

        boolean exito = dao.insertarSocioeconomica(datos);

        if (exito) {
            resp.put("mensaje", "Datos socioeconómicos registrados correctamente.");
            return ResponseEntity.ok(resp);
        } else {
            resp.put("mensaje", "Error al guardar. Intenta de nuevo.");
            return ResponseEntity.status(500).body(resp);
        }
    }
}
