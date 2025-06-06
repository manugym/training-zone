using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.WebSockets;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Globalization;
using System.Text.Json.Serialization;
using System.Text;
using TrainingZone.Services;
using TrainingZone.Mappers;
using TrainingZone.MiddleWares;
using TrainingZone.WebSocketAdministration;
using System.Text.Json;
using QuestPDF.Infrastructure;

namespace TrainingZone;

public class Program
{

    public static async Task Main(string[] args)
    {
        // Configuramos cultura invariante para que al pasar los decimales a texto no tengan comas
        CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;

        // Configuramos para que el directorio de trabajo sea donde está el ejecutable
        Directory.SetCurrentDirectory(AppContext.BaseDirectory);


        var builder = WebApplication.CreateBuilder(args);

        //Para que no de fallos por licencia al crear el PDF
        QuestPDF.Settings.License = LicenseType.Community;

        // *** Añadimos servicios al contenedor del inyector de dependencias ***

        // Añadimos la configuración guardada en el appsetting.json
        builder.Services.Configure<Settings>(builder.Configuration.GetSection(Settings.SECTION_NAME));


        // Añadimos controladores.
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.JsonSerializerOptions.PropertyNamingPolicy = null;

        });

        // Configuración para poder usar JWT en las peticiones de Swagger
        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
            {

                BearerFormat = "JWT",
                Name = "Authorization",
                Description = "Escribe **_SOLO_** tu token JWT",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = JwtBearerDefaults.AuthenticationScheme
            });

            options.OperationFilter<SecurityRequirementsOperationFilter>(true, JwtBearerDefaults.AuthenticationScheme);
        });

        // CONFIGURANDO JWT
        builder.Services.AddAuthentication()
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,

                    // INDICAMOS LA CLAVE
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });


        // Contesto de la base de datos y repositorios
        builder.Services.AddScoped<TrainingZoneContext>();
        builder.Services.AddScoped<UnitOfWork>();

        // Servicios
        builder.Services.AddScoped<PasswordService>();
        builder.Services.AddScoped<ImageService>();
        builder.Services.AddScoped<AuthService>();
        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<TrainerService>();
        builder.Services.AddScoped<ClassService>();
        builder.Services.AddScoped<ScheduleService>();
        builder.Services.AddScoped<TrainerSmartSearchService>();
        builder.Services.AddScoped<ChatService>();
        builder.Services.AddScoped<RoutineGeneratorService>();




        //Settings
        builder.Services.Configure<Settings>(builder.Configuration.GetSection("Settings"));
        builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<Settings>>().Value);


        // Mappers
        builder.Services.AddTransient<UserMapper>();
        builder.Services.AddTransient<ScheduleMapper>();
        builder.Services.AddTransient<ChatMapper>();



        //Administrador de todos los websockets
        builder.Services.AddSingleton<WebSocketNetwork>();



        //MiddleWare
        builder.Services.AddTransient<WebSocketMiddleWare>();



        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();


        // Permite CORS
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            });
        });

        //Para que dispositivos locales puedan acceder
        builder.WebHost.UseUrls("http://0.0.0.0:7089"); 



        var app = builder.Build();


        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors();
        // Indicamos que active el servicio para archivos estáticos (wwwroot)
        app.UseStaticFiles();


        // Habilita el uso de websockets
        app.UseWebSockets();

        //MiddleWare 
        app.UseMiddleware<WebSocketMiddleWare>();


        app.UseHttpsRedirection();

        app.UseRouting();


        // Habilita la autenticación
        app.UseAuthentication();
        // Habilita la autorización
        app.UseAuthorization();

        app.MapControllers();

        // Inicializamos la base de datos
        await InitDatabaseAsync(app.Services);


        // Empezamos a atender a las peticiones de nuestro servidor
        await app.RunAsync();
    }
    static async Task InitDatabaseAsync(IServiceProvider serviceProvider)
    {
        using IServiceScope scope = serviceProvider.CreateScope();
        using TrainingZoneContext dbContext = scope.ServiceProvider.GetService<TrainingZoneContext>();
        PasswordService passwordService = scope.ServiceProvider.GetService<PasswordService>();



        // Si no existe la base de datos entonces la creamos y ejecutamos el seeder
        if (dbContext.Database.EnsureCreated())
        {
            Seeder seeder = new Seeder(dbContext, passwordService);
            await seeder.SeedAsync();
        }
    }

}