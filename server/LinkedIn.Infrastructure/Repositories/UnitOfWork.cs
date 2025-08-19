using LinkedIn.Application.Interfaces;
using LinkedIn.Domain.Entities;
using LinkedIn.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace LinkedIn.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    // Lazy initialization for repositories
    private IRepository<Post>? _posts;
    private IRepository<Comment>? _comments;
    private IRepository<PostLike>? _postLikes;
    private IRepository<CommentLike>? _commentLikes;
    private IRepository<Connection>? _connections;
    private IRepository<Conversation>? _conversations;
    private IRepository<Message>? _messages;
    private IRepository<Notification>? _notifications;
    private IRepository<Job>? _jobs;
    private IRepository<JobApplication>? _jobApplications;
    private IRepository<UserSkill>? _userSkills;
    private IRepository<UserExperience>? _userExperiences;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IRepository<Post> Posts => _posts ??= new Repository<Post>(_context);
    public IRepository<Comment> Comments => _comments ??= new Repository<Comment>(_context);
    public IRepository<PostLike> PostLikes => _postLikes ??= new Repository<PostLike>(_context);
    public IRepository<CommentLike> CommentLikes => _commentLikes ??= new Repository<CommentLike>(_context);
    public IRepository<Connection> Connections => _connections ??= new Repository<Connection>(_context);
    public IRepository<Conversation> Conversations => _conversations ??= new Repository<Conversation>(_context);
    public IRepository<Message> Messages => _messages ??= new Repository<Message>(_context);
    public IRepository<Notification> Notifications => _notifications ??= new Repository<Notification>(_context);
    public IRepository<Job> Jobs => _jobs ??= new Repository<Job>(_context);
    public IRepository<JobApplication> JobApplications => _jobApplications ??= new Repository<JobApplication>(_context);
    public IRepository<UserSkill> UserSkills => _userSkills ??= new Repository<UserSkill>(_context);
    public IRepository<UserExperience> UserExperiences => _userExperiences ??= new Repository<UserExperience>(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await SaveChangesAsync(cancellationToken);
            if (_transaction != null)
            {
                await _transaction.CommitAsync(cancellationToken);
            }
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
