package com.example.main.model;

import java.time.LocalDateTime;

public class PojoPrestamo {
    
    private Integer id;
    private Integer idUsuario;
    private Integer idTipoPrestamo;
    private Double montoSolicitado;
    private Double tasaInteres;
    private Integer plazoMeses;
    private LocalDateTime fechaSolicitud;
    private Double montoAutorizado;
    private Double pagoMensual;
    private String estado;
    private LocalDateTime fechaAprobacion;
    private Double saldoRestante;
    private Double abonado;
    
    public PojoPrestamo() {
        this.fechaSolicitud = LocalDateTime.now();
        this.abonado = 0.0;
        this.estado = "ACTIVO";
        this.saldoRestante = 0.0;
    }
    
    public PojoPrestamo(Integer idUsuario, Integer idTipoPrestamo, Double montoSolicitado, 
                        Double tasaInteres, Integer plazoMeses, Double montoAutorizado, 
                        Double pagoMensual) {
        this.idUsuario = idUsuario;
        this.idTipoPrestamo = idTipoPrestamo;
        this.montoSolicitado = montoSolicitado;
        this.tasaInteres = tasaInteres;
        this.plazoMeses = plazoMeses;
        this.fechaSolicitud = LocalDateTime.now();
        this.montoAutorizado = montoAutorizado;
        this.pagoMensual = pagoMensual;
        this.estado = "ACTIVO";
        this.saldoRestante = montoAutorizado;
        this.abonado = 0.0;
    }
    
    // Getters
    public Integer getId() { return id; }
    public Integer getIdUsuario() { return idUsuario; }
    public Integer getIdTipoPrestamo() { return idTipoPrestamo; }
    public Double getMontoSolicitado() { return montoSolicitado; }
    public Double getTasaInteres() { return tasaInteres; }
    public Integer getPlazoMeses() { return plazoMeses; }
    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public Double getMontoAutorizado() { return montoAutorizado; }
    public Double getPagoMensual() { return pagoMensual; }
    public String getEstado() { return estado; }
    public LocalDateTime getFechaAprobacion() { return fechaAprobacion; }
    public Double getSaldoRestante() { return saldoRestante; }
    public Double getAbonado() { return abonado; }
    
    // Setters
    public void setId(Integer id) { this.id = id; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public void setIdTipoPrestamo(Integer idTipoPrestamo) { this.idTipoPrestamo = idTipoPrestamo; }
    public void setMontoSolicitado(Double montoSolicitado) { this.montoSolicitado = montoSolicitado; }
    public void setTasaInteres(Double tasaInteres) { this.tasaInteres = tasaInteres; }
    public void setPlazoMeses(Integer plazoMeses) { this.plazoMeses = plazoMeses; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    public void setMontoAutorizado(Double montoAutorizado) { this.montoAutorizado = montoAutorizado; }
    public void setPagoMensual(Double pagoMensual) { this.pagoMensual = pagoMensual; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setFechaAprobacion(LocalDateTime fechaAprobacion) { this.fechaAprobacion = fechaAprobacion; }
    public void setSaldoRestante(Double saldoRestante) { this.saldoRestante = saldoRestante; }
    public void setAbonado(Double abonado) { this.abonado = abonado; }
}