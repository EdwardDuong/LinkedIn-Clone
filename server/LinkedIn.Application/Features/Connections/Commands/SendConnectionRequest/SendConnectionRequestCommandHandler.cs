using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using LinkedIn.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Connections.Commands.SendConnectionRequest;

public class SendConnectionRequestCommandHandler : IRequestHandler<SendConnectionRequestCommand, ConnectionDto>
{
    private readonly IRepository<Connection> _connectionRepository;
    private readonly IRepository<ApplicationUser> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SendConnectionRequestCommandHandler(
        IRepository<Connection> connectionRepository,
        IRepository<ApplicationUser> userRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _connectionRepository = connectionRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ConnectionDto> Handle(SendConnectionRequestCommand request, CancellationToken cancellationToken)
    {
        if (request.RequesterId == request.AddresseeId)
        {
            throw new InvalidOperationException("Cannot send connection request to yourself");
        }

        // Check if addressee exists
        var addressee = await _userRepository.GetByIdAsync(request.AddresseeId, cancellationToken);
        if (addressee == null)
        {
            throw new InvalidOperationException("User not found");
        }

        // Check if connection already exists
        var connections = await _connectionRepository.GetAllAsync(cancellationToken);
        var existingConnection = await connections
            .FirstOrDefaultAsync(c =>
                (c.RequesterId == request.RequesterId && c.AddresseeId == request.AddresseeId) ||
                (c.RequesterId == request.AddresseeId && c.AddresseeId == request.RequesterId),
                cancellationToken);

        if (existingConnection != null)
        {
            throw new InvalidOperationException("Connection request already exists");
        }

        var connection = new Connection
        {
            Id = Guid.NewGuid(),
            RequesterId = request.RequesterId,
            AddresseeId = request.AddresseeId,
            Status = ConnectionStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _connectionRepository.AddAsync(connection, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Load users for response
        var connectionsQuery = await _connectionRepository.GetAllAsync(cancellationToken);
        var connectionWithUsers = await connectionsQuery
            .Include(c => c.Requester)
            .Include(c => c.Addressee)
            .FirstOrDefaultAsync(c => c.Id == connection.Id, cancellationToken);

        return _mapper.Map<ConnectionDto>(connectionWithUsers);
    }
}
