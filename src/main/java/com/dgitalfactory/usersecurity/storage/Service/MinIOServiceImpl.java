package com.dgitalfactory.usersecurity.storage.Service;

import com.dgitalfactory.usersecurity.exception.GlobalAppException;
import com.dgitalfactory.usersecurity.storage.DTO.FileDownloadDTO;
import com.dgitalfactory.usersecurity.utils.UtilsCommons;
import io.minio.*;
import io.minio.errors.MinioException;
import io.minio.messages.Bucket;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.FileOutputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Objects;

/**
 * @author Cristian Manuel Orozco - Orozcocristian860@gmail.com
 * @created 30/01/2024 - 09:26
 */
@Service
@Slf4j
public class MinIOServiceImpl implements MiniIOService {
//    private static final Logger log = LoggerFactory.getLogger(MinIOServiceImpl.class);

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.buckek.name}")
    private String defaultBucketName;

    @Value("${minio.default.folder}")
    private String defaultBaseFolder;

    @Autowired
    private UtilsCommons utilsCommons;

    public FileDownloadDTO getFile(String key) {
        try (InputStream obj = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(defaultBucketName)
                        .object(key)
                        .build()
        )) {
            return FileDownloadDTO.builder().fileName(key).data(IOUtils.toByteArray(obj)).build();
        } catch (MinioException e) {
            log.error("Error al obtener el archivo desde MinIO: {}", e.getMessage());
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4039,
                    this.utilsCommons.getMessage("field.name.storage") + ". Error: " + e.getMessage());
        } catch (InvalidKeyException | IOException | NoSuchAlgorithmException e) {
            log.error("Error inesperado: {}", e.getMessage());
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4039,
                    this.utilsCommons.getMessage("field.name.storage") + ". Error: " + e.getMessage());
        }
    }

    public String uploadFile(MultipartFile file) {
        try {
            String fileName = "demo_dev/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(defaultBucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1) // -1 indica que el tamaño es desconocido
                            .contentType(file.getContentType())
                            .build()
            );
            return "File uploaded : " + fileName;
        } catch (MinioException e) {
            log.error("Error al obtener el archivo desde MinIO: {}", e.getMessage());
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4039,
                    this.utilsCommons.getMessage("field.name.storage") + ". Error: " + e.getMessage());
        } catch (IOException e) {
            log.error("Al cargar archivo: {}", e.getMessage());
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4041,
                    this.utilsCommons.getMessage("field.name.storage") + ". Error: " + e.getMessage());
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("Error: {}", e.getMessage());
            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4041,
                    this.utilsCommons.getMessage("field.name.storage") + ". Error: " + e.getMessage());
        }
    }


    public List<Bucket> getAllBuckets() {
        try {
            return minioClient.listBuckets();
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }


    public boolean existsBucketByName(String bucketname) {
        boolean found = false;
        try {
            found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketname).build());
        } catch (MinioException | InvalidKeyException | IOException | NoSuchAlgorithmException e) {
            log.error(e.getMessage());
        }
        if (found) {
            log.info(bucketname + " exist.");
        } else {
            log.info(bucketname + " does not exist");
        }
        return found;
    }

    public void deleteBucketByName(String bucketname) {
        try {
            minioClient.deleteBucketEncryption(
                    DeleteBucketEncryptionArgs.builder().bucket(bucketname).build());
        } catch (MinioException | IOException | NoSuchAlgorithmException | InvalidKeyException e) {
            log.error(e.getMessage());
        }
    }

//    private File convertMultiPartFileToFile(MultipartFile file) {
//        File convertedFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
//        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
//            fos.write(file.getBytes());
//        } catch (IOException e) {
//            log.error("Error converting multipartFile to file", e);
//            throw new GlobalAppException(HttpStatus.BAD_REQUEST, 4040,
//                    this.utilsCommons.getMessage("field.name.storage") + ". Error: " + e.getMessage(), e);
//        }
//        return convertedFile;
//    }
}
