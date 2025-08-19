using LinkedIn.Domain.Common;
using LinkedIn.Domain.Enums;

namespace LinkedIn.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public NotificationType Type { get; set; }
    public Guid? SenderId { get; set; }
    public Guid? ReferenceId { get; set; } // ID of the related entity (post, comment, etc.)
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual ApplicationUser? Sender { get; set; }
}
