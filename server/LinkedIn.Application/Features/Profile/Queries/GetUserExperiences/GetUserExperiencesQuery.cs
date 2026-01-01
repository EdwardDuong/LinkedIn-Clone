using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Queries.GetUserExperiences;

public class GetUserExperiencesQuery : IRequest<List<ExperienceDto>>
{
    public Guid UserId { get; set; }
}
