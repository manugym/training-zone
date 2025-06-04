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

        public async Task<IEnumerable<ScheduleDto>> GetScheduleByClass(int classId)
        {
            IEnumerable<Schedule> activitySchedule = await _unitOfWork.ScheduleRepository.GetScheduleByClassAsync(classId);

            IEnumerable<ScheduleDto> activityScheduleDto = _scheduleMapper.ToDto(activitySchedule.ToList());

            return activityScheduleDto;
        }

        public async Task<Schedule> GetScheduleById(int scheduleId)
        {
            Schedule schedule = await _unitOfWork.ScheduleRepository.GetScheduleByIdAsync(scheduleId);

            return schedule;
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

        public async Task<ScheduleDto> DeleteScheduleById(int scheduleId)
        {
            Schedule schedule = await _unitOfWork.ScheduleRepository.GetScheduleByIdAsync(scheduleId);

            if(schedule == null)
            {
                return null;
            }

            _unitOfWork.ScheduleRepository.Delete(schedule);
            await _unitOfWork.SaveAsync();

            return _scheduleMapper.ToDto(schedule);
        }

        public async Task<ScheduleDto> UpdateSchedule(int scheduleId, UpdateScheduleDto updateScheduleDto)
        {
            if (updateScheduleDto == null) return null;

            try
            {
                Schedule schedule = await _unitOfWork.ScheduleRepository.GetScheduleByIdAsync(scheduleId);

                if (schedule == null) return null;

                schedule.ClassId = updateScheduleDto.ClassId ?? schedule.ClassId;

                schedule.UserId = updateScheduleDto.UserId ?? schedule.UserId;

                schedule.MaxCapacity = updateScheduleDto.MaxCapacity ?? schedule.MaxCapacity;

                schedule.Price = updateScheduleDto.Price ?? schedule.Price;

                schedule.StartDateTime = updateScheduleDto.StartDateTime ?? schedule.StartDateTime;

                schedule.EndDateTime = updateScheduleDto.EndDateTime ?? schedule.EndDateTime;

                _unitOfWork.ScheduleRepository.Update(schedule);
                await _unitOfWork.SaveAsync();

                Schedule savedSchedule = await _unitOfWork.ScheduleRepository.GetScheduleByIdAsync(scheduleId);


                return _scheduleMapper.ToDto(savedSchedule);

            }
            catch (Exception e)
            {
                Console.Error.WriteLine(e.ToString());
            }

            return null;
        }
    }
}
