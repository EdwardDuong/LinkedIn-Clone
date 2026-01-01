using MediatR;

namespace LinkedIn.Application.Features.Messages.Commands.MarkMessagesAsRead;

public class MarkMessagesAsReadCommand : IRequest<bool>
{
    public Guid ConversationId { get; set; }
    public Guid UserId { get; set; }
}
