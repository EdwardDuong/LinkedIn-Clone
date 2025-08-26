using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Connections.Queries.GetUserConnections;

public class GetUserConnectionsQuery : IRequest<List<ConnectionDto>>
{
    public Guid UserId { get; set; }
}
