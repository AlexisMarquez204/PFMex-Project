package com.example.main.Dao;

import java.sql.*;
import com.example.main.connection.Conexion;
import com.example.main.model.PojoDatosPersonales;
import com.example.main.model.PojoDireccion;
import org.springframework.stereotype.Repository;

@Repository
public class DaoDatosPersonales extends Conexion {

    public boolean insertarRegistroCompleto(PojoDatosPersonales datos, PojoDireccion direccion) {
        String sqlDatos = "INSERT INTO datos_personales (id_usuario, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, telefono, estado_civil) VALUES (?, ?, ?, ?, ?, ?, ?)";
        String sqlDireccion = "INSERT INTO direccion (id_usuario, provincia, ciudad, localizacion, codigo_postal, numero) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            connectionSQL.setAutoCommit(false);

            PreparedStatement psDatos = connectionSQL.prepareStatement(sqlDatos);
            psDatos.setInt(1, datos.getId_usuario());
            psDatos.setString(2, datos.getNombre());
            psDatos.setString(3, datos.getApellido_paterno());
            psDatos.setString(4, datos.getApellido_materno());
            psDatos.setDate(5, Date.valueOf(datos.getFecha_nacimiento()));
            psDatos.setString(6, datos.getTelefono());
            psDatos.setString(7, datos.getEstado_civil());
            psDatos.executeUpdate();

            PreparedStatement psDir = connectionSQL.prepareStatement(sqlDireccion);
            psDir.setInt(1, direccion.getId_usuario());
            psDir.setString(2, direccion.getProvincia());
            psDir.setString(3, direccion.getCiudad());
            psDir.setString(4, direccion.getLocalizacion());
            psDir.setString(5, direccion.getCodigo_postal());
            psDir.setString(6, direccion.getNumero());
            psDir.executeUpdate();

            connectionSQL.commit();
            return true;

        } catch (SQLException e) {
            try {
                if (connectionSQL != null) connectionSQL.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return false;
        } finally {
            try {
                connectionSQL.setAutoCommit(true);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}