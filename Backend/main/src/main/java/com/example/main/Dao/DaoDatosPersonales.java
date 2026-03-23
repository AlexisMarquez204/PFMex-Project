package com.example.main.Dao;

import java.sql.*;
import com.example.main.connection.Conexion;
import com.example.main.model.PojoDatosPersonales;
import com.example.main.model.PojoDireccion;
import org.springframework.stereotype.Repository;
import java.util.HashMap;
import java.util.Map;

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
    
    // Nuevo método para obtener datos personales por ID de usuario
    public Map<String, Object> obtenerDatosCompletosPorUsuario(Integer idUsuario) {
        Map<String, Object> resultado = new HashMap<>();
        String sqlDatos = "SELECT * FROM datos_personales WHERE id_usuario = ?";
        String sqlDireccion = "SELECT * FROM direccion WHERE id_usuario = ?";
        
        try {
            // Obtener datos personales
            PreparedStatement psDatos = connectionSQL.prepareStatement(sqlDatos);
            psDatos.setInt(1, idUsuario);
            ResultSet rsDatos = psDatos.executeQuery();
            
            if (rsDatos.next()) {
                PojoDatosPersonales datos = new PojoDatosPersonales();
                datos.setId_usuario(rsDatos.getInt("id_usuario"));
                datos.setNombre(rsDatos.getString("nombre"));
                datos.setApellido_paterno(rsDatos.getString("apellido_paterno"));
                datos.setApellido_materno(rsDatos.getString("apellido_materno"));
                datos.setFecha_nacimiento(rsDatos.getDate("fecha_nacimiento") != null ? 
                    rsDatos.getDate("fecha_nacimiento").toLocalDate().toString() : "");
                datos.setTelefono(rsDatos.getString("telefono"));
                datos.setEstado_civil(rsDatos.getString("estado_civil"));
                resultado.put("datosPersonales", datos);
            }
            
            // Obtener dirección
            PreparedStatement psDir = connectionSQL.prepareStatement(sqlDireccion);
            psDir.setInt(1, idUsuario);
            ResultSet rsDir = psDir.executeQuery();
            
            if (rsDir.next()) {
                PojoDireccion direccion = new PojoDireccion();
                direccion.setId_usuario(rsDir.getInt("id_usuario"));
                direccion.setProvincia(rsDir.getString("provincia"));
                direccion.setCiudad(rsDir.getString("ciudad"));
                direccion.setLocalizacion(rsDir.getString("localizacion"));
                direccion.setCodigo_postal(rsDir.getString("codigo_postal"));
                direccion.setNumero(rsDir.getString("numero"));
                resultado.put("direccion", direccion);
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return resultado;
    }
    
    // Método para actualizar teléfono
    public boolean actualizarTelefono(Integer idUsuario, String telefono) {
        String sql = "UPDATE datos_personales SET telefono = ? WHERE id_usuario = ?";
        
        try (PreparedStatement stmt = connectionSQL.prepareStatement(sql)) {
            stmt.setString(1, telefono);
            stmt.setInt(2, idUsuario);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}