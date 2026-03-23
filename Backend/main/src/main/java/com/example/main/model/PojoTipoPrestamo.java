package com.example.main.model;

public class PojoTipoPrestamo {
    
    private Integer id;
    private String nombre;
    private Double montoMaximo;
    private Double montoMinimo;
    private Double tasaBase;
    private Integer plazoMaximo;
    private String descripcion;
    
    public PojoTipoPrestamo() {}
    
    public PojoTipoPrestamo(Integer id, String nombre, Double montoMaximo, Double montoMinimo, 
                            Double tasaBase, Integer plazoMaximo, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.montoMaximo = montoMaximo;
        this.montoMinimo = montoMinimo;
        this.tasaBase = tasaBase;
        this.plazoMaximo = plazoMaximo;
        this.descripcion = descripcion;
    }
    
    // Getters
    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public Double getMontoMaximo() { return montoMaximo; }
    public Double getMontoMinimo() { return montoMinimo; }
    public Double getTasaBase() { return tasaBase; }
    public Integer getPlazoMaximo() { return plazoMaximo; }
    public String getDescripcion() { return descripcion; }
    
    // Setters
    public void setId(Integer id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setMontoMaximo(Double montoMaximo) { this.montoMaximo = montoMaximo; }
    public void setMontoMinimo(Double montoMinimo) { this.montoMinimo = montoMinimo; }
    public void setTasaBase(Double tasaBase) { this.tasaBase = tasaBase; }
    public void setPlazoMaximo(Integer plazoMaximo) { this.plazoMaximo = plazoMaximo; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}