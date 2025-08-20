using FluentValidation;

namespace LinkedIn.Application.Features.Posts.Commands.CreatePost;

public class CreatePostCommandValidator : AbstractValidator<CreatePostCommand>
{
    public CreatePostCommandValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Post content is required")
            .MaximumLength(3000).WithMessage("Post content must not exceed 3000 characters");

        RuleFor(x => x.MediaType)
            .Must(type => type == null || new[] { "image", "video", "document" }.Contains(type))
            .WithMessage("Media type must be 'image', 'video', or 'document'");
    }
}
