using MediatR;
using Microsoft.AspNetCore.Http;

namespace LinkedIn.Application.Features.FileUpload.Commands.UploadFile;

public class UploadFileCommand : IRequest<UploadFileResponse>
{
    public IFormFile File { get; set; } = null!;
    public string Folder { get; set; } = "general";
}

public class UploadFileResponse
{
    public string Url { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
}
