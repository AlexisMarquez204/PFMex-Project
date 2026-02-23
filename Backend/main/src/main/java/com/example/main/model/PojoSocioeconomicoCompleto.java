package com.example.main.model;

public class PojoSocioeconomicoCompleto {

    private int idUsuario;
    private String nivelEstudios;
    private String situacionLaboral;
    private double ingresoMensual;
    private int mesesLaborando;
    private double otrasDeudas;
    private double gastosMensuales;

    public PojoSocioeconomicoCompleto(){}

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public String getNivelEstudios() { return nivelEstudios; }
    public void setNivelEstudios(String nivelEstudios) { this.nivelEstudios = nivelEstudios; }

    public String getSituacionLaboral() { return situacionLaboral; }
    public void setSituacionLaboral(String situacionLaboral) { this.situacionLaboral = situacionLaboral; }

    public double getIngresoMensual() { return ingresoMensual; }
    public void setIngresoMensual(double ingresoMensual) { this.ingresoMensual = ingresoMensual; }

    public int getMesesLaborando() { return mesesLaborando; }
    public void setMesesLaborando(int mesesLaborando) { this.mesesLaborando = mesesLaborando; }

    public double getOtrasDeudas() { return otrasDeudas; }
    public void setOtrasDeudas(double otrasDeudas) { this.otrasDeudas = otrasDeudas; }

    public double getGastosMensuales() { return gastosMensuales; }
    public void setGastosMensuales(double gastosMensuales) { this.gastosMensuales = gastosMensuales; }
}