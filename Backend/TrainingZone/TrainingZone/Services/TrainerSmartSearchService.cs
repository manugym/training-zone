using F23.StringSimilarity.Interfaces;
using F23.StringSimilarity;
using System.Globalization;
using System.Text;
using TrainingZone.Models.DataBase;
using TrainingZone.Enums;

namespace TrainingZone.Services;

public class TrainerSmartSearchService
{
    private const double THRESHOLD = 0.75;
    private readonly UnitOfWork _unitOfWork;
    private readonly INormalizedStringSimilarity _stringSimilarityComparer;

    public TrainerSmartSearchService(UnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _stringSimilarityComparer = new JaroWinkler();
    }

    public async Task<List<User>> Search(string query, ClassType? classType = null)
    {
        //Filtra por clase (implementación cuando tengamos el servicio de las clases )
        if (classType != null)
            throw new NotImplementedException();

        //Obtiene todos los entrenadores 
        List<User> trainers = await _unitOfWork.UserRepository.GetAllTrainersAsync();

        if (query == null || query.Equals(""))
        {
            return trainers;
        }

        //Filtra por el nombre
        List<User> matchingTrainers = FindMatchingTrainers(query, trainers);

        return matchingTrainers;
    }

    public List<User> FindMatchingTrainers(string query, List<User> trainers)
    {
        string[] queryKeys = GetKeys(ClearText(query));
        List<User> matchingTrainers = new List<User>();

        foreach (var product in trainers)
        {
            string[] productKeys = GetKeys(ClearText(product.Name));

            if (IsMatch(queryKeys, productKeys))
            {
                matchingTrainers.Add(product);
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
