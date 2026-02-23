

package com.example.main.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ControladorPrueba {
    
    @GetMapping("/")
    public Map<String, String> raiz() {
        return Map.of(
            "mensaje", "API funcionando",
            "estado", "ok"
        );
    }
    
    @GetMapping("/test")
    public Map<String, String> test() {
        return Map.of("mensaje", "test ok");
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
} 
    

