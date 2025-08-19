using LinkedIn.Domain.Enums;

namespace LinkedIn.Application.Interfaces;

public interface INotificationService
{
    Task SendNotificationAsync(
        Guid userId,
        NotificationType type,
        string content,
        Guid? senderId = null,
        Guid? referenceId = null,
        CancellationToken cancellationToken = default);

    Task SendNotificationToMultipleAsync(
        IEnumerable<Guid> userIds,
        NotificationType type,
        string content,
        Guid? senderId = null,
        Guid? referenceId = null,
        CancellationToken cancellationToken = default);
}
