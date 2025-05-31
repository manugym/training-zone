using TrainingZone.Models.DataBase;

namespace TrainingZone.Services
{
    public class ScheduleService
    {
        private readonly UnitOfWork _unitOfWork;

        public ScheduleService (UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Schedule>> GetScheduleByClass (int classId)
        {
            IEnumerable<Schedule> activitySchedule = await _unitOfWork.ScheduleRepository.GetScheduleByClassAsync(classId);

            if (activitySchedule == null)
                return null;

            return activitySchedule;
        }
    }
}
