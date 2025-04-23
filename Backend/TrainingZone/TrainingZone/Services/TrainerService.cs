using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Trainer;
using TrainingZone.Repositories;

namespace TrainingZone.Services;

public class TrainerService
{

    private UnitOfWork _unitOfWork;
    private UserMapper _userMapper;
    private TrainerSmartSearchService _trainerSmartSearchService;

    public TrainerService(UnitOfWork unitOfWork, UserMapper userMapper, TrainerSmartSearchService smartSearchService)
    {
        _unitOfWork = unitOfWork;
        _userMapper = userMapper;
        _trainerSmartSearchService = smartSearchService;
    }

    public async Task<AllTrainersDto> GetAllTrainersByFilter(TrainerFilterDto filter)
    {
        //Todos los entrenadores filtrados por nombre y tipo de clase (implementar cuando tengamos las clases)
        List<TrainerDto> trainers = await _trainerSmartSearchService.Search(filter.Name, null);

        int totalPages = (int)Math.Ceiling((double)trainers.Count / filter.EntitiesPerPage);

        // Obtiene solo los entrenadores de la página actual
        int skip = (filter.ActualPage - 1) * filter.EntitiesPerPage;
        List<TrainerDto> pagedTrainers = trainers
            .Skip(skip)
            .Take(filter.EntitiesPerPage)
            .ToList();

        

        AllTrainersDto alltrainersDto = new AllTrainersDto
        {
            TotalPages = totalPages,
            Trainers = pagedTrainers
        };

        //Añadir las clases que imparte



        return alltrainersDto;
    }

    public async Task<TrainerDto> GetTrainerById(int id)
    {

        User user = await _unitOfWork.UserRepository.GetByIdAsync(id);

        if (user == null)
            return null;

        TrainerDto trainer = new TrainerDto{
            User = _userMapper.ToDto(user)
        };


        return trainer;
        

    }



}
