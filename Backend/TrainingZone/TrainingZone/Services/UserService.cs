using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.User;
using TrainingZone.Models.Enums;

namespace TrainingZone.Services;

public class UserService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly UserMapper _userMapper;
    private readonly PasswordService _passWordService;
    private readonly ImageService _imageService;
    private readonly AuthService _authService;

    public UserService (UnitOfWork unitOfWork, UserMapper userMapper, PasswordService passWordService, ImageService imageService, AuthService authService)
    {
        _unitOfWork = unitOfWork;
        _userMapper = userMapper;
        _passWordService = passWordService;
        _imageService = imageService;
        _authService = authService;
    }


    public async Task<UserDto> GetUserById(int id)
    {
        User user = await _unitOfWork.UserRepository.GetByIdAsync(id);

        if (user == null)
            return null;

        return _userMapper.ToDto(user);
    }


    public async Task<UserDto> UpdateUser(int id, NewDataDto newData)
    {
        try
        {
            User user = await _unitOfWork.UserRepository.GetByIdAsync(id);

            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");


            if (newData.Name != null)
                user.Name = newData.Name;

            if (newData.Email != null && _authService.IsEmail(newData.Email))
                user.Email = newData.Email;

            if (newData.Phone != null && _authService.IsPhoneNumber(newData.Phone))
                user.Phone = newData.Phone;

            if (newData.Password != null)
                user.Password = _passWordService.Hash(newData.Password);

            if(newData.ImagePath != null)
                user.AvatarImageUrl = await _imageService.InsertAsync(newData.ImagePath);

            _unitOfWork.UserRepository.Update(user);
            await _unitOfWork.SaveAsync();

            return _userMapper.ToDto(user);
        }
        catch (Exception e)
        {
            Console.Error.WriteLine(e.ToString());
        }


        return null;
    }

    public async Task<List<UserDto>> GetAllUsers()
    {
        var users = await _unitOfWork.UserRepository.GetAllAsync();

        return _userMapper.ToDto(users.ToList());
    }


    public async Task<UserDto> DeleteUserById(int id)
    {
        User user = await _unitOfWork.UserRepository.GetByIdAsync(id);

        if (user == null)
            return null;

        _unitOfWork.UserRepository.Delete(user);
        await _unitOfWork.SaveAsync();

        return _userMapper.ToDto(user);

    }

    internal async Task<UserDto> ChangeUserRole(int userId, Role role)
    {
        User user = await _unitOfWork.UserRepository.GetByIdAsync(userId);

        if (user == null)
            return null;

        user.Role = role.ToString().ToLower();


        _unitOfWork.UserRepository.Update(user);
        await _unitOfWork.SaveAsync();

        return _userMapper.ToDto(user);

    }
}
