using LinkedIn.Application.DTOs;
using LinkedIn.Domain.Enums;
using MediatR;

namespace LinkedIn.Application.Features.Connections.Commands.UpdateConnection;

public class UpdateConnectionCommand : IRequest<ConnectionDto>
{
    public Guid ConnectionId { get; set; }
    public Guid UserId { get; set; }
    public ConnectionStatus Status { get; set; }
}
