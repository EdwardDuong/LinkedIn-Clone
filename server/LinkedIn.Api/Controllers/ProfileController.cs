using LinkedIn.Application.DTOs;
using LinkedIn.Application.Features.Profile.Commands.AddEducation;
using LinkedIn.Application.Features.Profile.Commands.AddExperience;
using LinkedIn.Application.Features.Profile.Commands.DeleteEducation;
using LinkedIn.Application.Features.Profile.Commands.DeleteExperience;
using LinkedIn.Application.Features.Profile.Queries.GetUserEducation;
using LinkedIn.Application.Features.Profile.Queries.GetUserExperiences;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LinkedIn.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(IMediator mediator, ILogger<ProfileController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    #region Experience Endpoints

    /// <summary>
    /// Get user experiences
    /// </summary>
    [HttpGet("{userId}/experiences")]
    [ProducesResponseType(typeof(List<ExperienceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetExperiences(Guid userId)
    {
        try
        {
            var query = new GetUserExperiencesQuery { UserId = userId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching experiences");
            return StatusCode(500, new { message = "An error occurred while fetching experiences" });
        }
    }

    /// <summary>
    /// Add experience
    /// </summary>
    [HttpPost("experiences")]
    [ProducesResponseType(typeof(ExperienceDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AddExperience([FromBody] CreateExperienceDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new AddExperienceCommand
            {
                UserId = userId.Value,
                Title = dto.Title,
                Company = dto.Company,
                Location = dto.Location,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                IsCurrent = dto.IsCurrent
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(AddExperience), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding experience");
            return StatusCode(500, new { message = "An error occurred while adding experience" });
        }
    }

    /// <summary>
    /// Delete experience
    /// </summary>
    [HttpDelete("experiences/{experienceId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteExperience(Guid experienceId)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new DeleteExperienceCommand
            {
                ExperienceId = experienceId,
                UserId = userId.Value
            };

            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = "Experience not found" });
            }

            return Ok(new { message = "Experience deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting experience");
            return StatusCode(500, new { message = "An error occurred while deleting experience" });
        }
    }

    #endregion

    #region Education Endpoints

    /// <summary>
    /// Get user education
    /// </summary>
    [HttpGet("{userId}/education")]
    [ProducesResponseType(typeof(List<EducationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEducation(Guid userId)
    {
        try
        {
            var query = new GetUserEducationQuery { UserId = userId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching education");
            return StatusCode(500, new { message = "An error occurred while fetching education" });
        }
    }

    /// <summary>
    /// Add education
    /// </summary>
    [HttpPost("education")]
    [ProducesResponseType(typeof(EducationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AddEducation([FromBody] CreateEducationDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new AddEducationCommand
            {
                UserId = userId.Value,
                School = dto.School,
                Degree = dto.Degree,
                FieldOfStudy = dto.FieldOfStudy,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Grade = dto.Grade
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(AddEducation), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding education");
            return StatusCode(500, new { message = "An error occurred while adding education" });
        }
    }

    /// <summary>
    /// Delete education
    /// </summary>
    [HttpDelete("education/{educationId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEducation(Guid educationId)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var command = new DeleteEducationCommand
            {
                EducationId = educationId,
                UserId = userId.Value
            };

            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = "Education not found" });
            }

            return Ok(new { message = "Education deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting education");
            return StatusCode(500, new { message = "An error occurred while deleting education" });
        }
    }

    #endregion

    private Guid? GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
