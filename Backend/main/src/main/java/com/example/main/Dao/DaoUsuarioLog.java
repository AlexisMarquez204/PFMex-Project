package com.example.main.Dao;

import com.example.main.connection.Conexion;

import java.sql.*;

public class DaoUsuarioLog {

    public static class UsuarioDB {
        public int id;
        public String email;
        public String password;
    }

    public UsuarioDB buscarPorEmail(String email) throws SQLException {
        Conexion cx = new Conexion();
        String sql = "SELECT id, email, password FROM usuario WHERE lower(email) = lower(?)";

        try (Connection con = cx.GetconexionBD();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return null;

                UsuarioDB u = new UsuarioDB();
                u.id = rs.getInt("id");
                u.email = rs.getString("email");
                u.password = rs.getString("password");
                return u;
            }
        }
    }

    public boolean tieneDatosPersonales(int userId) throws SQLException {
        Conexion cx = new Conexion();
        String sql = "SELECT 1 FROM datos_personales WHERE id_usuario = ? LIMIT 1";

        try (Connection con = cx.GetconexionBD();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }
}
