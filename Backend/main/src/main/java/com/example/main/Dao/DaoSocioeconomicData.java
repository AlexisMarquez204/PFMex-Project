package com.example.main.Dao;

import com.example.main.connection.Conexion;
import com.example.main.model.PojoSocioeconomicData;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DaoSocioeconomicData extends Conexion {

    /**
     * Inserta los datos en la tabla socioeconomica (RF-07).
     * La FK id_usuario la proporciona el frontend tras el registro.
     */
    public boolean insertarSocioeconomica(PojoSocioeconomicData datos) {

        String sql =
            "INSERT INTO socioeconomica " +
            "(id_usuario, nivel_estudios, situacion_laboral, " +
            " ingreso_mensual, meses_laborando, otras_deudas, gastos_mensuales) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try {
            PreparedStatement ps = connectionSQL.prepareStatement(sql);
            ps.setInt(1,    datos.getIdUsuario());
            ps.setString(2, datos.getNivelEstudios());
            ps.setString(3, datos.getSituacionLaboral());
            ps.setDouble(4, datos.getIngresoMensual());
            ps.setInt(5,    datos.getMesesLaborando());
            ps.setDouble(6, datos.getOtrasDeudas());
            ps.setDouble(7, datos.getGastosMensuales());

            ps.executeUpdate();
            System.out.println("Datos socioeconómicos insertados. id_usuario: " + datos.getIdUsuario());
            return true;

        } catch (SQLException e) {
            System.out.println("Error al insertar socioeconomica: " + e.getMessage());
            return false;
        }
    }
}
