namespace DSALearningHub.Core.Models;

public class ReviewSchedule
{
    public int Id { get; set; }
    public long UserId { get; set; } // Telegram User ID
    public int FlashcardId { get; set; }
    
    // SM-2 Algorithm parameters
    public DateTime NextReviewDate { get; set; }
    public int Interval { get; set; } // in days
    public double EaseFactor { get; set; } = 2.5; // default starting ease factor
    public int RepetitionCount { get; set; }

    // Navigation property
    public Flashcard? Flashcard { get; set; }
}
