using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class Experience : BaseEntity
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; } = false;

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
}
