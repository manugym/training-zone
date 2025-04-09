using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.RegularExpressions;
using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Requests;

namespace TrainingZone.Services;

public class AuthService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly TokenValidationParameters _tokenParameters;
    private readonly UserMapper _userMapper;
    private readonly ImageService _imageService;

    public AuthService(UnitOfWork unitOfWork, IOptionsMonitor<JwtBearerOptions> jwtOptions, UserMapper userMapper, ImageService imageService)
    {
        _unitOfWork = unitOfWork;
        _userMapper = userMapper;
        _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme)
                .TokenValidationParameters;
        _imageService = imageService;
    }


    public async Task<User> GetUserFromDbByStringId(string stringId)
    {
        return await _unitOfWork.UserRepository.GetByIdAsync(Int32.Parse(stringId));
    }

    public async Task<User> GetUserById(int id)
    {
        return await _unitOfWork.UserRepository.GetByIdAsync(id);
    }

    public async Task<User> InsertUser(User user)
    {
        User newUser = await _unitOfWork.UserRepository.InsertAsync(user);
        await _unitOfWork.SaveAsync();
        return newUser;
    }

    public string ObtainToken(User user)
    {
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            // EL CONTENIDO DEL JWT
            Claims = new Dictionary<string, object>
                {
                    { ClaimTypes.NameIdentifier, user.Id },
                    { "name", user.Name },
                    { ClaimTypes.Role, user.Role },
                },
            Expires = DateTime.UtcNow.AddYears(3),
            SigningCredentials = new SigningCredentials(
                    _tokenParameters.IssuerSigningKey,
                    SecurityAlgorithms.HmacSha256Signature
                )
        };
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<User> RegisterUser(NewUserRequest receivedUser)
    {

        //Retorna nulo si el usuario es nulo o si el email o número de teléfono es incorrecto
        if (receivedUser == null || !IsEmail(receivedUser.Email) || !IsPhoneNumber(receivedUser.Phone))
            return null;


        User user = _userMapper.ToEntity(receivedUser);

        try
        {
            user.AvatarImageUrl = await _imageService.InsertAsync(receivedUser.ImagePath);
        }
        catch (Exception ex)
        {
            user.AvatarImageUrl = null;

        }

        User newUser = await InsertUser(user);
        return newUser;
    }

    
    public async Task<User> GetUserByCredentialAndPassword(string credential, string password)
    {
        User user = await _unitOfWork.UserRepository.GetUserByCredential(credential);
        if (user == null)
        {
            return null;
        }

        PasswordService passwordService = new PasswordService();
        if (passwordService.IsPasswordCorrect(user.Password, password))
        {
            return user;
        }


        return null;
    }
    

    public bool IsEmail(string email)
    {
        Regex validateEmailRegex = new Regex("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
        return validateEmailRegex.IsMatch(email);
    }

    public bool IsPhoneNumber(string phone)
    {
        // Este patrón valida un número de teléfono con 9 dígitos consecutivos (sin espacios ni guiones)
        Regex validatePhoneRegex = new Regex(@"^\d{9}$");

        return validatePhoneRegex.IsMatch(phone);
    }

}
