using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Connections.Commands.SendConnectionRequest;

public class SendConnectionRequestCommand : IRequest<ConnectionDto>
{
    public Guid RequesterId { get; set; }
    public Guid AddresseeId { get; set; }
}
