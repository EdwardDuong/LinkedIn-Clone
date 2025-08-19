using LinkedIn.Domain.Common;

namespace LinkedIn.Domain.Entities;

public class UserSkill : BaseEntity
{
    public Guid UserId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public int EndorsementsCount { get; set; } = 0;

    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
}
