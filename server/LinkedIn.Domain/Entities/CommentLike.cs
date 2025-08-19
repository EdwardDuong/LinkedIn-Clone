using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class CommentLike : BaseEntity
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }

    // Navigation properties
    public virtual Comment Comment { get; set; } = null!;
    public virtual ApplicationUser User { get; set; } = null!;
}
