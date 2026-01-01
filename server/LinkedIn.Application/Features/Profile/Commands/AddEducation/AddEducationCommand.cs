using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Commands.AddEducation;

public class AddEducationCommand : IRequest<EducationDto>
{
    public Guid UserId { get; set; }
    public string School { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string? FieldOfStudy { get; set; }
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal? Grade { get; set; }
}
