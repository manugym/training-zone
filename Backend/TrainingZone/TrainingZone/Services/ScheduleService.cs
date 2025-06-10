using TrainingZone.Mappers;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Schedule;
using TrainingZone.Models.Enums;

namespace TrainingZone.Services
{
    public class ScheduleService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ScheduleMapper _scheduleMapper;
        private readonly UserMapper _userMapper;

        public ScheduleService (UnitOfWork unitOfWork, ScheduleMapper scheduleMapper, UserMapper userMapper)
        {
            _unitOfWork = unitOfWork;
            _scheduleMapper = scheduleMapper;
            _userMapper = userMapper;
            
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

            User trainer = await _unitOfWork.UserRepository.GetByIdAsync(newSchedule.UserId);

            if (trainer.Role != Role.TRAINER.ToString().ToLower())
            {
                throw new InvalidOperationException("El usuario no tiene el rol adecuado");
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

            User trainer = await _unitOfWork.UserRepository.GetByIdAsync(updateScheduleDto.UserId);

            if (trainer.Role != Role.TRAINER.ToString().ToLower())
            {
                throw new InvalidOperationException("El usuario no tiene el rol adecuado");
            }

            try
            {
                Schedule schedule = await _unitOfWork.ScheduleRepository.GetScheduleByIdAsync(scheduleId);

                if (schedule == null) return null;

                schedule.ClassId = updateScheduleDto.ClassId ?? schedule.ClassId;

                schedule.UserId = updateScheduleDto.UserId;

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

        public async Task<IEnumerable<ScheduleDto>> getAllScheduleByDate (int classId, DateOnly date)
        {
            IEnumerable<Schedule> classSchedule = await _unitOfWork.ScheduleRepository.GetAllSchedulesByDate(classId, date);

            IEnumerable<ScheduleDto> classScheduleDto = _scheduleMapper.ToDto(classSchedule.ToList());

            return classScheduleDto;
        }

        public async Task<IEnumerable<ScheduleDto>> GetAllSchedulesAsync()
        {
            IEnumerable<Schedule> allSchedules = await _unitOfWork.ScheduleRepository.GetAllSchedulesAsync();

            IEnumerable<ScheduleDto> allSchedulesDto = _scheduleMapper.ToDto(allSchedules.ToList());

            return allSchedulesDto;
        }

        public async Task<IEnumerable<ScheduleTrainerDto>> GetAllScheduleTrainers()
        {
            IEnumerable<User> allTrainers = await _unitOfWork.UserRepository.GetAllTrainersAsync();

            IEnumerable<ScheduleTrainerDto> allTrainersDtos = _userMapper.ToScheduleTrainerDto(allTrainers);

            return allTrainersDtos;
        }
    }
}
