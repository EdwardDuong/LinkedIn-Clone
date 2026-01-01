using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Messages.Commands.SendMessage;

public class SendMessageCommand : IRequest<MessageDto>
{
    public Guid SenderId { get; set; }
    public Guid RecipientId { get; set; }
    public string Content { get; set; } = string.Empty;
}
