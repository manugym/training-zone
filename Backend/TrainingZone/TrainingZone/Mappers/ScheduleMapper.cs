using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Schedule;

namespace TrainingZone.Mappers
{
    public class ScheduleMapper
    {
        private readonly UserMapper _userMapper;

        public ScheduleMapper(UserMapper userMapper)
        {
            _userMapper = userMapper;
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
    }
}
