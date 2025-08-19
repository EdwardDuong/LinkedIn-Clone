using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class Conversation : BaseEntity
{
    public Guid ParticipantOneId { get; set; }
    public Guid ParticipantTwoId { get; set; }
    public DateTime LastMessageAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ApplicationUser ParticipantOne { get; set; } = null!;
    public virtual ApplicationUser ParticipantTwo { get; set; } = null!;
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
