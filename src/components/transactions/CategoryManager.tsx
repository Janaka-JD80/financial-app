import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[] | undefined;
  type: 'income' | 'expense';
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, currentName: string) => void;
  isPending: boolean;
}

export function CategoryManager({
  categories,
  type,
  onAdd,
  onDelete,
  onEdit,
  isPending,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      onAdd(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <p className="text-xs text-zinc-500 mb-1">Creates a new {type} category</p>
            <div className="flex space-x-2">
              <Input 
                placeholder="New category name" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Button 
                type="button" 
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || isPending}
              >
                Add
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {!categories || categories.length === 0 ? (
              <p className="text-zinc-500 text-xs">No categories found.</p>
            ) : (
              categories.map(c => (
                <div key={c.id} className="flex justify-between items-center p-2 bg-zinc-50 rounded-lg">
                  <span className="text-sm font-medium">{c.name}</span>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(c.id, c.name)}
                      className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(c.id)}
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
