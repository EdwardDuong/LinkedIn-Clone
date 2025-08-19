using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class PostLike : BaseEntity
{
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }

    // Navigation properties
    public virtual Post Post { get; set; } = null!;
    public virtual ApplicationUser User { get; set; } = null!;
}
