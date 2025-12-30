using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Notifications.Queries.GetUserNotifications;

public class GetUserNotificationsQuery : IRequest<List<NotificationDto>>
{
    public Guid UserId { get; set; }
    public bool UnreadOnly { get; set; } = false;
}

public class NotificationDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Link { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
