package com.example.main.Dao;

import java.sql.*;

import com.example.main.connection.Conexion;

public class DaoUserData extends Conexion {

    /**
     * Registra un nuevo usuario en la tabla "usuario".
     * Genera automáticamente el no_cuenta (RF-05).
     *
     * @return id del usuario recién creado, o -1 si hubo error.
     */
    public int insertarUsuario(String email, String password, String estado) {

        // Generación de número de cuenta único (RF-05): PFM + timestamp
        String noCuenta = "PFM" + System.currentTimeMillis();

        String sql = "INSERT INTO usuario (email, password, no_cuenta, estado) " +
                     "VALUES (?, ?, ?, ?) RETURNING id";

        try {
            PreparedStatement ps = connectionSQL.prepareStatement(sql);
            ps.setString(1, email);
            ps.setString(2, password);
            ps.setString(3, noCuenta);
            ps.setString(4, estado);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int idGenerado = rs.getInt("id");
                System.out.println("Usuario registrado. ID: " + idGenerado + " | Cuenta: " + noCuenta);
                return idGenerado;
            }

        } catch (SQLException e) {
            System.out.println("Error al insertar usuario: " + e.getMessage());
        }

        return -1; // Error
    }
}
