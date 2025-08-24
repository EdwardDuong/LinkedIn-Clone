using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Posts.Queries.GetFeed;

public class GetFeedQuery : IRequest<List<PostDto>>
{
    public Guid UserId { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
