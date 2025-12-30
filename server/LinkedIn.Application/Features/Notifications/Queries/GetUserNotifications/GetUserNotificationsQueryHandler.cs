using AutoMapper;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Notifications.Queries.GetUserNotifications;

public class GetUserNotificationsQueryHandler : IRequestHandler<GetUserNotificationsQuery, List<NotificationDto>>
{
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IMapper _mapper;

    public GetUserNotificationsQueryHandler(IRepository<Notification> notificationRepository, IMapper mapper)
    {
        _notificationRepository = notificationRepository;
        _mapper = mapper;
    }

    public async Task<List<NotificationDto>> Handle(GetUserNotificationsQuery request, CancellationToken cancellationToken)
    {
        var notifications = await _notificationRepository.GetAllAsync(cancellationToken);

        var query = notifications.Where(n => n.UserId == request.UserId);

        if (request.UnreadOnly)
        {
            query = query.Where(n => !n.IsRead);
        }

        var userNotifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<NotificationDto>>(userNotifications);
    }
}
