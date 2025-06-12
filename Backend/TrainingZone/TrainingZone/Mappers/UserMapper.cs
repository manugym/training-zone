using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Schedule;
using TrainingZone.Models.Dtos.Trainer;
using TrainingZone.Models.Dtos.User;
using TrainingZone.Services;

namespace TrainingZone.Mappers;

public class UserMapper
{
    //Pasar de usuario a dto
    public UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Phone = user.Phone,
            Email = user.Email,
            Role = user.Role,
            AvatarImageUrl = user.AvatarImageUrl,
        };
    }

    //Pasar la lista de usuarios a dtos
    public List<UserDto> ToDto(List<User> users)
    {
        return users?.Select(ToDto).ToList() ?? new List<UserDto>();
    }


    //Pasar de Dto a usuario
    public User ToEntity(UserDto userDto)
    {
        return new User
        {
            Id = userDto.Id,
            Name = userDto.Name,
            Phone = userDto.Phone,
            Email = userDto.Email,
            Role = userDto.Role,
            AvatarImageUrl = userDto.AvatarImageUrl,
        };
    }

    public List<User> ToEntity(List<UserDto> usersDto)
    {
        return usersDto?.Select(ToEntity).ToList() ?? new List<User>();

    }

    //Pasa el nuevo usuario a usuario a almacenar
    public User ToEntity(CreateUserDto newUser)
    {
        PasswordService passwordService = new PasswordService();

        return new User
        {
            Name = newUser.Name,
            Phone = newUser.Phone,
            Email = newUser.Email,
            Password = passwordService.Hash(newUser.Password),
            Role = "user",
            AvatarImageUrl = "",
        };
    }

    public IEnumerable<ScheduleTrainerDto> ToScheduleTrainerDto(IEnumerable<User> trainers)
    {
        var trainersDto = trainers.Select(t => new ScheduleTrainerDto
        {
            Id = t.Id,
            Name = t.Name,
            Role = t.Role
        }).ToList();

        return trainersDto;
    }


}

