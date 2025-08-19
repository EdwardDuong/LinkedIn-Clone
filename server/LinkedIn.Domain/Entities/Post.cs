using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class Post : BaseEntity
{
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public string? MediaType { get; set; } // image, video, document
    public int LikesCount { get; set; } = 0;
    public int CommentsCount { get; set; } = 0;
    public int SharesCount { get; set; } = 0;

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
}
