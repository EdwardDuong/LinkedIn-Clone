using LinkedIn.Domain.Common;
using LinkedIn.Domain.Enums;

namespace LinkedIn.Domain.Entities;

public class UserExperience : BaseEntity
{
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string? Location { get; set; }
    public EmploymentType EmploymentType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentRole { get; set; } = false;
    public string? Description { get; set; }

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
}
