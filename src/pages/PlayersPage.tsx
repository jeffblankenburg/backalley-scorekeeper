import { useState } from 'react';
import { useFriends } from '../hooks/useFriends.ts';
import { FriendsList } from '../components/players/PlayerList.tsx';
import { PlayerSearch } from '../components/players/PlayerSearch.tsx';
import { InviteForm } from '../components/players/InviteForm.tsx';

export function PlayersPage() {
  const { friends, loading, addFriend, removeFriend, searchProfiles, inviteByEmail } = useFriends();
  const [friendsOpen, setFriendsOpen] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Friends</h2>

      {/* Search for existing users */}
      <PlayerSearch onSearch={searchProfiles} onAdd={addFriend} />

      {/* Invite by email */}
      <InviteForm onInvite={inviteByEmail} />

      {/* Friends list (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setFriendsOpen(!friendsOpen)}
          className="flex items-center gap-2 w-full text-left"
        >
          <span className={['text-xs text-slate-400 transition-transform', friendsOpen ? 'rotate-90' : ''].join(' ')}>
            &#9654;
          </span>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Your Friends ({friends.length})
          </h3>
        </button>
        {friendsOpen && (
          <div className="mt-2">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
            ) : (
              <FriendsList friends={friends} onRemove={removeFriend} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
