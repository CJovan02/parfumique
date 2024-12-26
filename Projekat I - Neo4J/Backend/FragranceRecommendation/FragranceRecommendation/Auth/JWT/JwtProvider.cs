﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace FragranceRecommendation.Auth.JWT;

public class JwtProvider
{
    private readonly JwtOptions _options;

    public JwtProvider(IConfiguration config)
    {
        _options = new JwtOptions(config);
    }

    public string Generate(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("username", user.Username),
            //new("userId", user.Id.ToString()!),
            // Ovo da se obrise kasnije kad se dodaju admini
            new("Role", ((int)Roles.User).ToString())
        };

        // Potrebno za kasnije kad se dodaju admini
        // if (user.admin)
        //     claims.Add(new("Role",  ((int)Roles.Admin).ToString())
        // else
        //     claims.Add(new("Role", ((int)Roles.User).ToString());

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_options.SigningKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _options.Issuer,
            _options.Audience,
            claims,
            null,
            DateTime.UtcNow.Add(_options.JwtLifetime),
            signingCredentials);


        string tokenValue = new JwtSecurityTokenHandler()
            .WriteToken(token);

        return tokenValue;
    }
}