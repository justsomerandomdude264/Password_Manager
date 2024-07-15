package com.krishnapaliwal.password_manager.Services;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.ByteBuffer;

/**
 * Service class for handling encryption, decryption, and hashing operations.
 */
@Service
public class EncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    private static final int SALT_LENGTH = 16;
    private static final int ITERATION_COUNT = 65536;
    private static final int KEY_LENGTH = 256;

    /**
     * Encrypts the given data using the provided master passkey.
     * @param data The data to encrypt
     * @param masterPasskey The master passkey used for encryption
     * @return Base64 encoded encrypted data
     */
    public String encrypt(String data, String masterPasskey) {
        if (data == null || masterPasskey == null) {
            throw new IllegalArgumentException("Data and master passkey must not be null");
        }
        try {
            byte[] salt = generateSalt();
            SecretKey key = deriveKey(masterPasskey, salt);
            byte[] iv = generateIV();

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, parameterSpec);

            byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

            ByteBuffer byteBuffer = ByteBuffer.allocate(salt.length + iv.length + encryptedData.length);
            byteBuffer.put(salt).put(iv).put(encryptedData);

            return Base64.getEncoder().encodeToString(byteBuffer.array());
        } catch (Exception ex) {
            throw new RuntimeException("Error during encryption", ex);
        }
    }

    /**
     * Decrypts the given encrypted data using the provided master passkey.
     * @param encryptedData Base64 encoded encrypted data
     * @param masterPasskey The master passkey used for decryption
     * @return Decrypted data as a string
     */
    public String decrypt(String encryptedData, String masterPasskey) {
        if (encryptedData == null || masterPasskey == null) {
            throw new IllegalArgumentException("Encrypted data and master passkey must not be null");
        }
        try {
            ByteBuffer byteBuffer = ByteBuffer.wrap(Base64.getDecoder().decode(encryptedData));
    
            byte[] salt = new byte[SALT_LENGTH];
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(salt).get(iv);
    
            byte[] cipherText = new byte[byteBuffer.remaining()];
            byteBuffer.get(cipherText);
    
            SecretKey key = deriveKey(masterPasskey, salt);
    
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, parameterSpec);
    
            byte[] decryptedData = cipher.doFinal(cipherText);
            return new String(decryptedData, StandardCharsets.UTF_8);
        } catch (Exception ex) {
            System.err.println("Decryption error: " + ex.getClass().getName() + " - " + ex.getMessage());
            System.err.println("Encrypted data length: " + encryptedData.length());
            throw new RuntimeException("Error during decryption", ex);
        }
    }

    /**
     * Derives a secret key from the master passkey and salt.
     */
    private SecretKey deriveKey(String masterPasskey, byte[] salt) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(masterPasskey.toCharArray(), salt, ITERATION_COUNT, KEY_LENGTH);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] keyBytes = factory.generateSecret(spec).getEncoded();
        return new SecretKeySpec(keyBytes, "AES");
    }

    /**
     * Generates a random salt.
     */
    private byte[] generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    /**
     * Generates a random initialization vector.
     */
    private byte[] generateIV() {
        byte[] iv = new byte[GCM_IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }

    /**
     * Performs SHA-256 hashing on the input data.
     * @param data The data to hash
     * @return Hexadecimal string representation of the hash
     */
    public String sha256encryption(String data) {
        if (data == null) {
            throw new IllegalArgumentException("Data must not be null");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error during SHA-256 hashing", ex);
        }
    }
}