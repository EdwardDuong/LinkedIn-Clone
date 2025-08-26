using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Comments.Commands.AddComment;

public class AddCommentCommand : IRequest<CommentDto>
{
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}
