using DSALearningHub.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace DSALearningHub.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Topic> Topics { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;
    public DbSet<Flashcard> Flashcards { get; set; } = null!;
    public DbSet<UserProgress> UserProgresses { get; set; } = null!;
    public DbSet<ReviewSchedule> ReviewSchedules { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Topic mapping
        modelBuilder.Entity<Topic>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasMany(e => e.Questions)
                  .WithOne(q => q.Topic)
                  .HasForeignKey(q => q.TopicId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasMany(e => e.Flashcards)
                  .WithOne(f => f.Topic)
                  .HasForeignKey(f => f.TopicId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ReviewSchedule
        modelBuilder.Entity<ReviewSchedule>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.FlashcardId }).IsUnique();
        });

        // UserProgress
        modelBuilder.Entity<UserProgress>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.TopicId }).IsUnique();
        });
    }
}
