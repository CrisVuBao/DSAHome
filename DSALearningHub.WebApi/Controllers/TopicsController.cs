using DSALearningHub.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DSALearningHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TopicsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TopicsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTopics()
    {
        var topics = await _context.Topics
            .OrderBy(t => t.Order)
            .Select(t => new { t.Id, t.Name, t.Difficulty, t.Description })
            .ToListAsync();
        return Ok(topics);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTopic(int id)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic == null) return NotFound();
        return Ok(topic);
    }

    [HttpGet("{id}/questions")]
    public async Task<IActionResult> GetTopicQuestions(int id)
    {
        var questions = await _context.Questions
            .Where(q => q.TopicId == id)
            .Select(q => new 
            {
                q.Id,
                q.Content,
                q.Options,
                q.CorrectAnswer,
                q.Explanation
            })
            .ToListAsync();
            
        return Ok(questions);
    }
}
