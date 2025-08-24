using MediatR;

namespace LinkedIn.Application.Features.Posts.Commands.LikePost;

public class LikePostCommand : IRequest<bool>
{
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }
}
