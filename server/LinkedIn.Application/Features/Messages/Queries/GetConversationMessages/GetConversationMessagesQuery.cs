using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Messages.Queries.GetConversationMessages;

public class GetConversationMessagesQuery : IRequest<List<MessageDto>>
{
    public Guid ConversationId { get; set; }
    public Guid UserId { get; set; }
}
