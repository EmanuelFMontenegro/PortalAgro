package com.dgitalfactory.usersecurity.controller;

import jakarta.annotation.security.PermitAll;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PreFilter;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class DemoController {

    @GetMapping("/public")
    @PermitAll
    public String getDemo(){
        return "I'm space public...";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String getAdmin(){ return "I'm space admin...";}

    @GetMapping("/operator")
    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR')")
    public String getOper(){ return "I'm space operator...";}

    @PostMapping("/add")
    public String add(){
        return "add fake user...";
    }

    @GetMapping("/add")
    public String getAdd(){
        return "get fake user...";
    }

    @GetMapping("/user/{param}")
    @PreAuthorize(
            """
                    #param == authentication.principal.username and hasRole('ADMIN')
                    """
    )
    public String getUs(@PathVariable("param") String param){
        return "get fake user..."+param;
    }

    @GetMapping("/user1/{param}")
    @PreAuthorize("@conditionEvaluator.canPreAuth(#param)")
    public String getUs2(@PathVariable("param") String param){
        return "get fake user..."+param;
    }

    //PostAuthorize
    //Restringe el acceso dependiendo el resultado
    @GetMapping("/getAuth1")
//    @PostAuthorize("returnObject != 'demo'")
    @PostAuthorize("returnObject == 'demo'")
    public String getAuth1(){
        System.out.println("AUTH1 EJECTUTADO");
        return "demo";
    }

    @GetMapping("/preFilter")
    //LISTA DE OBJETOS Y SE VAN A FILTRAR POR TODO LO QUE COMIENCE POR NOMBRE DE USUARIO
    @PreFilter("filterObject.startsWith(authentication.principal.username)")
    public String getPrefilter(@RequestBody List<String> values){
        System.out.println("value"+values);
        return "demo prefilter";
    }

    @GetMapping("/postFilter")
    //LISTA DE OBJETOS Y SE VAN A FILTRAR POR RESULTADO
    //EL RESULTADO TIENEN QUE SER UNA COLECCION PERO
    //MODIFICADA
    @PostFilter("filterObject.startsWith(authentication.principal.username)")
    public List<String> postFilter(){
        //Este tipo de values dará error porque no las puede modificar
//        List<String> values = List.of("wolf -object","wolf - object2", "user01 - object", "user02 - object2");
        List<String> values = new ArrayList<>();
        values.add("wolf -object");
        values.add("wolf -object2");
        values.add("user01 -object");
        values.add("user01 -object2");
        values.add("user02 -object");
        values.add("user02 -object2");
        System.out.println("value"+values);
        return values;
    }
}
