using DSALearningHub.Core.Enums;

namespace DSALearningHub.Core.Models;

public class Flashcard
{
    public int Id { get; set; }
    public int TopicId { get; set; }
    public string Front { get; set; } = string.Empty;
    public string Back { get; set; } = string.Empty;
    public Difficulty Difficulty { get; set; }
    public string Tags { get; set; } = string.Empty; // Comma separated

    // Navigation property
    public Topic? Topic { get; set; }
}
