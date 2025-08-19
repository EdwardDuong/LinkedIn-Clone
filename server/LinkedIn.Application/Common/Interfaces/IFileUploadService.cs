using Microsoft.AspNetCore.Http;

namespace LinkedIn.Application.Common.Interfaces;

public interface IFileUploadService
{
    Task<FileUploadResult> UploadImageAsync(IFormFile file, string folder);
    Task<bool> DeleteImageAsync(string publicId);
}

public class FileUploadResult
{
    public string Url { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
}
