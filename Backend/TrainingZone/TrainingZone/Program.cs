using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Globalization;
using System.Text.Json.Serialization;
using System.Text;
using Microsoft.Extensions.Options;

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


        // *** Añadimos servicios al contenedor del inyector de dependencias ***

        // Añadimos la configuración guardada en el appsetting.json
        builder.Services.Configure<Settings>(builder.Configuration.GetSection(Settings.SECTION_NAME));



        // Añadimos controladores.
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
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



        // Servicios


        //Settings
        builder.Services.Configure<Settings>(builder.Configuration.GetSection("Settings"));
        builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<Settings>>().Value);

        // Mappers


        //Administrador de todos los websockets


        //MiddleWare



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


        app.UseHttpsRedirection();

        app.UseRouting();


        // Habilita la autenticación
        app.UseAuthentication();
        // Habilita la autorización
        app.UseAuthorization();

        app.MapControllers();

        // Inicializamos la base de datos



        // Empezamos a atender a las peticiones de nuestro servidor
        await app.RunAsync();
    }

    /*
    static async Task InitDatabaseAsync(IServiceProvider serviceProvider)
    {
        using IServiceScope scope = serviceProvider.CreateScope();
        using ChessAndConnectContext dbContext = scope.ServiceProvider.GetService<ChessAndConnectContext>();
        PasswordService passwordService = scope.ServiceProvider.GetService<PasswordService>();



        // Si no existe la base de datos entonces la creamos y ejecutamos el seeder
        if (dbContext.Database.EnsureCreated())
        {
            Seeder seeder = new Seeder(dbContext, passwordService);
            await seeder.SeedAsync();
        }
    }
    */
}
