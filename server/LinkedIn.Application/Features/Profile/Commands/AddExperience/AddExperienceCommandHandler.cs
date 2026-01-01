using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Commands.AddExperience;

public class AddExperienceCommandHandler : IRequestHandler<AddExperienceCommand, ExperienceDto>
{
    private readonly IRepository<Experience> _experienceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AddExperienceCommandHandler(
        IRepository<Experience> experienceRepository,
        IUnitOfWork _unitOfWork,
        IMapper mapper)
    {
        _experienceRepository = experienceRepository;
        this._unitOfWork = _unitOfWork;
        _mapper = mapper;
    }

    public async Task<ExperienceDto> Handle(AddExperienceCommand request, CancellationToken cancellationToken)
    {
        var experience = new Experience
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Title = request.Title,
            Company = request.Company,
            Location = request.Location,
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsCurrent = request.IsCurrent,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _experienceRepository.AddAsync(experience, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ExperienceDto>(experience);
    }
}
