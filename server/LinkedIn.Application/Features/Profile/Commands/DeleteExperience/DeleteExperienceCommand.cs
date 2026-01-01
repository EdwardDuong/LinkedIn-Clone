using MediatR;

namespace LinkedIn.Application.Features.Profile.Commands.DeleteExperience;

public class DeleteExperienceCommand : IRequest<bool>
{
    public Guid ExperienceId { get; set; }
    public Guid UserId { get; set; }
}
