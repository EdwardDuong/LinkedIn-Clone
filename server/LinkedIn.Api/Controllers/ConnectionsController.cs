using LinkedIn.Application.DTOs;
using LinkedIn.Application.Features.Connections.Commands.SendConnectionRequest;
using LinkedIn.Application.Features.Connections.Commands.UpdateConnection;
using LinkedIn.Application.Features.Connections.Queries.GetUserConnections;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LinkedIn.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ConnectionsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ConnectionsController> _logger;

    public ConnectionsController(IMediator mediator, ILogger<ConnectionsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Send a connection request
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ConnectionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SendConnectionRequest([FromBody] SendConnectionRequestDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new SendConnectionRequestCommand
            {
                RequesterId = userId.Value,
                AddresseeId = dto.AddresseeId
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetMyConnections), result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Failed to send connection request");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending connection request");
            return StatusCode(500, new { message = "An error occurred while sending the connection request" });
        }
    }

    /// <summary>
    /// Update connection status (accept/reject)
    /// </summary>
    [HttpPut("{connectionId}")]
    [ProducesResponseType(typeof(ConnectionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateConnection(Guid connectionId, [FromBody] UpdateConnectionDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new UpdateConnectionCommand
            {
                ConnectionId = connectionId,
                UserId = userId.Value,
                Status = dto.Status
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Connection not found");
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access to connection");
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating connection");
            return StatusCode(500, new { message = "An error occurred while updating the connection" });
        }
    }

    /// <summary>
    /// Get my connections
    /// </summary>
    [HttpGet("my-connections")]
    [ProducesResponseType(typeof(List<ConnectionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyConnections()
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var query = new GetUserConnectionsQuery { UserId = userId.Value };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching connections");
            return StatusCode(500, new { message = "An error occurred while fetching connections" });
        }
    }

    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
