using LinkedIn.Application.Features.FileUpload.Commands.UploadFile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinkedIn.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class FileUploadController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<FileUploadController> _logger;

    public FileUploadController(IMediator mediator, ILogger<FileUploadController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Upload a file to Cloudinary
    /// </summary>
    /// <param name="file">The file to upload</param>
    /// <param name="folder">The folder to upload to (e.g., "profile-pictures", "posts", "cover-images")</param>
    /// <returns>The URL and public ID of the uploaded file</returns>
    [HttpPost]
    [ProducesResponseType(typeof(UploadFileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] string folder = "general")
    {
        try
        {
            var command = new UploadFileCommand
            {
                File = file,
                Folder = folder
            };

            var result = await _mediator.Send(command);

            _logger.LogInformation("File uploaded successfully to {Folder}: {Url}", folder, result.Url);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("File upload validation failed: {Message}", ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "File upload failed");
            return StatusCode(500, new { error = "An error occurred while uploading the file" });
        }
    }
}
