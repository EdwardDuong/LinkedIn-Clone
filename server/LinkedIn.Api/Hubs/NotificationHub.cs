using LinkedIn.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace LinkedIn.Api.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(IUnitOfWork unitOfWork, ILogger<NotificationHub> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (userId.HasValue)
        {
            // Join user's notification room
            await Groups.AddToGroupAsync(Context.ConnectionId, $"notifications_{userId}");
            _logger.LogInformation("User {UserId} connected to NotificationHub", userId);

            // Send unread count on connect
            var unreadCount = await _unitOfWork.Notifications.CountAsync(n =>
                n.UserId == userId.Value && !n.IsRead);

            await Clients.Caller.SendAsync("UnreadCount", unreadCount);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (userId.HasValue)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"notifications_{userId}");
            _logger.LogInformation("User {UserId} disconnected from NotificationHub", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Mark notification as read
    /// </summary>
    public async Task MarkAsRead(string notificationId)
    {
        var userId = GetUserId();
        if (!userId.HasValue)
        {
            throw new HubException("User not authenticated");
        }

        if (!Guid.TryParse(notificationId, out var notifGuid))
        {
            throw new HubException("Invalid notification ID");
        }

        var notification = await _unitOfWork.Notifications.GetByIdAsync(notifGuid);
        if (notification == null)
        {
            throw new HubException("Notification not found");
        }

        if (notification.UserId != userId.Value)
        {
            throw new HubException("Unauthorized");
        }

        notification.IsRead = true;
        await _unitOfWork.Notifications.UpdateAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        // Send updated unread count
        var unreadCount = await _unitOfWork.Notifications.CountAsync(n =>
            n.UserId == userId.Value && !n.IsRead);

        await Clients.Caller.SendAsync("UnreadCount", unreadCount);
        await Clients.Caller.SendAsync("NotificationRead", notificationId);
    }

    /// <summary>
    /// Mark all notifications as read
    /// </summary>
    public async Task MarkAllAsRead()
    {
        var userId = GetUserId();
        if (!userId.HasValue)
        {
            throw new HubException("User not authenticated");
        }

        var unreadNotifications = await _unitOfWork.Notifications.FindAsync(n =>
            n.UserId == userId.Value && !n.IsRead);

        foreach (var notification in unreadNotifications)
        {
            notification.IsRead = true;
            await _unitOfWork.Notifications.UpdateAsync(notification);
        }

        await _unitOfWork.SaveChangesAsync();

        await Clients.Caller.SendAsync("UnreadCount", 0);
        await Clients.Caller.SendAsync("AllNotificationsRead");
    }

    /// <summary>
    /// Get unread notifications count
    /// </summary>
    public async Task GetUnreadCount()
    {
        var userId = GetUserId();
        if (!userId.HasValue)
        {
            throw new HubException("User not authenticated");
        }

        var unreadCount = await _unitOfWork.Notifications.CountAsync(n =>
            n.UserId == userId.Value && !n.IsRead);

        await Clients.Caller.SendAsync("UnreadCount", unreadCount);
    }

    private Guid? GetUserId()
    {
        var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
