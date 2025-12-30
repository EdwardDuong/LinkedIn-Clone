using LinkedIn.Application.Features.Notifications.Commands.MarkAsRead;
using LinkedIn.Application.Features.Notifications.Queries.GetUserNotifications;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LinkedIn.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(IMediator mediator, ILogger<NotificationsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get user notifications
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<NotificationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetNotifications([FromQuery] bool unreadOnly = false)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var query = new GetUserNotificationsQuery
            {
                UserId = userId.Value,
                UnreadOnly = unreadOnly
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching notifications");
            return StatusCode(500, new { message = "An error occurred while fetching notifications" });
        }
    }

    /// <summary>
    /// Mark notification as read
    /// </summary>
    [HttpPut("{notificationId}/read")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsRead(Guid notificationId)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new MarkNotificationAsReadCommand
            {
                NotificationId = notificationId,
                UserId = userId.Value
            };

            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = "Notification not found" });
            }

            return Ok(new { message = "Notification marked as read" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification as read");
            return StatusCode(500, new { message = "An error occurred while marking notification as read" });
        }
    }

    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
