using LinkedIn.Domain.Entities;

namespace LinkedIn.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Post> Posts { get; }
    IRepository<Comment> Comments { get; }
    IRepository<PostLike> PostLikes { get; }
    IRepository<CommentLike> CommentLikes { get; }
    IRepository<Connection> Connections { get; }
    IRepository<Conversation> Conversations { get; }
    IRepository<Message> Messages { get; }
    IRepository<Notification> Notifications { get; }
    IRepository<Job> Jobs { get; }
    IRepository<JobApplication> JobApplications { get; }
    IRepository<UserSkill> UserSkills { get; }
    IRepository<UserExperience> UserExperiences { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
