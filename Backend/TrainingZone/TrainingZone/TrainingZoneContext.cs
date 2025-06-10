using Microsoft.EntityFrameworkCore;
using TrainingZone.Models.DataBase;

namespace TrainingZone;

public class TrainingZoneContext : DbContext
{

    private const string DATABASE_PATH = "TrainingZone.db";

    private readonly Settings _settings;
    public TrainingZoneContext(Settings settings)
    {
        _settings = settings;
    }


    public DbSet<User> Users { get; set; }
    public DbSet<Chat> Chats { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<ChatMessage> ChatsMessages { get; set; }
    public DbSet<Reservation> Reservations { get; set; }



    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
#if DEBUG
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        optionsBuilder.UseSqlite($"DataSource={baseDir}{DATABASE_PATH}");
#else
            string connection = "Server=db18405.databaseasp.net; Database=db18405; Uid=db18405; Pwd=gR@5_3Bj6z%G;";
            optionsBuilder.UseMySql(connection, ServerVersion.AutoDetect(connection));
#endif
    }

}
