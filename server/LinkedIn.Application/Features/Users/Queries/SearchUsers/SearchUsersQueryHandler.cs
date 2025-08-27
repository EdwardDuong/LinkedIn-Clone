using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Application.Features.Users.Queries.SearchUsers;

public class SearchUsersQueryHandler : IRequestHandler<SearchUsersQuery, List<UserDto>>
{
    private readonly IRepository<ApplicationUser> _userRepository;
    private readonly IMapper _mapper;

    public SearchUsersQueryHandler(IRepository<ApplicationUser> userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<List<UserDto>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);

        var searchResults = await users
            .Where(u => u.Id != request.CurrentUserId && // Exclude current user
                (u.FirstName.ToLower().Contains(request.SearchTerm.ToLower()) ||
                 u.LastName.ToLower().Contains(request.SearchTerm.ToLower()) ||
                 (u.Headline != null && u.Headline.ToLower().Contains(request.SearchTerm.ToLower()))))
            .Take(request.Limit)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<UserDto>>(searchResults);
    }
}
