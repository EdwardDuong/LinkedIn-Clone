using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;

namespace LinkedIn.Application.Features.Profile.Commands.DeleteEducation;

public class DeleteEducationCommandHandler : IRequestHandler<DeleteEducationCommand, bool>
{
    private readonly IRepository<Education> _educationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteEducationCommandHandler(
        IRepository<Education> educationRepository,
        IUnitOfWork unitOfWork)
    {
        _educationRepository = educationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteEducationCommand request, CancellationToken cancellationToken)
    {
        var education = await _educationRepository.GetByIdAsync(request.EducationId, cancellationToken);

        if (education == null || education.UserId != request.UserId)
        {
            return false;
        }

        await _educationRepository.DeleteAsync(education, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
