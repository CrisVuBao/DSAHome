using DSALearningHub.Core.Enums;

namespace DSALearningHub.Core.Models;

public class Question
{
    public int Id { get; set; }
    public int TopicId { get; set; }
    public QuestionType Type { get; set; }
    public Difficulty Difficulty { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Options { get; set; } = string.Empty; // JSON array of strings
    public string CorrectAnswer { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public string Hints { get; set; } = string.Empty; // JSON array or just a string

    // Navigation property
    public Topic? Topic { get; set; }
}
