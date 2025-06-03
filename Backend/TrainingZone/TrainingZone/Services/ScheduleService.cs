using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Schedule;

namespace TrainingZone.Services
{
    public class ScheduleService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ScheduleMapper _scheduleMapper;

        public ScheduleService (UnitOfWork unitOfWork, ScheduleMapper scheduleMapper)
        {
            _unitOfWork = unitOfWork;
            _scheduleMapper = scheduleMapper;
        }

        public async Task<IEnumerable<ScheduleDto>> GetScheduleByClass (int classId)
        {
            IEnumerable<Schedule> activitySchedule = await _unitOfWork.ScheduleRepository.GetScheduleByClassAsync(classId);

            IEnumerable<ScheduleDto> activityScheduleDto = _scheduleMapper.ToDto(activitySchedule.ToList());

            return activityScheduleDto;
        }
    }
}
