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

        public async Task<Schedule> InsertSchedule(Schedule schedule)
        {
            Schedule newSchedule = await _unitOfWork.ScheduleRepository.InsertAsync(schedule);
            await _unitOfWork.SaveAsync();

            return newSchedule;
        }

        public async Task<IEnumerable<ScheduleDto>> GetScheduleByClass (int classId)
        {
            IEnumerable<Schedule> activitySchedule = await _unitOfWork.ScheduleRepository.GetScheduleByClassAsync(classId);

            IEnumerable<ScheduleDto> activityScheduleDto = _scheduleMapper.ToDto(activitySchedule.ToList());

            return activityScheduleDto;
        }

        public async Task<ScheduleDto> CreateSchedule(CreateScheduleDto newSchedule)
        {
            if (newSchedule == null)
            {
                return null;
            }

            Schedule scheduleToSave = await _scheduleMapper.ToEntity(newSchedule);

            try
            {
                Schedule savedSchedule = await InsertSchedule(scheduleToSave);
                Schedule fullSavedSchedule = await _unitOfWork.ScheduleRepository.GetScheduleByIdAsync(savedSchedule.Id);
                ScheduleDto savedScheduleDto = _scheduleMapper.ToDto(fullSavedSchedule);
                return savedScheduleDto;
            }
            catch(Exception e)
            {
                Console.Error.WriteLine(e.ToString());
            }

            return null;
        }

    }
}
