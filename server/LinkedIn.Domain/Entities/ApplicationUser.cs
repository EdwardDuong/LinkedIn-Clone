using Microsoft.AspNetCore.Identity;

namespace LinkedIn.Domain.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Headline { get; set; }
    public string? ProfilePicture { get; set; }
    public string? CoverImage { get; set; }
    public string? About { get; set; }
    public string? Location { get; set; }
    public string? Industry { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLogin { get; set; }
    public bool IsVerified { get; set; } = false;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<PostLike> PostLikes { get; set; } = new List<PostLike>();
    public virtual ICollection<CommentLike> CommentLikes { get; set; } = new List<CommentLike>();
    public virtual ICollection<Connection> SentConnections { get; set; } = new List<Connection>();
    public virtual ICollection<Connection> ReceivedConnections { get; set; } = new List<Connection>();
    public virtual ICollection<Conversation> ConversationsAsParticipantOne { get; set; } = new List<Conversation>();
    public virtual ICollection<Conversation> ConversationsAsParticipantTwo { get; set; } = new List<Conversation>();
    public virtual ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public virtual ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public virtual ICollection<Notification> NotificationsSent { get; set; } = new List<Notification>();
    public virtual ICollection<Job> JobsPosted { get; set; } = new List<Job>();
    public virtual ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
    public virtual ICollection<UserSkill> Skills { get; set; } = new List<UserSkill>();
    public virtual ICollection<UserExperience> Experiences { get; set; } = new List<UserExperience>();
}
