package com.example.main.Dao;

import com.example.main.connection.Conexion;
import com.example.main.model.PojoSocioeconomicoCompleto;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DaoSocioeconomicoCompleto extends Conexion {

    public boolean insertarSocioeconomico(PojoSocioeconomicoCompleto datos) {
        // SQL SIN la columna fecha_registro
        String sql = "INSERT INTO socioeconomica " +
                "(id_usuario, nivel_estudios, situacion_laboral, ingreso_mensual, meses_laborando, otras_deudas, gastos_mensuales) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try {
            System.out.println("📥 Insertando en BD...");
            PreparedStatement ps = connectionSQL.prepareStatement(sql);
            ps.setInt(1, datos.getIdUsuario());
            ps.setString(2, datos.getNivelEstudios());
            ps.setString(3, datos.getSituacionLaboral());
            ps.setDouble(4, datos.getIngresoMensual());
            ps.setInt(5, datos.getMesesLaborando());
            ps.setDouble(6, datos.getOtrasDeudas());
            ps.setDouble(7, datos.getGastosMensuales());
            
            int filas = ps.executeUpdate();
            System.out.println("✅ Filas insertadas: " + filas);
            return true;
            
        } catch (SQLException e) {
            System.out.println("❌ Error al insertar socioeconómico: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}