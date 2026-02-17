package com.example.main.Dao;

import java.sql.*;
import java.util.*;

import com.example.main.connection.Conexion;
import com.example.main.model.PojoUserData;

public class DaoUserData extends Conexion{
    
    public boolean UploadDataUser(String getEmail, String getPassword, String getState){

        String sql = "INSERT INTO usuario (email, password, estado) VALUES (?,?,?)";
        
        try {
            //Generacion de objeto de la clase Pojo
            PojoUserData ObjGetVar = new PojoUserData();
            //Asignacion de parametros
            ObjGetVar.setEmail(getEmail);
            ObjGetVar.setPassword(getPassword);
            ObjGetVar.setState(getState);

            //Creacion del PreparedStatement para las operaciones sql
            PreparedStatement PS = connectionSQL.prepareStatement(sql);

            //Asigancion de parametros para la BD
            PS.setString(1, ObjGetVar.getEmail());
            PS.setString(2, ObjGetVar.getPassword());
            PS.setString(3, ObjGetVar.getState());

            //Actuador para iniciar la alta
           boolean Upload =PS.execute();
           Upload = true;
           //validacion simple
           if (Upload==true) {
            System.out.println("Alta exitosa");
           }else{
            System.out.println("Error al registrar");
           }

        } catch (SQLException e) {
           System.out.println("Ocurrio un error: "+e 
           +"Error en: "+e.getErrorCode()
           +"\n Mensaje: "+e.getLocalizedMessage());
           
        }
        return true;
        
    }
}
