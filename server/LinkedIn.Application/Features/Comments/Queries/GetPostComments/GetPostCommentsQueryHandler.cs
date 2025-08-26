using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Comments.Queries.GetPostComments;

public class GetPostCommentsQueryHandler : IRequestHandler<GetPostCommentsQuery, List<CommentDto>>
{
    private readonly IRepository<Comment> _commentRepository;
    private readonly IMapper _mapper;

    public GetPostCommentsQueryHandler(IRepository<Comment> commentRepository, IMapper mapper)
    {
        _commentRepository = commentRepository;
        _mapper = mapper;
    }

    public async Task<List<CommentDto>> Handle(GetPostCommentsQuery request, CancellationToken cancellationToken)
    {
        var comments = await _commentRepository.GetAllAsync(cancellationToken);

        var postComments = await comments
            .Where(c => c.PostId == request.PostId)
            .Include(c => c.User)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<CommentDto>>(postComments);
    }
}
