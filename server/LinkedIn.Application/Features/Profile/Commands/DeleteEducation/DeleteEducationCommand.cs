using MediatR;

namespace LinkedIn.Application.Features.Profile.Commands.DeleteEducation;

public class DeleteEducationCommand : IRequest<bool>
{
    public Guid EducationId { get; set; }
    public Guid UserId { get; set; }
}
