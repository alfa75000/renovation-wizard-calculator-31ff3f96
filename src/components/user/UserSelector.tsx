
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppUser } from '@/hooks/useAppState';
import { Loader2 } from 'lucide-react';

interface UserSelectorProps {
  users: AppUser[];
  currentUser: AppUser | null;
  isLoading: boolean;
  onSelectUser: (userId: string) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  currentUser,
  isLoading,
  onSelectUser
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-9 w-44 px-2 rounded-md text-gray-500 bg-gray-100">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-xs">Chargement...</span>
      </div>
    );
  }

  return (
    <Select
      value={currentUser?.id || ''}
      onValueChange={onSelectUser}
      disabled={isLoading}
    >
      <SelectTrigger className="h-9 w-48">
        <SelectValue placeholder="Sélectionner un utilisateur" />
      </SelectTrigger>
      <SelectContent>
        {users.map(user => (
          <SelectItem key={user.id} value={user.id}>
            {user.username} {user.role === 'Admin' ? '(Admin)' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
