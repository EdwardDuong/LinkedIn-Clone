using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Messages.Queries.GetConversations;

public class GetConversationsQuery : IRequest<List<ConversationDto>>
{
    public Guid UserId { get; set; }
}
