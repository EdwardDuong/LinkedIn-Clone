using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Commands.AddEducation;

public class AddEducationCommandHandler : IRequestHandler<AddEducationCommand, EducationDto>
{
    private readonly IRepository<Education> _educationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AddEducationCommandHandler(
        IRepository<Education> educationRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _educationRepository = educationRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<EducationDto> Handle(AddEducationCommand request, CancellationToken cancellationToken)
    {
        var education = new Education
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            School = request.School,
            Degree = request.Degree,
            FieldOfStudy = request.FieldOfStudy,
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Grade = request.Grade,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _educationRepository.AddAsync(education, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<EducationDto>(education);
    }
}
