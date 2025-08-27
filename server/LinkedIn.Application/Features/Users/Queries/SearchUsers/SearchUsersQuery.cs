using LinkedIn.Application.DTOs;
using MediatR;

namespace LinkedIn.Application.Features.Users.Queries.SearchUsers;

public class SearchUsersQuery : IRequest<List<UserDto>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public Guid CurrentUserId { get; set; }
    public int Limit { get; set; } = 20;
}
