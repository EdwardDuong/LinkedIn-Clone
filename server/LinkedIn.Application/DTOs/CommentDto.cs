namespace LinkedIn.Application.DTOs;

public class CommentDto
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public UserDto Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
    public int LikesCount { get; set; }
    public bool IsLiked { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateCommentDto
{
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}
