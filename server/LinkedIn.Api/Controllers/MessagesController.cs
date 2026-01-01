using LinkedIn.Application.DTOs;
using LinkedIn.Application.Features.Messages.Commands.MarkMessagesAsRead;
using LinkedIn.Application.Features.Messages.Commands.SendMessage;
using LinkedIn.Application.Features.Messages.Queries.GetConversationMessages;
using LinkedIn.Application.Features.Messages.Queries.GetConversations;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LinkedIn.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<MessagesController> _logger;

    public MessagesController(IMediator mediator, ILogger<MessagesController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get all conversations for the current user
    /// </summary>
    [HttpGet("conversations")]
    [ProducesResponseType(typeof(List<ConversationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetConversations()
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var query = new GetConversationsQuery { UserId = userId.Value };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching conversations");
            return StatusCode(500, new { message = "An error occurred while fetching conversations" });
        }
    }

    /// <summary>
    /// Get messages for a specific conversation
    /// </summary>
    [HttpGet("conversations/{conversationId}")]
    [ProducesResponseType(typeof(List<MessageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetConversationMessages(Guid conversationId)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var query = new GetConversationMessagesQuery
            {
                ConversationId = conversationId,
                UserId = userId.Value
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching conversation messages");
            return StatusCode(500, new { message = "An error occurred while fetching messages" });
        }
    }

    /// <summary>
    /// Send a message
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(MessageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new SendMessageCommand
            {
                SenderId = userId.Value,
                RecipientId = dto.RecipientId,
                Content = dto.Content
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(SendMessage), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            return StatusCode(500, new { message = "An error occurred while sending the message" });
        }
    }

    /// <summary>
    /// Mark messages in a conversation as read
    /// </summary>
    [HttpPut("conversations/{conversationId}/read")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> MarkAsRead(Guid conversationId)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new MarkMessagesAsReadCommand
            {
                ConversationId = conversationId,
                UserId = userId.Value
            };

            await _mediator.Send(command);
            return Ok(new { message = "Messages marked as read" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking messages as read");
            return StatusCode(500, new { message = "An error occurred while marking messages as read" });
        }
    }

    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
