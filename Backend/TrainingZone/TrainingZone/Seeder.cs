using System;
using TrainingZone.Enums;
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
        await SeedTrainersAsync();
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
                Role = Role.ADMIN.ToString().ToLower(),
            },
            
        ];

        await _trainingZoneContext.Users.AddRangeAsync(users);


    }

    private async Task SeedTrainersAsync()
    {
        User[] trainers =
        [
            new User
        {
            Name = "Ana López",
            Email = "ana.lopez@trainingzone.es",
            Phone = "612345678",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "Carlos Pérez",
            Email = "carlos.perez@trainingzone.es",
            Phone = "623456789",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "María García",
            Email = "maria.garcia@trainingzone.es",
            Phone = "634567891",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "Luis Fernández",
            Email = "luis.fernandez@trainingzone.es",
            Phone = "645678912",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "Elena Sánchez",
            Email = "elena.sanchez@trainingzone.es",
            Phone = "656789123",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "Diego Torres",
            Email = "diego.torres@trainingzone.es",
            Phone = "667891234",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "Lucía Romero",
            Email = "lucia.romero@trainingzone.es",
            Phone = "678912345",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "Javier Herrera",
            Email = "javier.herrera@trainingzone.es",
            Phone = "689123456",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "Sofía Jiménez",
            Email = "sofia.jimenez@trainingzone.es",
            Phone = "691234567",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
        new User
        {
            Name = "Fernando Ruiz",
            Email = "fernando.ruiz@trainingzone.es",
            Phone = "602345678",
            Password = _passwordService.Hash("1234"),
            Role = Role.TRAINER.ToString().ToLower(),
        },
    ];

        await _trainingZoneContext.Users.AddRangeAsync(trainers);
    }








}

