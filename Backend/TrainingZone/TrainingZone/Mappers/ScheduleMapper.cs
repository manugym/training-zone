using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Schedule;
using TrainingZone.Models.Dtos.User;

namespace TrainingZone.Mappers
{
    public class ScheduleMapper
    {
        private readonly UserMapper _userMapper;
        private readonly UnitOfWork _unitOfWork;

        public ScheduleMapper(UserMapper userMapper, UnitOfWork unitOfWork)
        {
            _userMapper = userMapper;
            _unitOfWork = unitOfWork;
        }

        public ScheduleDto ToDto (Schedule schedule)
        {

            return new ScheduleDto
            {
                ClassId = schedule.ClassId,
                ClassType = schedule.Class.Type.ToString(),
                Description = schedule.Class.Description,
                Trainer = _userMapper.ToDto(schedule.User),
                MaxCapacity = schedule.MaxCapacity,
                Price = schedule.Price,
                StartDateTime = schedule.StartDateTime,
                EndDateTime = schedule.EndDateTime
            };
        }

        public IEnumerable<ScheduleDto> ToDto(List<Schedule> schedule)
        {
            return schedule?.Select(ToDto).ToList() ?? new List<ScheduleDto>();
        }

        public async Task<Schedule> ToEntity(CreateScheduleDto createScheduleDto)
        {
            Class classData = await _unitOfWork.ClassRepository.GetClassByIdAsync(createScheduleDto.ClassId);

            User userData = await _unitOfWork.UserRepository.GetByIdAsync(createScheduleDto.UserId);

            return new Schedule
            {
                ClassId = createScheduleDto.ClassId,
                Class = classData,
                UserId = userData.Id,
                User = userData,
                MaxCapacity = createScheduleDto.MaxCapacity,
                Price = createScheduleDto.Price,
                StartDateTime = createScheduleDto.StartDateTime,
                EndDateTime = createScheduleDto.EndDateTime

            };
        }
    }
}
