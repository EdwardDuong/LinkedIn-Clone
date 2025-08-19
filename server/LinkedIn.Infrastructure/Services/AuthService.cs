using AutoMapper;
using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtService _jwtService;
    private readonly IMapper _mapper;

    // Simple in-memory refresh token store (in production, use database or Redis)
    private static readonly Dictionary<string, (Guid UserId, DateTime ExpiresAt)> _refreshTokens = new();

    public AuthService(
        UserManager<ApplicationUser> userManager,
        IJwtService jwtService,
        IMapper mapper)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto, CancellationToken cancellationToken = default)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Create new user
        var user = new ApplicationUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create user: {errors}");
        }

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Store refresh token
        _refreshTokens[refreshToken] = (user.Id, DateTime.UtcNow.AddDays(7));

        return new AuthResponseDto
        {
            User = _mapper.Map<UserDto>(user),
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto, CancellationToken cancellationToken = default)
    {
        // Find user by email
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Verify password
        var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!isPasswordValid)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Update last login
        user.LastLogin = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Store refresh token
        _refreshTokens[refreshToken] = (user.Id, DateTime.UtcNow.AddDays(7));

        return new AuthResponseDto
        {
            User = _mapper.Map<UserDto>(user),
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        // Validate refresh token
        if (!_refreshTokens.TryGetValue(refreshToken, out var tokenData))
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        if (tokenData.ExpiresAt < DateTime.UtcNow)
        {
            _refreshTokens.Remove(refreshToken);
            throw new UnauthorizedAccessException("Refresh token expired");
        }

        // Get user
        var user = await _userManager.FindByIdAsync(tokenData.UserId.ToString());
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        // Generate new tokens
        var newAccessToken = _jwtService.GenerateAccessToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        // Remove old refresh token and store new one
        _refreshTokens.Remove(refreshToken);
        _refreshTokens[newRefreshToken] = (user.Id, DateTime.UtcNow.AddDays(7));

        return new AuthResponseDto
        {
            User = _mapper.Map<UserDto>(user),
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        };
    }

    public Task<bool> RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var removed = _refreshTokens.Remove(refreshToken);
        return Task.FromResult(removed);
    }
}
