using LinkedIn.Application.DTOs;
using LinkedIn.Application.Interfaces;
using MediatR;

namespace LinkedIn.Application.Features.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly IAuthService _authService;

    public LoginCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var loginDto = new LoginDto
        {
            Email = request.Email,
            Password = request.Password
        };

        return await _authService.LoginAsync(loginDto, cancellationToken);
    }
}
