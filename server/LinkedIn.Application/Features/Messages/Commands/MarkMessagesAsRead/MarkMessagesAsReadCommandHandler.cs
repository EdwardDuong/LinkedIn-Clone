using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;

namespace LinkedIn.Application.Features.Messages.Commands.MarkMessagesAsRead;

public class MarkMessagesAsReadCommandHandler : IRequestHandler<MarkMessagesAsReadCommand, bool>
{
    private readonly IRepository<Message> _messageRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MarkMessagesAsReadCommandHandler(
        IRepository<Message> messageRepository,
        IUnitOfWork unitOfWork)
    {
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(MarkMessagesAsReadCommand request, CancellationToken cancellationToken)
    {
        var messages = await _messageRepository.GetAllAsync(cancellationToken);
        var unreadMessages = messages
            .Where(m => m.ConversationId == request.ConversationId &&
                       m.RecipientId == request.UserId &&
                       !m.IsRead)
            .ToList();

        foreach (var message in unreadMessages)
        {
            message.IsRead = true;
            message.UpdatedAt = DateTime.UtcNow;
            await _messageRepository.UpdateAsync(message, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
