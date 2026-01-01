using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Queries.GetUserEducation;

public class GetUserEducationQuery : IRequest<List<EducationDto>>
{
    public Guid UserId { get; set; }
}
