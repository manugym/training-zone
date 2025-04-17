using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Trainer;
using TrainingZone.Repositories;

namespace TrainingZone.Services;

public class TrainerService
{

    private UnitOfWork _unitOfWork;
    private UserMapper _userMapper;
    private TrainerSmartSearchService _smartSearchService;

    public TrainerService(UnitOfWork unitOfWork, UserMapper userMapper, TrainerSmartSearchService smartSearchService)
    {
        _unitOfWork = unitOfWork;
        _userMapper = userMapper;
        _smartSearchService = smartSearchService;
    }

    public async Task<AllTrainersDto> GetAllTrainersByFilter(TrainerFilterDto filter)
    {
        //Todos los entrenadores filtrados por nombre y tipo de clase (implementar cuando tengamos las clases)
        List<User> trainers = await _smartSearchService.Search(filter.Name, null);

        int totalPages = trainers.Count / filter.EntitiesPerPage;

        // Obtiene solo los entrenadores de la página actual
        int skip = (filter.ActualPage - 1) * filter.EntitiesPerPage;
        List<User> pagedTrainers = trainers
            .Skip(skip)
            .Take(filter.EntitiesPerPage)
            .ToList();

        AllTrainersDto alltrainersDto = new AllTrainersDto
        {
            TotalPages = totalPages,
            AllTrainers = _userMapper.ToDto(pagedTrainers)
        };

        return alltrainersDto;
    }


}
