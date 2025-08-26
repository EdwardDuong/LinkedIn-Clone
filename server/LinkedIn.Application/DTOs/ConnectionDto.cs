using LinkedIn.Domain.Enums;

namespace LinkedIn.Application.DTOs;

public class ConnectionDto
{
    public Guid Id { get; set; }
    public Guid RequesterId { get; set; }
    public UserDto Requester { get; set; } = null!;
    public Guid AddresseeId { get; set; }
    public UserDto Addressee { get; set; } = null!;
    public ConnectionStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class SendConnectionRequestDto
{
    public Guid AddresseeId { get; set; }
}

public class UpdateConnectionDto
{
    public ConnectionStatus Status { get; set; }
}
