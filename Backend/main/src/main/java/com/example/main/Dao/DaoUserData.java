package com.example.main.Dao;

import java.sql.*;

import com.example.main.connection.Conexion;

public class DaoUserData extends Conexion {

    public int insertarUsuario(String email, String password, String estado) {


        String sql = "INSERT INTO usuario (email, password, estado) " +
                     "VALUES (?, ?, ?)";

        try {
            PreparedStatement ps = connectionSQL.prepareStatement(sql);
            ps.setString(1, email);
            ps.setString(2, password);
            ps.setString(3, estado);
           
        } catch (SQLException e) {
            System.out.println("Error al insertar usuario: " + e.getMessage());
        }

        return -1; // Error
    }
}
