using LinkedIn.Domain.Common;
using LinkedIn.Domain.Enums;

namespace LinkedIn.Domain.Entities;

public class Job : BaseEntity
{
    public Guid CompanyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public EmploymentType EmploymentType { get; set; }
    public WorkplaceType WorkplaceType { get; set; }
    public ExperienceLevel ExperienceLevel { get; set; }
    public string? SalaryRange { get; set; }
    public string SkillsRequired { get; set; } = string.Empty; // JSON array of skills
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ApplicationUser Company { get; set; } = null!;
    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}
