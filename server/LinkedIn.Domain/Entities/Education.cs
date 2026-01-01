using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class Education : BaseEntity
{
    public Guid UserId { get; set; }
    public string School { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string? FieldOfStudy { get; set; }
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal? Grade { get; set; }

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
}
