using LinkedIn.Domain.Entities;
using System.Security.Claims;

namespace LinkedIn.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(ApplicationUser user);
    string GenerateRefreshToken();
    ClaimsPrincipal? ValidateToken(string token);
    Guid? GetUserIdFromToken(string token);
}
