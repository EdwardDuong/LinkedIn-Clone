using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using LinkedIn.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Connections.Commands.UpdateConnection;

public class UpdateConnectionCommandHandler : IRequestHandler<UpdateConnectionCommand, ConnectionDto>
{
    private readonly IRepository<Connection> _connectionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateConnectionCommandHandler(
        IRepository<Connection> connectionRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _connectionRepository = connectionRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ConnectionDto> Handle(UpdateConnectionCommand request, CancellationToken cancellationToken)
    {
        var connection = await _connectionRepository.GetByIdAsync(request.ConnectionId, cancellationToken);
        if (connection == null)
        {
            throw new InvalidOperationException("Connection not found");
        }

        // Only the addressee can accept/reject
        if (connection.AddresseeId != request.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to update this connection");
        }

        connection.Status = request.Status;
        connection.UpdatedAt = DateTime.UtcNow;

        await _connectionRepository.UpdateAsync(connection, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Load users for response
        var connections = await _connectionRepository.GetAllAsync(cancellationToken);
        var connectionWithUsers = await connections
            .Include(c => c.Requester)
            .Include(c => c.Addressee)
            .FirstOrDefaultAsync(c => c.Id == connection.Id, cancellationToken);

        return _mapper.Map<ConnectionDto>(connectionWithUsers);
    }
}
