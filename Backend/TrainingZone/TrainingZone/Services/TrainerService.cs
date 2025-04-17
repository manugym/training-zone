using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Trainer;
using TrainingZone.Repositories;

namespace TrainingZone.Services;

public class TrainerService
{

    private UnitOfWork _unitOfWork;
    private UserMapper _userMapper;

    public TrainerService(UnitOfWork unitOfWork, UserMapper userMapper)
    {
        _unitOfWork = unitOfWork;
        _userMapper = userMapper;
    }

    public async Task<AllTrainersDto> GetAllTrainersByFilter(TrainerFilterDto filter)
    {
        

        //Obtiene todos los entrenadores
        List<User> trainers = await _unitOfWork.UserRepository.GetAllTrainersAsync();

        //Filtra por nombre




        //Filtra por tipo(implementación cuando tengamos las clases)



        //devuelve el número necesario
        AllTrainersDto alltrainersDto = new AllTrainersDto
        {
            TotalPages = trainers.Count / filter.EntitiesPerPage,
            AllTrainers = _userMapper.ToDto(trainers)
        };


        return alltrainersDto;

    }

}
