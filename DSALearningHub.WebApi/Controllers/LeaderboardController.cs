using DSALearningHub.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DSALearningHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public LeaderboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTopUsers()
    {
        // Group by UserId to sum XP across all topics
        var topUsers = await _context.UserProgresses
            .GroupBy(p => p.UserId)
            .Select(g => new 
            {
                UserId = g.Key,
                TotalXP = g.Sum(p => p.XP),
                TotalCorrect = g.Sum(p => p.CorrectAnswers)
            })
            .OrderByDescending(u => u.TotalXP)
            .Take(10)
            .ToListAsync();

        // In a real app we would join with a Users table to get the Username.
        // For now, we mock the usernames.
        var result = topUsers.Select((u, index) => new 
        {
            Rank = index + 1,
            u.UserId,
            Username = $"Học giả {u.UserId.ToString().Substring(0, 4)}",
            u.TotalXP,
            Level = (u.TotalXP / 100) + 1
        });

        return Ok(result);
    }
}
