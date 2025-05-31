using TrainingZone.Models.DataBase;

namespace TrainingZone.Services
{
    public class ClassService
    {
        private readonly UnitOfWork _unitOfWork;

        public ClassService (UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Class> GetClassById (int classId)
        {
            Class activity = await _unitOfWork.ClassRepository.GetClassByIdAsync(classId);

            if (activity == null)
                return null;

            return activity;
        }

    }
}
