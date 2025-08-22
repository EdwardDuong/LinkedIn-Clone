using LinkedIn.Application.Common.Interfaces;
using MediatR;

namespace LinkedIn.Application.Features.FileUpload.Commands.UploadFile;

public class UploadFileCommandHandler : IRequestHandler<UploadFileCommand, UploadFileResponse>
{
    private readonly IFileUploadService _fileUploadService;

    public UploadFileCommandHandler(IFileUploadService fileUploadService)
    {
        _fileUploadService = fileUploadService;
    }

    public async Task<UploadFileResponse> Handle(UploadFileCommand request, CancellationToken cancellationToken)
    {
        // Validate file
        if (request.File == null || request.File.Length == 0)
            throw new ArgumentException("File is required");

        // Validate file size (10MB max)
        const long maxFileSize = 10 * 1024 * 1024;
        if (request.File.Length > maxFileSize)
            throw new ArgumentException("File size cannot exceed 10MB");

        // Validate file type (images and videos only)
        var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "video/mp4", "video/webm" };
        if (!allowedTypes.Contains(request.File.ContentType.ToLower()))
            throw new ArgumentException($"File type {request.File.ContentType} is not supported");

        // Upload to Cloudinary
        var result = await _fileUploadService.UploadImageAsync(request.File, request.Folder);

        return new UploadFileResponse
        {
            Url = result.Url,
            PublicId = result.PublicId
        };
    }
}
