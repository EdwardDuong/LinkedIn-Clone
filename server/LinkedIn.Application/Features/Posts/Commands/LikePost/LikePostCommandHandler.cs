using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Posts.Commands.LikePost;

public class LikePostCommandHandler : IRequestHandler<LikePostCommand, bool>
{
    private readonly IRepository<Post> _postRepository;
    private readonly IRepository<PostLike> _postLikeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public LikePostCommandHandler(
        IRepository<Post> postRepository,
        IRepository<PostLike> postLikeRepository,
        IUnitOfWork unitOfWork)
    {
        _postRepository = postRepository;
        _postLikeRepository = postLikeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(LikePostCommand request, CancellationToken cancellationToken)
    {
        // Check if post exists
        var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
        if (post == null)
        {
            throw new InvalidOperationException("Post not found");
        }

        // Check if user already liked the post
        var existingLikes = await _postLikeRepository.GetAllAsync(cancellationToken);
        var existingLike = await existingLikes
            .FirstOrDefaultAsync(
                pl => pl.PostId == request.PostId && pl.UserId == request.UserId,
                cancellationToken);

        if (existingLike != null)
        {
            // Unlike: remove the like
            await _postLikeRepository.DeleteAsync(existingLike, cancellationToken);
            post.LikesCount = Math.Max(0, post.LikesCount - 1);
        }
        else
        {
            // Like: add new like
            var postLike = new PostLike
            {
                Id = Guid.NewGuid(),
                PostId = request.PostId,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _postLikeRepository.AddAsync(postLike, cancellationToken);
            post.LikesCount++;
        }

        post.UpdatedAt = DateTime.UtcNow;
        await _postRepository.UpdateAsync(post, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return existingLike == null; // Returns true if liked, false if unliked
    }
}
