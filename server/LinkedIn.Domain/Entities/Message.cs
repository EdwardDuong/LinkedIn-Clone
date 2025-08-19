using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class Message : BaseEntity
{
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public Guid RecipientId { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;

    // Navigation properties
    public virtual Conversation Conversation { get; set; } = null!;
    public virtual ApplicationUser Sender { get; set; } = null!;
    public virtual ApplicationUser Recipient { get; set; } = null!;
}
