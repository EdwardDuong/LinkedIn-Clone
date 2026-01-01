using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Commands.DeleteExperience;

public class DeleteExperienceCommandHandler : IRequestHandler<DeleteExperienceCommand, bool>
{
    private readonly IRepository<Experience> _experienceRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteExperienceCommandHandler(
        IRepository<Experience> experienceRepository,
        IUnitOfWork unitOfWork)
    {
        _experienceRepository = experienceRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteExperienceCommand request, CancellationToken cancellationToken)
    {
        var experience = await _experienceRepository.GetByIdAsync(request.ExperienceId, cancellationToken);

        if (experience == null || experience.UserId != request.UserId)
        {
            return false;
        }

        await _experienceRepository.DeleteAsync(experience, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
