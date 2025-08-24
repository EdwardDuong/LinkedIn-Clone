using LinkedIn.Application.DTOs;
using LinkedIn.Application.Features.Posts.Commands.CreatePost;
using LinkedIn.Application.Features.Posts.Commands.LikePost;
using LinkedIn.Application.Features.Posts.Queries.GetFeed;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LinkedIn.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PostsController> _logger;

    public PostsController(IMediator mediator, ILogger<PostsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Create a new post
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(PostDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new CreatePostCommand
            {
                UserId = userId.Value,
                Content = dto.Content,
                MediaUrl = dto.MediaUrl,
                MediaType = dto.MediaType
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(CreatePost), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating post");
            return StatusCode(500, new { message = "An error occurred while creating the post" });
        }
    }

    /// <summary>
    /// Get user feed
    /// </summary>
    [HttpGet("feed")]
    [ProducesResponseType(typeof(List<PostDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetFeed([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var query = new GetFeedQuery
            {
                UserId = userId.Value,
                Page = page,
                Limit = limit
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching feed");
            return StatusCode(500, new { message = "An error occurred while fetching the feed" });
        }
    }

    /// <summary>
    /// Like or unlike a post
    /// </summary>
    [HttpPost("{postId}/like")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> LikePost(Guid postId)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new LikePostCommand
            {
                UserId = userId.Value,
                PostId = postId
            };

            var isLiked = await _mediator.Send(command);
            return Ok(new { isLiked, message = isLiked ? "Post liked" : "Post unliked" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Post not found");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error liking post");
            return StatusCode(500, new { message = "An error occurred while liking the post" });
        }
    }

    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
