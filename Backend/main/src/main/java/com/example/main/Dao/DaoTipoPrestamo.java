package com.example.main.Dao;

import com.example.main.connection.Conexion;
import com.example.main.model.PojoTipoPrestamo;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DaoTipoPrestamo {
    
    private Conexion conexion;
    
    public DaoTipoPrestamo() {
        this.conexion = new Conexion();
    }
    
    public List<PojoTipoPrestamo> obtenerTodos() {
        List<PojoTipoPrestamo> tipos = new ArrayList<>();
        String sql = "SELECT id, nombre, monto_maximo, monto_minimo, tasa_base, plazo_maximo, descripcion " +
                     "FROM tipo_prestamo ORDER BY id";
        
        try (Statement stmt = conexion.GetconexionBD().createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                PojoTipoPrestamo tipo = new PojoTipoPrestamo();
                tipo.setId(rs.getInt("id"));
                tipo.setNombre(rs.getString("nombre"));
                tipo.setMontoMaximo(rs.getDouble("monto_maximo"));
                tipo.setMontoMinimo(rs.getDouble("monto_minimo"));
                tipo.setTasaBase(rs.getDouble("tasa_base"));
                tipo.setPlazoMaximo(rs.getInt("plazo_maximo"));
                tipo.setDescripcion(rs.getString("descripcion"));
                tipos.add(tipo);
            }
        } catch (SQLException e) {
            System.err.println("❌ Error al obtener tipos de préstamo: " + e.getMessage());
            e.printStackTrace();
        }
        return tipos;
    }
    
    public PojoTipoPrestamo obtenerPorId(Integer id) {
        String sql = "SELECT id, nombre, monto_maximo, monto_minimo, tasa_base, plazo_maximo, descripcion " +
                     "FROM tipo_prestamo WHERE id = ?";
        
        try (PreparedStatement stmt = conexion.GetconexionBD().prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                PojoTipoPrestamo tipo = new PojoTipoPrestamo();
                tipo.setId(rs.getInt("id"));
                tipo.setNombre(rs.getString("nombre"));
                tipo.setMontoMaximo(rs.getDouble("monto_maximo"));
                tipo.setMontoMinimo(rs.getDouble("monto_minimo"));
                tipo.setTasaBase(rs.getDouble("tasa_base"));
                tipo.setPlazoMaximo(rs.getInt("plazo_maximo"));
                tipo.setDescripcion(rs.getString("descripcion"));
                return tipo;
            }
        } catch (SQLException e) {
            System.err.println("❌ Error al obtener tipo de préstamo: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}