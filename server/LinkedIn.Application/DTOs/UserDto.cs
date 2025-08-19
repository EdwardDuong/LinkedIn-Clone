namespace LinkedIn.Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? ProfilePicture { get; set; }
    public string? Headline { get; set; }
    public string? About { get; set; }
    public string? Location { get; set; }
    public string? Industry { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PublicUserDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? ProfilePicture { get; set; }
    public string? Headline { get; set; }
}
