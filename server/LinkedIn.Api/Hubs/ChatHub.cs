using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace LinkedIn.Api.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(IUnitOfWork unitOfWork, ILogger<ChatHub> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (userId.HasValue)
        {
            // Join user's personal room for receiving messages
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation("User {UserId} connected to ChatHub", userId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (userId.HasValue)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation("User {UserId} disconnected from ChatHub", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Send a message to another user
    /// </summary>
    public async Task SendMessage(string recipientId, string content)
    {
        var senderId = GetUserId();
        if (!senderId.HasValue)
        {
            throw new HubException("User not authenticated");
        }

        if (!Guid.TryParse(recipientId, out var recipientGuid))
        {
            throw new HubException("Invalid recipient ID");
        }

        // Find or create conversation
        var conversation = await _unitOfWork.Conversations.FirstOrDefaultAsync(c =>
            (c.ParticipantOneId == senderId && c.ParticipantTwoId == recipientGuid) ||
            (c.ParticipantOneId == recipientGuid && c.ParticipantTwoId == senderId));

        if (conversation == null)
        {
            conversation = new Conversation
            {
                ParticipantOneId = senderId.Value,
                ParticipantTwoId = recipientGuid,
                LastMessageAt = DateTime.UtcNow
            };
            await _unitOfWork.Conversations.AddAsync(conversation);
        }
        else
        {
            conversation.LastMessageAt = DateTime.UtcNow;
            await _unitOfWork.Conversations.UpdateAsync(conversation);
        }

        // Create message
        var message = new Message
        {
            ConversationId = conversation.Id,
            SenderId = senderId.Value,
            RecipientId = recipientGuid,
            Content = content,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Messages.AddAsync(message);
        await _unitOfWork.SaveChangesAsync();

        // Send to recipient's room
        await Clients.Group($"user_{recipientId}").SendAsync("ReceiveMessage", new
        {
            id = message.Id,
            conversationId = conversation.Id,
            senderId = senderId.Value,
            recipientId = recipientGuid,
            content = content,
            isRead = false,
            createdAt = message.CreatedAt
        });

        // Confirm to sender
        await Clients.Caller.SendAsync("MessageSent", new
        {
            id = message.Id,
            conversationId = conversation.Id,
            senderId = senderId.Value,
            recipientId = recipientGuid,
            content = content,
            isRead = false,
            createdAt = message.CreatedAt
        });
    }

    /// <summary>
    /// Mark message as read
    /// </summary>
    public async Task MarkAsRead(string messageId)
    {
        var userId = GetUserId();
        if (!userId.HasValue)
        {
            throw new HubException("User not authenticated");
        }

        if (!Guid.TryParse(messageId, out var messageGuid))
        {
            throw new HubException("Invalid message ID");
        }

        var message = await _unitOfWork.Messages.GetByIdAsync(messageGuid);
        if (message == null)
        {
            throw new HubException("Message not found");
        }

        if (message.RecipientId != userId.Value)
        {
            throw new HubException("Unauthorized");
        }

        message.IsRead = true;
        await _unitOfWork.Messages.UpdateAsync(message);
        await _unitOfWork.SaveChangesAsync();

        // Notify sender
        await Clients.Group($"user_{message.SenderId}").SendAsync("MessageRead", new
        {
            messageId = message.Id,
            readAt = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Send typing indicator
    /// </summary>
    public async Task Typing(string recipientId)
    {
        var userId = GetUserId();
        if (userId.HasValue)
        {
            await Clients.Group($"user_{recipientId}").SendAsync("UserTyping", new
            {
                userId = userId.Value,
                timestamp = DateTime.UtcNow
            });
        }
    }

    private Guid? GetUserId()
    {
        var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
