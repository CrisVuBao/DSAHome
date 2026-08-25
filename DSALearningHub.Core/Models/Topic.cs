using DSALearningHub.Core.Enums;

namespace DSALearningHub.Core.Models;

public class Topic
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public TopicCategory Category { get; set; }
    public Difficulty Difficulty { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Theory { get; set; } = string.Empty; // Markdown content
    public string TimeComplexity { get; set; } = string.Empty;
    public string SpaceComplexity { get; set; } = string.Empty;
    public string CodeExamples { get; set; } = string.Empty; // JSON or markdown
    public string RealWorldExamples { get; set; } = string.Empty;
    public string Prerequisites { get; set; } = string.Empty; // Comma separated IDs or names
    public int Order { get; set; }

    // Navigation properties
    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<Flashcard> Flashcards { get; set; } = new List<Flashcard>();
}
