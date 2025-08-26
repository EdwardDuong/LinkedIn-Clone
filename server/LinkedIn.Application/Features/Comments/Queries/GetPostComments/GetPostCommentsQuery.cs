using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Comments.Queries.GetPostComments;

public class GetPostCommentsQuery : IRequest<List<CommentDto>>
{
    public Guid PostId { get; set; }
}
