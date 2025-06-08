using TrainingZone.Repositories;

namespace TrainingZone;

public class UnitOfWork
{
    private readonly TrainingZoneContext _context;

    //private GameRepository _gameRepository;
    private UserRepository _userRepository;
    private ChatRepository _chatRepository ;
    private ChatMessageRepository _chatMessageRepository;
    private ClassRepository _classRepository;
    private ScheduleRepository _scheduleRepository;
    private ReservationRepository _reservationRepository;


    public UserRepository UserRepository => _userRepository ??= new UserRepository(_context);
    public ChatRepository ChatRepository => _chatRepository ??= new ChatRepository(_context);
    public ChatMessageRepository ChatMessageRepository => _chatMessageRepository ??= new ChatMessageRepository(_context);
    public ClassRepository ClassRepository => _classRepository ??= new ClassRepository(_context);
    public ScheduleRepository ScheduleRepository => _scheduleRepository ??= new ScheduleRepository(_context);
    public ReservationRepository ReservationRepository => _reservationRepository ?? new ReservationRepository(_context);
    
    public UnitOfWork(TrainingZoneContext context)
    {
        _context = context;
    }

    public TrainingZoneContext Context => _context;

    public async Task<bool> SaveAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

}

