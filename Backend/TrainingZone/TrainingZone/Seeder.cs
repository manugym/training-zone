using TrainingZone.Models.DataBase;
using TrainingZone.Models.Enums;
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

        await SeedChatsAsync();
        await _trainingZoneContext.SaveChangesAsync();

        await seedClassesAsync();
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
             new User(){
                Name = "ale",
                Email = "ale@gmail.com",
                Phone = "192837465",
                Password = _passwordService.Hash("1234"),
                Role = Role.USER.ToString().ToLower(),
            },
             new User(){
                Name = "manu",
                Email = "manu@gmail.com",
                Phone = "918273465",
                Password = _passwordService.Hash("1234"),
                Role = Role.USER.ToString().ToLower(),
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



    private async Task SeedChatsAsync()
    {
        var users = _trainingZoneContext.Users.ToList();

        var ale = users.FirstOrDefault(u => u.Name == "ale");
        var manu = users.FirstOrDefault(u => u.Name == "manu");

        var trainer1 = users.FirstOrDefault(u => u.Name == "Ana López");
        var trainer2 = users.FirstOrDefault(u => u.Name == "Carlos Pérez");

        if (ale == null || manu == null || trainer1 == null || trainer2 == null)
            return;

        var chats = new List<Chat>
    {
        new Chat
        {
            UserOriginId = ale.Id,
            UserDestinationId = trainer1.Id,
            ChatMessages = new List<ChatMessage>
            {
                new ChatMessage
                {
                    UserId = ale.Id,
                    Message = "Hola Ana, ¿qué ejercicios me recomiendas para piernas?",
                    MessageDateTime = DateTime.UtcNow.AddMinutes(-10)
                },
                new ChatMessage
                {
                    UserId = trainer1.Id,
                    Message = "Hola Ale, te recomiendo sentadillas y peso muerto.",
                    MessageDateTime = DateTime.UtcNow.AddMinutes(-9)
                }
            }
        },
        new Chat
        {
            UserOriginId = manu.Id,
            UserDestinationId = trainer2.Id,
            ChatMessages = new List<ChatMessage>
            {
                new ChatMessage
                {
                    UserId = manu.Id,
                    Message = "Hola Carlos, ¿cómo empiezo la rutina de fuerza?",
                    MessageDateTime = DateTime.UtcNow.AddMinutes(-8)
                },
                new ChatMessage
                {
                    UserId = trainer2.Id,
                    Message = "Hola Manu, empieza con press de banca y remo con barra.",
                    MessageDateTime = DateTime.UtcNow.AddMinutes(-7)
                }
            }
        },
        new Chat
        {
            UserOriginId = ale.Id,
            UserDestinationId = trainer2.Id,
            ChatMessages = new List<ChatMessage>
            {
                new ChatMessage
                {
                    UserId = ale.Id,
                    Message = "Carlos, ¿cuántos días a la semana entreno?",
                    MessageDateTime = DateTime.UtcNow.AddMinutes(-6)
                },
                new ChatMessage
                {
                    UserId = trainer2.Id,
                    Message = "Depende de tu objetivo, pero 3-4 días es un buen inicio.",
                    MessageDateTime = DateTime.UtcNow.AddMinutes(-5)
                }
            }
        },
        new Chat
        {
            UserOriginId = manu.Id,
            UserDestinationId = trainer1.Id,
            ChatMessages = new List<ChatMessage>
            {
                new ChatMessage
                {
                    UserId = manu.Id,
                    Message = "Ana, ¿puedo hacer cardio todos los días?",
                    MessageDateTime = DateTime.UtcNow.AddMinutes(-4)
                },
                new ChatMessage
                {
                    UserId = trainer1.Id,
                    Message = "Sí, pero varía la intensidad para evitar sobreentrenamiento.",
                    MessageDateTime = DateTime.UtcNow.AddMinutes(-3)
                }
            }
        }
    };

        await _trainingZoneContext.Chats.AddRangeAsync(chats);
    }

    private async Task seedClassesAsync()
    {
        Class[] Classes =
        [
        new Class
        {
            Name = "Spinning",
            Description = "Clase de ciclo indoor",
            UserId = 5
        },
        new Class
        {

        }

        ];
        await _trainingZoneContext.Classes.AddRangeAsync(Classes);
    }
}

