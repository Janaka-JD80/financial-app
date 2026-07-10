import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import { TransactionGroup } from '../../types';

interface GroupManagerProps {
  groups: TransactionGroup[] | undefined;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, currentName: string) => void;
  isPending: boolean;
}

export function GroupManager({
  groups,
  onAdd,
  onDelete,
  onEdit,
  isPending,
}: GroupManagerProps) {
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      onAdd(newGroupName.trim());
      setNewGroupName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Input 
              placeholder="New group name" 
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Button 
              type="button" 
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim() || isPending}
            >
              Add
            </Button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {!groups || groups.length === 0 ? (
              <p className="text-zinc-500 text-xs">No groups found.</p>
            ) : (
              groups.map(g => (
                <div key={g.id} className="flex justify-between items-center p-2 bg-zinc-50 rounded-lg">
                  <span className="text-sm font-medium">{g.name}</span>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(g.id, g.name)}
                      className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(g.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
