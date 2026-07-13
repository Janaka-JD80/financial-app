import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUserAccount, signOutUser } from '../../api/auth';
import { Trash2, AlertTriangle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function Profile() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'WARNING: Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    );

    if (confirmed) {
      try {
        setIsDeleting(true);
        await deleteUserAccount();
        await signOutUser();
        navigate('/login');
      } catch (error: any) {
        setIsDeleting(false);
        alert(`Failed to delete account: ${error.message}`);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Profile Settings</h1>
      </div>

      <Card className="border-red-100">
        <CardHeader className="bg-red-50/50 border-b border-red-100 rounded-t-xl">
          <CardTitle className="text-red-700 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Delete Account</h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-md">
                Permanently delete your account and all of your data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
