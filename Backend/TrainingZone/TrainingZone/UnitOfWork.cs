namespace TrainingZone;

public class UnitOfWork
{
    private readonly TrainingZoneContext _context;

    //private GameRepository _gameRepository;
    private PlayRepository _playRepository;
    private UserRepository _userRepository;
    private FriendshipRepository _friendshipRepository;
    PlayDetailRepository _playDetailRepository;

    //public GameRepository OrderRepository => _gameRepository ??= new GameRepository(_context);
    public PlayRepository PlayRepository => _playRepository ??= new PlayRepository(_context);
    public PlayDetailRepository PlayDetailRepository => _playDetailRepository ??= new PlayDetailRepository(_context);

    public UserRepository UserRepository => _userRepository ??= new UserRepository(_context);
    public FriendshipRepository FriendshipRepository => _friendshipRepository ??= new FriendshipRepository(_context);


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

