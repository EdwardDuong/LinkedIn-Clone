using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Comments.Commands.AddComment;

public class AddCommentCommandHandler : IRequestHandler<AddCommentCommand, CommentDto>
{
    private readonly IRepository<Comment> _commentRepository;
    private readonly IRepository<Post> _postRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AddCommentCommandHandler(
        IRepository<Comment> commentRepository,
        IRepository<Post> postRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _commentRepository = commentRepository;
        _postRepository = postRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CommentDto> Handle(AddCommentCommand request, CancellationToken cancellationToken)
    {
        // Check if post exists
        var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
        if (post == null)
        {
            throw new InvalidOperationException("Post not found");
        }

        // Create comment
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            PostId = request.PostId,
            UserId = request.UserId,
            Content = request.Content,
            ParentCommentId = request.ParentCommentId,
            LikesCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _commentRepository.AddAsync(comment, cancellationToken);

        // Update post comments count
        post.CommentsCount++;
        post.UpdatedAt = DateTime.UtcNow;
        await _postRepository.UpdateAsync(post, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Load user for response
        var comments = await _commentRepository.GetAllAsync(cancellationToken);
        var commentWithUser = await comments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == comment.Id, cancellationToken);

        return _mapper.Map<CommentDto>(commentWithUser);
    }
}
