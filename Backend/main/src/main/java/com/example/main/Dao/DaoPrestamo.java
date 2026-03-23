package com.example.main.Dao;

import com.example.main.connection.Conexion;
import com.example.main.model.PojoPrestamo;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DaoPrestamo {
    
    private Conexion conexion;
    
    public DaoPrestamo() {
        this.conexion = new Conexion();
    }
    
    public boolean insertarPrestamo(PojoPrestamo prestamo) {
        String sql = "INSERT INTO prestamo (id_usuario, id_tipo_prestamo, monto_solicitado, " +
                     "tasa_interes, plazo_meses, fecha_solicitud, monto_autorizado, " +
                     "pago_mensual, estado, saldo_restante, abonado) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        System.out.println("📝 INSERT en prestamo:");
        System.out.println("  - id_usuario: " + prestamo.getIdUsuario());
        System.out.println("  - id_tipo_prestamo: " + prestamo.getIdTipoPrestamo());
        System.out.println("  - monto_solicitado: " + prestamo.getMontoSolicitado());
        System.out.println("  - tasa_interes: " + prestamo.getTasaInteres());
        System.out.println("  - plazo_meses: " + prestamo.getPlazoMeses());
        System.out.println("  - monto_autorizado: " + prestamo.getMontoAutorizado());
        System.out.println("  - pago_mensual: " + prestamo.getPagoMensual());
        
        try (PreparedStatement stmt = conexion.GetconexionBD().prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, prestamo.getIdUsuario());
            stmt.setInt(2, prestamo.getIdTipoPrestamo());
            stmt.setDouble(3, prestamo.getMontoSolicitado());
            stmt.setDouble(4, prestamo.getTasaInteres());
            stmt.setInt(5, prestamo.getPlazoMeses());
            stmt.setTimestamp(6, Timestamp.valueOf(prestamo.getFechaSolicitud()));
            stmt.setDouble(7, prestamo.getMontoAutorizado());
            stmt.setDouble(8, prestamo.getPagoMensual());
            stmt.setString(9, prestamo.getEstado() != null ? prestamo.getEstado() : "ACTIVO");
            stmt.setDouble(10, prestamo.getSaldoRestante() != null ? prestamo.getSaldoRestante() : prestamo.getMontoAutorizado());
            stmt.setDouble(11, prestamo.getAbonado() != null ? prestamo.getAbonado() : 0.0);
            
            int affectedRows = stmt.executeUpdate();
            System.out.println("📊 Filas afectadas: " + affectedRows);
            
            if (affectedRows > 0) {
                ResultSet generatedKeys = stmt.getGeneratedKeys();
                if (generatedKeys.next()) {
                    prestamo.setId(generatedKeys.getInt(1));
                    System.out.println("✅ Préstamo insertado con ID: " + prestamo.getId());
                }
                return true;
            }
            return false;
        } catch (SQLException e) {
            System.err.println("❌ Error SQL: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    public PojoPrestamo obtenerUltimoPrestamoPorUsuario(Integer idUsuario) {
        String sql = "SELECT * FROM prestamo WHERE id_usuario = ? ORDER BY fecha_solicitud DESC LIMIT 1";
        
        try (PreparedStatement stmt = conexion.GetconexionBD().prepareStatement(sql)) {
            stmt.setInt(1, idUsuario);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToPrestamo(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public List<PojoPrestamo> obtenerPrestamosPorUsuario(Integer idUsuario) {
        List<PojoPrestamo> prestamos = new ArrayList<>();
        String sql = "SELECT * FROM prestamo WHERE id_usuario = ? ORDER BY fecha_solicitud DESC";
        
        try (PreparedStatement stmt = conexion.GetconexionBD().prepareStatement(sql)) {
            stmt.setInt(1, idUsuario);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                prestamos.add(mapResultSetToPrestamo(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return prestamos;
    }
    
    public PojoPrestamo obtenerPrestamoPorId(Integer id) {
        String sql = "SELECT * FROM prestamo WHERE id = ?";
        
        try (PreparedStatement stmt = conexion.GetconexionBD().prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToPrestamo(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public boolean registrarPago(Integer idPrestamo, Double montoPagado) {
        String sql = "UPDATE prestamo SET abonado = abonado + ?, saldo_restante = saldo_restante - ?, " +
                     "estado = CASE WHEN (saldo_restante - ?) <= 0 THEN 'LIQUIDADO' ELSE 'ACTIVO' END " +
                     "WHERE id = ?";
        
        try (PreparedStatement stmt = conexion.GetconexionBD().prepareStatement(sql)) {
            stmt.setDouble(1, montoPagado);
            stmt.setDouble(2, montoPagado);
            stmt.setDouble(3, montoPagado);
            stmt.setInt(4, idPrestamo);
            
            int affected = stmt.executeUpdate();
            System.out.println("📊 Pago registrado, filas afectadas: " + affected);
            return affected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private PojoPrestamo mapResultSetToPrestamo(ResultSet rs) throws SQLException {
        PojoPrestamo prestamo = new PojoPrestamo();
        prestamo.setId(rs.getInt("id"));
        prestamo.setIdUsuario(rs.getInt("id_usuario"));
        prestamo.setIdTipoPrestamo(rs.getInt("id_tipo_prestamo"));
        prestamo.setMontoSolicitado(rs.getDouble("monto_solicitado"));
        prestamo.setTasaInteres(rs.getDouble("tasa_interes"));
        prestamo.setPlazoMeses(rs.getInt("plazo_meses"));
        
        Timestamp fechaSolicitud = rs.getTimestamp("fecha_solicitud");
        if (fechaSolicitud != null) {
            prestamo.setFechaSolicitud(fechaSolicitud.toLocalDateTime());
        }
        
        prestamo.setMontoAutorizado(rs.getDouble("monto_autorizado"));
        prestamo.setPagoMensual(rs.getDouble("pago_mensual"));
        prestamo.setEstado(rs.getString("estado"));
        prestamo.setSaldoRestante(rs.getDouble("saldo_restante"));
        prestamo.setAbonado(rs.getDouble("abonado"));
        
        Timestamp fechaAprobacion = rs.getTimestamp("fecha_aprobacion");
        if (fechaAprobacion != null) {
            prestamo.setFechaAprobacion(fechaAprobacion.toLocalDateTime());
        }
        
        return prestamo;
    }
}