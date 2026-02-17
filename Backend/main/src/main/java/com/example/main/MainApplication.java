package com.example.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.main.Dao.DaoUserData;
import com.example.main.connection.Conexion;



@SpringBootApplication
public class MainApplication {

	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);

		Conexion ConnBD=new Conexion();
		
		//DaoUserData dao=new DaoUserData();
		//dao.UploadDataUser("Isa saca sangre 3.0", "homoisa", "tengo sueño");
	}

}
