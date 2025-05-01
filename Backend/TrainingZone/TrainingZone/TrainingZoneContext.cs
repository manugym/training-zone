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
    public DbSet<Chat> Chat { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }




    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
#if DEBUG
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        optionsBuilder.UseSqlite($"DataSource={baseDir}{DATABASE_PATH}");
#else
            string connection = "Server=db14304.databaseasp.net; Database=db14304; Uid=db14304; Pwd=pT@45eW!S?d8;";
            optionsBuilder.UseMySql(connection, ServerVersion.AutoDetect(connection));
#endif
    }

}
