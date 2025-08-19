using LinkedIn.Domain.Common;
using LinkedIn.Domain.Enums;

namespace LinkedIn.Domain.Entities;

public class JobApplication : BaseEntity
{
    public Guid JobId { get; set; }
    public Guid UserId { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public string? ResumeUrl { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;

    // Navigation properties
    public virtual Job Job { get; set; } = null!;
    public virtual ApplicationUser User { get; set; } = null!;
}
