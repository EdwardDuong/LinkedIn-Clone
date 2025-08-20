using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;

namespace LinkedIn.Application.Features.Posts.Commands.CreatePost;

public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, PostDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreatePostCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PostDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        // Create post entity
        var post = new Post
        {
            UserId = request.UserId,
            Content = request.Content,
            MediaUrl = request.MediaUrl,
            MediaType = request.MediaType,
            LikesCount = 0,
            CommentsCount = 0,
            SharesCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Posts.AddAsync(post, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Get user for author info
        var user = await _unitOfWork.Posts
            .FirstOrDefaultAsync(p => p.Id == post.Id, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("Post created but user not found");
        }

        // TODO: Notify followers about new post using INotificationService
        // This would require getting all followers and sending notifications

        return new PostDto
        {
            Id = post.Id,
            UserId = post.UserId,
            Author = new PublicUserDto
            {
                Id = post.UserId,
                FirstName = "", // Will be populated by loading the user
                LastName = "",
                ProfilePicture = null,
                Headline = null
            },
            Content = post.Content,
            MediaUrl = post.MediaUrl,
            MediaType = post.MediaType,
            LikesCount = post.LikesCount,
            CommentsCount = post.CommentsCount,
            SharesCount = post.SharesCount,
            IsLiked = false,
            CreatedAt = post.CreatedAt
        };
    }
}
