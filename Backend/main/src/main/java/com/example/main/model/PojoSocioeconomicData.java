package com.example.main.model;

public class PojoSocioeconomicData {

    // FK al usuario registrado (llega por query param desde el frontend)
    private int idUsuario;

    // ── Tabla: socioeconomica (RF-07) ────────────────────────────
    private String nivelEstudios;
    private String situacionLaboral;
    private double ingresoMensual;    // NUMERIC(12,2)
    private int    mesesLaborando;    // INTEGER
    private double otrasDeudas;       // NUMERIC(12,2)
    private double gastosMensuales;   // NUMERIC(12,2)

    public PojoSocioeconomicData() {}

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public String getNivelEstudios() { return nivelEstudios; }
    public void setNivelEstudios(String v) { this.nivelEstudios = v; }

    public String getSituacionLaboral() { return situacionLaboral; }
    public void setSituacionLaboral(String v) { this.situacionLaboral = v; }

    public double getIngresoMensual() { return ingresoMensual; }
    public void setIngresoMensual(double v) { this.ingresoMensual = v; }

    public int getMesesLaborando() { return mesesLaborando; }
    public void setMesesLaborando(int v) { this.mesesLaborando = v; }

    public double getOtrasDeudas() { return otrasDeudas; }
    public void setOtrasDeudas(double v) { this.otrasDeudas = v; }

    public double getGastosMensuales() { return gastosMensuales; }
    public void setGastosMensuales(double v) { this.gastosMensuales = v; }
}
