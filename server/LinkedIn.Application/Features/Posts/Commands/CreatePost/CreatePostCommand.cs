using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Posts.Commands.CreatePost;

public class CreatePostCommand : IRequest<PostDto>
{
    public Guid UserId { get; set; } // Will be set from authenticated user
    public string Content { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public string? MediaType { get; set; }
}
