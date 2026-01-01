namespace LinkedIn.Application.DTOs;

public class MessageDto
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public Guid RecipientId { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ConversationDto
{
    public Guid Id { get; set; }
    public PublicUserDto OtherUser { get; set; } = null!;
    public MessageDto? LastMessage { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
}

public class SendMessageDto
{
    public Guid RecipientId { get; set; }
    public string Content { get; set; } = string.Empty;
}
