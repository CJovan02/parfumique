﻿namespace FragranceRecommendation.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController(IDriver driver, IUserService userService, IFragranceService fragranceService, IConfiguration config) : ControllerBase
{
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [EndpointSummary("get all users as nodes")]
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        return Ok(await userService.GetUsersAsync());
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [EndpointSummary("get user by username")]
    [HttpGet("{username}")]
    public async Task<IActionResult> GetUser(string username)
    {
        var (isValid, errorMessage) = MyUtils.IsValidString(username, "Username");
        if (!isValid)
        {
            return BadRequest(errorMessage);
        }
        
        var user = await userService.GetUserAsync(username);
        if (user is null)
        {
            return NotFound($"User {username} doesn't exists!");
        }
        
        return Ok(user);
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [EndpointSummary("create/register user")]
    [HttpPost]
    public async Task<IActionResult> AddUser([FromBody] AddUserDto user)
    {
        var (isValid, errorMessage) = user.Validate();
        if (!isValid)
        {
            return BadRequest(errorMessage);
        }

        if (await userService.UserExistsAsync(user.Username))
        {
            return Conflict($"User {user.Username} already exists!");
        }
        
        await userService.AddUserAsync(user);
        return Ok($"User {user.Username} added!");
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [EndpointSummary("generate JWT for login credentials")]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginDto login)
    {
        var (isValid, errorMessage) = login.Validate();
        if (!isValid)
            return BadRequest(errorMessage);
        
        var user = await userService.GetUserAsync(login.Username);
        if (user is null)
            return Unauthorized("Invalid username or password");

        if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            return Unauthorized("Invalid username or password");
        
        var token = new JwtProvider(config).Generate(user);
        return Ok(token);
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [EndpointSummary("update user")]
    [HttpPatch]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto user)
    {
        var (isValid, errorMessage) = user.Validate();
        if (!isValid)
            return BadRequest(errorMessage);

        if (!await userService.UserExistsAsync(user.Username))
            return NotFound($"User {user.Username} doesn't exists!");
        
        await userService.UpdateUserAsync(user);
        return Ok($"User {user.Username} successfully updated!");
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [EndpointSummary("add fragrance to user")]
    [HttpPatch("add-fragrance-to-user")]
    public async Task<IActionResult> AddFragranceToUser([FromBody] AddFragranceToUser dto)
    {
        var (isValid, errorMessage) = dto.Validate();
        if (!isValid)
            return BadRequest(errorMessage);
        
        if(!await userService.UserExistsAsync(dto.Username))
            return NotFound($"User {dto.Username} doesn't exists!");
        
        if(!await fragranceService.FragranceExistsAsync(dto.Id))
            return NotFound($"Fragrance {dto.Id} doesn't exists!");

        if (await userService.UserOwnsFragranceAsync(dto.Username, dto.Id))
            return Conflict($"User {dto.Username} already owns fragrance with id {dto.Id}!");

        await userService.AddFragranceToUserAsync(dto);
        return Ok($"Successfully added fragrance with id {dto.Id} to user {dto.Username}!");
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [EndpointSummary("delete user")]
    [HttpDelete]
    public async Task<IActionResult> DeleteUser([FromBody] DeleteUserDto user)
    {
        var (isValid, errorMessage) = user.Validate();
        if (!isValid)
            return BadRequest(errorMessage);
        
        if (!await userService.UserExistsAsync(user.Username))
            return Conflict($"User {user.Username} doesn't exists!");
        
        await userService.DeleteUserAsync(user);
        return Ok($"User {user.Username} successfully deleted!");
    }
    
}