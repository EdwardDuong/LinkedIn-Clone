using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using LinkedIn.Application.Common.Interfaces;
using LinkedIn.Infrastructure.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace LinkedIn.Infrastructure.Services;

public class CloudinaryFileUploadService : IFileUploadService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryFileUploadService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<FileUploadResult> UploadImageAsync(IFormFile file, string folder)
    {
        if (file.Length == 0)
            throw new ArgumentException("File is empty");

        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = $"linkedin-clone/{folder}",
            Transformation = new Transformation()
                .Width(1200)
                .Height(1200)
                .Crop("limit")
                .Quality("auto:good")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
            throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");

        return new FileUploadResult
        {
            Url = uploadResult.SecureUrl.ToString(),
            PublicId = uploadResult.PublicId
        };
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);
        return result.Result == "ok";
    }
}
