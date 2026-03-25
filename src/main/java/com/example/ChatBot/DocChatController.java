package com.example.ChatBot;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ResponseEntity;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/documents")
public class DocChatController {
    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final IngestionService ingestionService;
    private final AITools aiTools;

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) throws IOException {
        ingestionService.ingest(file);
        return file.getOriginalFilename()+"SAVED";
    }


    @GetMapping("/chat")
    @Cacheable(cacheNames = "Data" , key = "#query")
    public String chat(@RequestParam String query , @RequestParam String docName){
        return chatClient.prompt()
                .tools(aiTools)
                .advisors(
                        QuestionAnswerAdvisor.builder(vectorStore)
                                .searchRequest(SearchRequest.builder()
                                        .topK(4)
                                        .similarityThreshold(0.7)
                                        .filterExpression("source== '" + docName + "'")
                                        .build()
                                )
                                .build()
                )
                .user(query)
                .call()
                .content();
    }
}

