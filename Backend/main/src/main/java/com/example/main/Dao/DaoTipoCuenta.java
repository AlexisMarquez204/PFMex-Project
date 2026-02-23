package com.example.main.Dao;

import com.example.main.connection.Conexion;
import com.example.main.model.PojoTipoCuenta;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DaoTipoCuenta extends Conexion {

    public boolean insertarTipoCuenta(PojoTipoCuenta datos) {
        if (existeRegistro(datos.getIdUsuario())) {
            return actualizarTipoCuenta(datos);
        } else {
            return insertarNuevo(datos);
        }
    }

    private boolean existeRegistro(int idUsuario) {
        String sql = "SELECT COUNT(*) FROM tipo_cuenta WHERE id_usuario = ?";
        try {
            PreparedStatement ps = connectionSQL.prepareStatement(sql);
            ps.setInt(1, idUsuario);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            System.out.println("Error al verificar: " + e.getMessage());
        }
        return false;
    }

    private boolean insertarNuevo(PojoTipoCuenta datos) {
        String sql = "INSERT INTO tipo_cuenta (id_usuario, tipo_cuenta, numero_tarjeta, nombre_banco, numero_cuenta, motivo) VALUES (?, ?, ?, ?, ?, ?)";
        try {
            PreparedStatement ps = connectionSQL.prepareStatement(sql);
            ps.setInt(1, datos.getIdUsuario());
            ps.setString(2, datos.getTipoCuenta());
            ps.setString(3, datos.getNumeroTarjeta());
            ps.setString(4, datos.getNombreBanco());
            ps.setString(5, datos.getNumeroCuenta());
            ps.setString(6, datos.getMotivo());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean actualizarTipoCuenta(PojoTipoCuenta datos) {
        String sql = "UPDATE tipo_cuenta SET tipo_cuenta=?, numero_tarjeta=?, nombre_banco=?, numero_cuenta=?, motivo=? WHERE id_usuario=?";
        try {
            PreparedStatement ps = connectionSQL.prepareStatement(sql);
            ps.setString(1, datos.getTipoCuenta());
            ps.setString(2, datos.getNumeroTarjeta());
            ps.setString(3, datos.getNombreBanco());
            ps.setString(4, datos.getNumeroCuenta());
            ps.setString(5, datos.getMotivo());
            ps.setInt(6, datos.getIdUsuario());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}