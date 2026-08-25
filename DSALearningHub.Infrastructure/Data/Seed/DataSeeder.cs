using System.Text.Json;
using DSALearningHub.Core.Models;

namespace DSALearningHub.Infrastructure.Data.Seed;

public static class DataSeeder
{
    public static async Task SeedDataAsync(AppDbContext context, string contentPath)
    {
        await context.Database.EnsureCreatedAsync();

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        // Seed Topics
        var topicsPath = Path.Combine(contentPath, "topics");
        if (Directory.Exists(topicsPath))
        {
            var files = Directory.GetFiles(topicsPath, "*.json");
            foreach (var file in files)
            {
                var json = await File.ReadAllTextAsync(file);
                var topic = JsonSerializer.Deserialize<Topic>(json, options);
                if (topic != null)
                {
                    if (!context.Topics.Any(t => t.Name == topic.Name))
                    {
                        topic.Id = 0;
                        context.Topics.Add(topic);
                    }
                }
            }
            await context.SaveChangesAsync();
        }

        // Seed Questions
        var questionsPath = Path.Combine(contentPath, "questions");
        if (Directory.Exists(questionsPath))
        {
            var files = Directory.GetFiles(questionsPath, "*.json");
            foreach (var file in files)
            {
                var json = await File.ReadAllTextAsync(file);
                var questions = JsonSerializer.Deserialize<List<Question>>(json, options);
                if (questions != null && questions.Any())
                {
                    foreach (var q in questions) 
                    {
                        if (!context.Questions.Any(existing => existing.Content == q.Content))
                        {
                            q.Id = 0;
                            context.Questions.Add(q);
                        }
                    }
                }
            }
            await context.SaveChangesAsync();
        }

        // Seed Flashcards
        var flashcardsPath = Path.Combine(contentPath, "flashcards");
        if (Directory.Exists(flashcardsPath))
        {
            var files = Directory.GetFiles(flashcardsPath, "*.json");
            foreach (var file in files)
            {
                var json = await File.ReadAllTextAsync(file);
                var flashcards = JsonSerializer.Deserialize<List<Flashcard>>(json, options);
                if (flashcards != null && flashcards.Any())
                {
                    foreach (var f in flashcards)
                    {
                        if (!context.Flashcards.Any(existing => existing.Front == f.Front))
                        {
                            f.Id = 0;
                            context.Flashcards.Add(f);
                        }
                    }
                }
            }
            await context.SaveChangesAsync();
        }
    }
}
