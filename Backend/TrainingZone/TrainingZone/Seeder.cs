using System;
using TrainingZone.Models.DataBase;
using TrainingZone.Services;

namespace TrainingZone;
public class Seeder
{
    private readonly TrainingZoneContext _trainingZoneContext;
    private readonly PasswordService _passwordService;

    public Seeder(TrainingZoneContext chessAndConnectContext, PasswordService passwordService)
    {
        _trainingZoneContext = chessAndConnectContext;
        _passwordService = passwordService;
    }

    public async Task SeedAsync()
    {
        await SeedUsersAsync();
        await _trainingZoneContext.SaveChangesAsync();

    }

    private async Task SeedUsersAsync()
    {
        User[] users =
        [
            new User(){
                Name = "admin",
                Email = "admin@gmail.com",
                Phone = "000000000",
                Password = _passwordService.Hash("admin"),
                Role = "admin",
            },
            
        ];

        await _trainingZoneContext.Users.AddRangeAsync(users);


    }
   






}

