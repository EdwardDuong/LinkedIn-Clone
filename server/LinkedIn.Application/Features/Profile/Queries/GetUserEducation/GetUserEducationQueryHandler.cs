using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Queries.GetUserEducation;

public class GetUserEducationQueryHandler : IRequestHandler<GetUserEducationQuery, List<EducationDto>>
{
    private readonly IRepository<Education> _educationRepository;
    private readonly IMapper _mapper;

    public GetUserEducationQueryHandler(
        IRepository<Education> educationRepository,
        IMapper mapper)
    {
        _educationRepository = educationRepository;
        _mapper = mapper;
    }

    public async Task<List<EducationDto>> Handle(GetUserEducationQuery request, CancellationToken cancellationToken)
    {
        var education = await _educationRepository.GetAllAsync(cancellationToken);
        var userEducation = education
            .Where(e => e.UserId == request.UserId)
            .OrderByDescending(e => e.StartDate)
            .ToList();

        return _mapper.Map<List<EducationDto>>(userEducation);
    }
}
