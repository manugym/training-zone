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

    public async Task<AllTrainersDto> GetAllTrainersByFilterAsync(TrainerFilterDto filter)
    {
        //All trainers filtered by name and class type (implementar cuando tengamos las clases)
        List<TrainerDto> filteredTrainers = await _trainerSmartSearchService.Search(filter.Name, null);

        //Send all trainers for movile
        if(filter.EntitiesPerPage == null || filter.ActualPage == null)
        {
            return new AllTrainersDto
            {
                TotalPages = 1,
                Trainers = filteredTrainers
            };
        }

        int entitiesPerPage = filter.EntitiesPerPage.Value;
        int actualPage = filter.ActualPage.Value;

        int totalPages = (int)Math.Ceiling((double)filteredTrainers.Count / entitiesPerPage);
        int skip = (actualPage - 1) * entitiesPerPage;

        List<TrainerDto> pagedTrainers = filteredTrainers
            .Skip(skip)
            .Take(entitiesPerPage)
            .ToList();

        AllTrainersDto alltrainersDto = new AllTrainersDto
        {
            TotalPages = totalPages,
            Trainers = pagedTrainers
        };

        return alltrainersDto;
    }

    public async Task<TrainerDto> GetTrainerById(int id)
    {

        User user = await _unitOfWork.UserRepository.GetByIdAsync(id);

        if (user == null)
            return null;

        TrainerDto trainer = new TrainerDto
        {
            User = _userMapper.ToDto(user),
            TrainerClasses = await _unitOfWork.ClassRepository.GetClassesByTrainerIdAsync(user.Id)

        };


        return trainer;
        

    }



}
