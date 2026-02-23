package com.example.main.Dao;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import com.example.main.connection.Conexion;

public class DaoUserData extends Conexion {
    
                    //////////////////////////////////
                    ///////     Hash MD5     ////////
                    /// /////////////////////////////

    public static String generarMD5(String texto) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(texto.getBytes());

            StringBuilder hash = new StringBuilder();
            for (byte b : hashBytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al generar el hash", e);
        }
    }

    // Inserta usuario y devuelve el ID generado
    public int UploadDataUserAndReturnId(String email, String password, String state) {
        int generatedId = -1;
        String sql = "INSERT INTO usuario (email, password, estado) VALUES (?, ?, ?)";

        String passMD5 = generarMD5(password);

        try {
            PreparedStatement ps = connectionSQL.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, email);
            ps.setString(2, passMD5);
            ps.setString(3, state);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                ResultSet rs = ps.getGeneratedKeys();
                if (rs.next()) {
                    generatedId = rs.getInt(1);
                    System.out.println("Alta exitosa, ID: " + generatedId);
                }
            }
        } catch (SQLException e) {
            System.out.println("Ocurrió un error: " + e.getMessage());
        }
        return generatedId;
    }

}