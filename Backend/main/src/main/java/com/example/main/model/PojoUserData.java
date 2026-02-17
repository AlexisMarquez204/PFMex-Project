package com.example.main.model;

public class PojoUserData {
    
    public String email, password, state;

    public PojoUserData(String email, String password, String state) {
        this.email = email;
        this.password = password;
        this.state = state;
    }

    public PojoUserData(){}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    

}
