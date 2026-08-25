using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System.Text.Json;

namespace DSALearningHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CodeRunController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> RunCode([FromBody] CodeRunRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return BadRequest(new { Error = "Code cannot be empty" });

        var consoleOut = new StringWriter();
        var originalConsoleOut = Console.Out;
        Console.SetOut(consoleOut);

        try
        {
            var scriptOptions = ScriptOptions.Default
                .WithImports("System", "System.Collections.Generic", "System.Linq")
                .WithReferences(typeof(Enumerable).Assembly, typeof(Console).Assembly);

            var state = await CSharpScript.RunAsync(request.Code, scriptOptions);
            
            var output = consoleOut.ToString();
            var result = state.ReturnValue?.ToString() ?? "";
            
            return Ok(new 
            {
                Output = string.IsNullOrWhiteSpace(output) ? result : output,
                HasError = false
            });
        }
        catch (CompilationErrorException e)
        {
            return Ok(new 
            {
                Output = string.Join(Environment.NewLine, e.Diagnostics),
                HasError = true
            });
        }
        catch (Exception e)
        {
            return Ok(new 
            {
                Output = e.Message,
                HasError = true
            });
        }
        finally
        {
            Console.SetOut(originalConsoleOut);
        }
    }
}

public class CodeRunRequest
{
    public string Code { get; set; } = "";
}
