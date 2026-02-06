package com.chatsphere.file;

public record FileUploadResponse(String fileName, String fileDownloadUri, String fileType, long size) {}
