package com.example.main.connection;

import java.sql.*;

public class Conexion {

    // variable para inicializar la conexion a la bd como nulo
    public Connection connectionSQL = null;

    ///////////////////////////////////////////////////////////////////
    /// Variables necesarias para la conexion a bd////
    ///////////////////////////////////////////////////////////////////
    public String user = "postgres";
    public String pass = "1234";
    public String database = "pfmex";
    public String url = "jdbc:postgresql://localhost:5432/" + database;
    ////////////////////////////////////////////////////////////////////

    // constructo para inicializar la conexion
    public Conexion() {

        try {
            connectionSQL = DriverManager.getConnection(url, user, pass);
            if (connectionSQL == null) {
                System.out.println("Error en la conexión");

            } else {
                System.out.println("Conexión exitosa");
            }

        } catch (Exception e) {
            System.out.println("Error Fatal: " + e + "\n" + e.getLocalizedMessage());
        }

    }

    // objeto para invocar la conexión
    public Connection GetconexionBD() {
        return connectionSQL;
    }

    //objeto para pder cerra la conexión a BD
    public void CloseConexion(){
        try {
            connectionSQL.close();
            System.out.println("Conexión Cerrada");
        } catch (Exception e) {
            System.out.println("Error al cerrar la conexión");
        }
    }

}
