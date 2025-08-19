using LinkedIn.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LinkedIn.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<PostLike> PostLikes { get; set; }
    public DbSet<CommentLike> CommentLikes { get; set; }
    public DbSet<Connection> Connections { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<JobApplication> JobApplications { get; set; }
    public DbSet<UserSkill> UserSkills { get; set; }
    public DbSet<UserExperience> UserExperiences { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure ApplicationUser
        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("Users");
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Headline).HasMaxLength(200);
            entity.Property(e => e.About).HasMaxLength(2000);
        });

        // Configure Post
        modelBuilder.Entity<Post>(entity =>
        {
            entity.ToTable("Posts");
            entity.HasIndex(e => new { e.UserId, e.CreatedAt });
            entity.Property(e => e.Content).IsRequired().HasMaxLength(3000);
            entity.Property(e => e.MediaType).HasMaxLength(50);

            entity.HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Comment
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.ToTable("Comments");
            entity.HasIndex(e => new { e.PostId, e.CreatedAt });
            entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);

            entity.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure PostLike
        modelBuilder.Entity<PostLike>(entity =>
        {
            entity.ToTable("PostLikes");
            entity.HasIndex(e => new { e.PostId, e.UserId }).IsUnique();

            entity.HasOne(pl => pl.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(pl => pl.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pl => pl.User)
                .WithMany(u => u.PostLikes)
                .HasForeignKey(pl => pl.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure CommentLike
        modelBuilder.Entity<CommentLike>(entity =>
        {
            entity.ToTable("CommentLikes");
            entity.HasIndex(e => new { e.CommentId, e.UserId }).IsUnique();

            entity.HasOne(cl => cl.Comment)
                .WithMany(c => c.Likes)
                .HasForeignKey(cl => cl.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(cl => cl.User)
                .WithMany(u => u.CommentLikes)
                .HasForeignKey(cl => cl.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Connection
        modelBuilder.Entity<Connection>(entity =>
        {
            entity.ToTable("Connections");
            entity.HasIndex(e => new { e.RequesterId, e.RecipientId }).IsUnique();
            entity.HasIndex(e => new { e.Status, e.RequesterId });
            entity.HasIndex(e => new { e.Status, e.RecipientId });

            entity.HasOne(c => c.Requester)
                .WithMany(u => u.SentConnections)
                .HasForeignKey(c => c.RequesterId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Recipient)
                .WithMany(u => u.ReceivedConnections)
                .HasForeignKey(c => c.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Conversation
        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.ToTable("Conversations");
            entity.HasIndex(e => new { e.ParticipantOneId, e.ParticipantTwoId }).IsUnique();
            entity.HasIndex(e => e.LastMessageAt);

            entity.HasOne(c => c.ParticipantOne)
                .WithMany(u => u.ConversationsAsParticipantOne)
                .HasForeignKey(c => c.ParticipantOneId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.ParticipantTwo)
                .WithMany(u => u.ConversationsAsParticipantTwo)
                .HasForeignKey(c => c.ParticipantTwoId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Message
        modelBuilder.Entity<Message>(entity =>
        {
            entity.ToTable("Messages");
            entity.HasIndex(e => new { e.ConversationId, e.CreatedAt });
            entity.HasIndex(e => new { e.RecipientId, e.IsRead });
            entity.Property(e => e.Content).IsRequired().HasMaxLength(2000);

            entity.HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(m => m.Recipient)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Notification
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasIndex(e => new { e.UserId, e.IsRead });
            entity.HasIndex(e => e.CreatedAt);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(500);

            entity.HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(n => n.Sender)
                .WithMany(u => u.NotificationsSent)
                .HasForeignKey(n => n.SenderId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Job
        modelBuilder.Entity<Job>(entity =>
        {
            entity.ToTable("Jobs");
            entity.HasIndex(e => new { e.IsActive, e.CreatedAt });
            entity.HasIndex(e => e.Location);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(5000);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.SalaryRange).HasMaxLength(100);

            entity.HasOne(j => j.Company)
                .WithMany(u => u.JobsPosted)
                .HasForeignKey(j => j.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure JobApplication
        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.ToTable("JobApplications");
            entity.HasIndex(e => new { e.JobId, e.UserId }).IsUnique();
            entity.HasIndex(e => new { e.UserId, e.Status });
            entity.Property(e => e.CoverLetter).HasMaxLength(2000);

            entity.HasOne(ja => ja.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(ja => ja.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ja => ja.User)
                .WithMany(u => u.JobApplications)
                .HasForeignKey(ja => ja.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure UserSkill
        modelBuilder.Entity<UserSkill>(entity =>
        {
            entity.ToTable("UserSkills");
            entity.HasIndex(e => new { e.UserId, e.SkillName }).IsUnique();
            entity.Property(e => e.SkillName).IsRequired().HasMaxLength(100);

            entity.HasOne(us => us.User)
                .WithMany(u => u.Skills)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure UserExperience
        modelBuilder.Entity<UserExperience>(entity =>
        {
            entity.ToTable("UserExperiences");
            entity.HasIndex(e => new { e.UserId, e.StartDate });
            entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.JobTitle).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);

            entity.HasOne(ue => ue.User)
                .WithMany(u => u.Experiences)
                .HasForeignKey(ue => ue.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Rename Identity tables for cleaner naming
        modelBuilder.Entity<IdentityRole<Guid>>().ToTable("Roles");
        modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
        modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
        modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
        modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");
        modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is ApplicationUser user)
            {
                if (entry.State == EntityState.Modified)
                {
                    user.UpdatedAt = DateTime.UtcNow;
                }
            }

            var updatedAtProperty = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "UpdatedAt");
            if (updatedAtProperty != null && entry.State == EntityState.Modified)
            {
                updatedAtProperty.CurrentValue = DateTime.UtcNow;
            }
        }
    }
}
