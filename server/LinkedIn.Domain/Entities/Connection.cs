using LinkedIn.Domain.Common;
using LinkedIn.Domain.Enums;

namespace LinkedIn.Domain.Entities;

public class Connection : BaseEntity
{
    public Guid RequesterId { get; set; }
    public Guid RecipientId { get; set; }
    public ConnectionStatus Status { get; set; } = ConnectionStatus.Pending;

    // Navigation properties
    public virtual ApplicationUser Requester { get; set; } = null!;
    public virtual ApplicationUser Recipient { get; set; } = null!;
}
