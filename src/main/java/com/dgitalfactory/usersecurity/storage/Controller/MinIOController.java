package com.dgitalfactory.usersecurity.storage.Controller;

import com.dgitalfactory.usersecurity.DTO.MessageDTO;
import com.dgitalfactory.usersecurity.storage.DTO.FileDownloadDTO;
import com.dgitalfactory.usersecurity.storage.Service.MiniIOService;
import io.minio.messages.Bucket;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/01/2024 - 09:49
 */
@RestController
@RequestMapping("/api/storage/")
@CrossOrigin
@Validated
@Tag(name = "Storage", description = "Access to all file")
public class MinIOController {

    @Autowired
    private MiniIOService minIOSVC;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<MessageDTO> countBuckets() {
        List<Bucket> misBucket = this.minIOSVC.getAllBuckets();
        return ResponseEntity.ok(MessageDTO.builder().message(misBucket.stream().map(Bucket::name).toList().toString()).build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value= "/content")
    public ResponseEntity<MessageDTO> getContent() {
        List<Bucket> misBucket = this.minIOSVC.getAllBuckets();
        return ResponseEntity.ok(MessageDTO.builder().message(misBucket.stream().map(Bucket::name).toList().toString()).build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value = "/exist/{fileName}")
    public ResponseEntity<MessageDTO> existFile(@PathVariable(value = "fileName") String fileName) {
        boolean exist = this.minIOSVC.existsBucketByName(fileName);
        return ResponseEntity.ok(MessageDTO.builder().message(String.valueOf(exist)).build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(path = "/download/{fileName}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable(value = "fileName") String fileName) {
        FileDownloadDTO fileDownloadDTO = this.minIOSVC.getFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(fileDownloadDTO.getData());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentLength(fileDownloadDTO.getData().length);
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", fileDownloadDTO.getFileName());


        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }


}
