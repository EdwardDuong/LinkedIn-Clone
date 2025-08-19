namespace LinkedIn.Application.DTOs;

public class PostDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public PublicUserDto Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public string? MediaType { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public int SharesCount { get; set; }
    public bool IsLiked { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePostDto
{
    public string Content { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public string? MediaType { get; set; }
}
