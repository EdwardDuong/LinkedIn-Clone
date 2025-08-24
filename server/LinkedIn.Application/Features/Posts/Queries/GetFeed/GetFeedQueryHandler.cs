using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Posts.Queries.GetFeed;

public class GetFeedQueryHandler : IRequestHandler<GetFeedQuery, List<PostDto>>
{
    private readonly IRepository<Post> _postRepository;
    private readonly IMapper _mapper;

    public GetFeedQueryHandler(IRepository<Post> postRepository, IMapper mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
    }

    public async Task<List<PostDto>> Handle(GetFeedQuery request, CancellationToken cancellationToken)
    {
        // For now, return all posts. Later, implement feed algorithm based on connections
        var posts = await _postRepository
            .GetAllAsync(cancellationToken);

        var postsList = await posts
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.Limit)
            .Take(request.Limit)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<PostDto>>(postsList);
    }
}
