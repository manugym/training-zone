using F23.StringSimilarity.Interfaces;
using F23.StringSimilarity;
using System.Globalization;
using System.Text;
using TrainingZone.Models.DataBase;
using TrainingZone.Models.Dtos.Trainer;
using TrainingZone.Mappers;
using TrainingZone.Models.Enums;

namespace TrainingZone.Services;

public class TrainerSmartSearchService
{
    private const double THRESHOLD = 0.75;
    private readonly UnitOfWork _unitOfWork;
    private readonly UserMapper _userMapper;
    private readonly INormalizedStringSimilarity _stringSimilarityComparer;

    public TrainerSmartSearchService(UnitOfWork unitOfWork, UserMapper userMapper)
    {
        _unitOfWork = unitOfWork;
        _userMapper = userMapper;
        _stringSimilarityComparer = new JaroWinkler();
    }

    public async Task<List<TrainerDto>> Search(string query, ClassType? classType = null)
    {
        List<User> trainerUsers = await _unitOfWork.UserRepository.GetAllTrainersAsync();

        //Filter by name
        List<User> nameFilteredTrainers = trainerUsers;

        if (!string.IsNullOrWhiteSpace(query))
             nameFilteredTrainers = FindMatchingTrainers(query, trainerUsers);

        //Add trainer classes
        List<TrainerDto> trainers = new List<TrainerDto>();
        foreach (var user in nameFilteredTrainers)
        {
            trainers.Add(new TrainerDto
            {
                User = _userMapper.ToDto(user),
                TrainerClasses = await _unitOfWork.ClassRepository.GetClassesByTrainerIdAsync(user.Id)
            });

        }

        if (classType == null)
            return trainers;

        //Filter by class type
        List<TrainerDto> fullyFilteredTrainers = trainers
            .Where(trainer => trainer.TrainerClasses.Any(c => c.Type == classType))
            .ToList();

        return fullyFilteredTrainers;
    }


    public List<User> FindMatchingTrainers(string query, List<User> trainers)
    {
        string[] queryKeys = GetKeys(ClearText(query));
        List<User> matchingTrainers = new List<User>();

        foreach (var trainer in trainers)
        {
            string[] productKeys = GetKeys(ClearText(trainer.Name));

            if (IsMatch(queryKeys, productKeys))
            {
                matchingTrainers.Add(trainer);
            }
        }

        return matchingTrainers;
    }

    private bool IsMatch(string[] queryKeys, string[] productKeys)
    {
        foreach (var queryKey in queryKeys)
        {
            foreach (var productKey in productKeys)
            {
                if (IsMatch(queryKey, productKey))
                {
                    return true;
                }
            }
        }
        return false;
    }

    private bool IsMatch(string queryKey, string productKey)
    {
        return queryKey == productKey
            || productKey.Contains(queryKey)
            || _stringSimilarityComparer.Similarity(queryKey, productKey) >= THRESHOLD;
    }

    private string[] GetKeys(string text)
    {
        return text.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    private string ClearText(string text)
    {
        return RemoveDiacritics(text.ToLower());
    }

    private string RemoveDiacritics(string text)
    {
        string normalizedString = text.Normalize(NormalizationForm.FormD);
        StringBuilder stringBuilder = new StringBuilder(normalizedString.Length);

        for (int i = 0; i < normalizedString.Length; i++)
        {
            char c = normalizedString[i];
            UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }
}
