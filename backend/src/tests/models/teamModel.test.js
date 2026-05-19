const User = require('../../models/User');
const Team = require('../../models/Team');

describe('Team Model', () => {
  let ownerId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Team Owner',
      email: 'teamowner@example.com',
      passwordHash: 'password123',
    });
    ownerId = user._id;
  });

  it('should require name and owner', async () => {
    const team = new Team({});
    let err;
    try {
      await team.validate();
    } catch (e) {
      err = e;
    }
    expect(err.errors.name).toBeDefined();
    expect(err.errors.owner).toBeDefined();
  });

  it('should create team with private visibility by default', async () => {
    const team = await Team.create({
      name: 'Dev Team',
      owner: ownerId,
      members: [ownerId],
    });
    expect(team.visibility).toBe('private');
    expect(team.members).toHaveLength(1);
  });
});
