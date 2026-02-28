package com.example.ChatBot;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IngestionService {
//This loads the Spring Boot Reference PDF, splits it, and saves it to the Vector DB.
    private final VectorStore vectorStore;

    public void ingest(MultipartFile file) throws IOException {

        // Convert MultipartFile to Resource
        var resource = new InputStreamResource(file.getInputStream());

        //Load: Read Pdf
        var pdfReader = new PagePdfDocumentReader(resource);
        List<Document> rawDocs = pdfReader.get();

        //Transform: split into 800-token chunks
        var splitter = new TokenTextSplitter();
        List<Document> chunks = splitter.split(rawDocs);

        //Add MetaData: so user can just enter their file name that make the search easy
        chunks.forEach(chunk -> {
            chunk.getMetadata().put("source" , file.getOriginalFilename());
        });

        //Load: STore in  PG vector
        vectorStore.add(chunks);
        System.out.println("ingest" + chunks.size() + "Chunks");

    }
}
