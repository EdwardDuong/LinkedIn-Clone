using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Queries.GetUserExperiences;

public class GetUserExperiencesQueryHandler : IRequestHandler<GetUserExperiencesQuery, List<ExperienceDto>>
{
    private readonly IRepository<Experience> _experienceRepository;
    private readonly IMapper _mapper;

    public GetUserExperiencesQueryHandler(
        IRepository<Experience> experienceRepository,
        IMapper mapper)
    {
        _experienceRepository = experienceRepository;
        _mapper = mapper;
    }

    public async Task<List<ExperienceDto>> Handle(GetUserExperiencesQuery request, CancellationToken cancellationToken)
    {
        var experiences = await _experienceRepository.GetAllAsync(cancellationToken);
        var userExperiences = experiences
            .Where(e => e.UserId == request.UserId)
            .OrderByDescending(e => e.IsCurrent)
            .ThenByDescending(e => e.StartDate)
            .ToList();

        return _mapper.Map<List<ExperienceDto>>(userExperiences);
    }
}
