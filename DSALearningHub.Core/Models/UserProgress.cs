namespace DSALearningHub.Core.Models;

public class UserProgress
{
    public int Id { get; set; }
    public long UserId { get; set; } // Telegram User ID
    public int TopicId { get; set; }
    public int QuestionsAnswered { get; set; }
    public int CorrectAnswers { get; set; }
    
    // Global User Stats (could be separated into a User model)
    public int CurrentStreak { get; set; }
    public int BestStreak { get; set; }
    public int XP { get; set; }
    public int Level { get; set; }
    public DateTime LastActiveDate { get; set; }

    // Navigation property
    public Topic? Topic { get; set; }
}
