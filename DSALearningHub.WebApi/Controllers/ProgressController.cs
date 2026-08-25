using DSALearningHub.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DSALearningHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgressController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProgressController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserProgress(long userId)
    {
        var progresses = await _context.UserProgresses
            .Include(p => p.Topic)
            .Where(p => p.UserId == userId)
            .ToListAsync();
            
        int totalXP = progresses.Sum(p => p.XP);
        int totalCorrect = progresses.Sum(p => p.CorrectAnswers);
        int level = (totalXP / 100) + 1;
        
        return Ok(new {
            TotalXP = totalXP,
            Level = level,
            TotalCorrect = totalCorrect,
            Details = progresses.Select(p => new {
                TopicName = p.Topic?.Name,
                p.XP,
                p.CorrectAnswers,
                p.QuestionsAnswered
            })
        });
    }
}
