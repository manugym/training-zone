using TrainingZone.Helpers;
using TrainingZone.Models.DataBase;

namespace TrainingZone.Services;

public class ImageService
{
    private const string IMAGES_FOLDER = "UserProfilePicture";

    private readonly UnitOfWork _unitOfWork;

    public ImageService(UnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<String> InsertAsync(IFormFile image)
    {
        try
        {
            string relativePath;
            if (image == null)
            {
                relativePath = $"{IMAGES_FOLDER}/{"perfil_por_defecto.png"}";
            }
            else
            {
                relativePath = $"{IMAGES_FOLDER}/{Guid.NewGuid()}_{image.FileName}";
                await StoreImageAsync(relativePath, image);
            }

            return relativePath;
        }
        catch (Exception ex) { }

        return null;

    }

    public async Task DeleteAsync(int id)
    {
        User user = await _unitOfWork.UserRepository.GetByIdAsync(id);
        _unitOfWork.UserRepository.Delete(user);

        await _unitOfWork.SaveAsync();
    }

    private async Task StoreImageAsync(string relativePath, IFormFile file)
    {
        using Stream stream = file.OpenReadStream();

        await FileHelper.SaveAsync(stream, relativePath);
    }
}