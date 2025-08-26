using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using LinkedIn.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Connections.Queries.GetUserConnections;

public class GetUserConnectionsQueryHandler : IRequestHandler<GetUserConnectionsQuery, List<ConnectionDto>>
{
    private readonly IRepository<Connection> _connectionRepository;
    private readonly IMapper _mapper;

    public GetUserConnectionsQueryHandler(IRepository<Connection> connectionRepository, IMapper mapper)
    {
        _connectionRepository = connectionRepository;
        _mapper = mapper;
    }

    public async Task<List<ConnectionDto>> Handle(GetUserConnectionsQuery request, CancellationToken cancellationToken)
    {
        var connections = await _connectionRepository.GetAllAsync(cancellationToken);

        var userConnections = await connections
            .Where(c =>
                (c.RequesterId == request.UserId || c.AddresseeId == request.UserId) &&
                c.Status == ConnectionStatus.Accepted)
            .Include(c => c.Requester)
            .Include(c => c.Addressee)
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<ConnectionDto>>(userConnections);
    }
}
