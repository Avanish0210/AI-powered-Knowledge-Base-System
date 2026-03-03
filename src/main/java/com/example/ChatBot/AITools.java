package com.example.ChatBot;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AITools {

    @Tool(description = "Reboots a customer's router using the router serial number")
    public String rebotRouter(String serialNo){
        // Here you would call your real router API
        // Example: routerService.reboot(serialNo);
        System.out.println("Rebooting roter  with serial No. : " + serialNo);

        return "Router with serial No. : " + serialNo + "has been rebooted";
    }
}
