using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class Comment : BaseEntity
{
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
    public int LikesCount { get; set; } = 0;

    // Navigation properties
    public virtual Post Post { get; set; } = null!;
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual Comment? ParentComment { get; set; }
    public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();
    public virtual ICollection<CommentLike> Likes { get; set; } = new List<CommentLike>();
}
