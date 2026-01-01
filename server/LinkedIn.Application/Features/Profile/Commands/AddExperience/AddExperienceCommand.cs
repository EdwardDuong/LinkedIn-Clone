using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Commands.AddExperience;

public class AddExperienceCommand : IRequest<ExperienceDto>
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
}
