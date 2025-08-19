using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using LinkedIn.Domain.Enums;

namespace LinkedIn.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;

    public NotificationService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task SendNotificationAsync(
        Guid userId,
        NotificationType type,
        string content,
        Guid? senderId = null,
        Guid? referenceId = null,
        CancellationToken cancellationToken = default)
    {
        // Create notification in database
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            Content = content,
            SenderId = senderId,
            ReferenceId = referenceId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Notifications.AddAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Note: Real-time SignalR notification will be sent by the NotificationHub
        // when clients poll for new notifications or via a background service
    }

    public async Task SendNotificationToMultipleAsync(
        IEnumerable<Guid> userIds,
        NotificationType type,
        string content,
        Guid? senderId = null,
        Guid? referenceId = null,
        CancellationToken cancellationToken = default)
    {
        foreach (var userId in userIds)
        {
            await SendNotificationAsync(userId, type, content, senderId, referenceId, cancellationToken);
        }
    }
}
