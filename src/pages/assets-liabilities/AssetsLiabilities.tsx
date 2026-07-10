import { useAssets, useCreateAsset, useUpdateAsset, useLiabilities, useCreateLiability, useUpdateLiability } from '../../hooks/useApi';
import { AssetForm } from '../../components/assets-liabilities/AssetForm';
import { AssetList } from '../../components/assets-liabilities/AssetList';
import { LiabilityForm } from '../../components/assets-liabilities/LiabilityForm';
import { LiabilityList } from '../../components/assets-liabilities/LiabilityList';

export default function AssetsLiabilities() {
  const { data: assets } = useAssets();
  const { data: liabilities } = useLiabilities();
  
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const createLiability = useCreateLiability();
  const updateLiability = useUpdateLiability();

  const handleAssetSubmit = (data: any) => {
    createAsset.mutate(data);
  };

  const handleLiabilitySubmit = (data: any) => {
    createLiability.mutate(data);
  };

  const handleEditAsset = (id: string, currentName: string) => {
    const newName = window.prompt('Enter new asset name:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateAsset.mutate({ id, updates: { name: newName.trim() } });
    }
  };

  const handleEditLiability = (id: string, currentName: string) => {
    const newName = window.prompt('Enter new liability name:', currentName);
    if (newName && newName.trim() !== currentName) {
      updateLiability.mutate({ id, updates: { name: newName.trim() } });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Assets & Liabilities</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <AssetForm onSubmit={handleAssetSubmit} isPending={createAsset.isPending} />
          <AssetList assets={assets} onEdit={handleEditAsset} />
        </div>

        <div className="space-y-6">
          <LiabilityForm onSubmit={handleLiabilitySubmit} isPending={createLiability.isPending} />
          <LiabilityList liabilities={liabilities} onEdit={handleEditLiability} />
        </div>
      </div>
    </div>
  );
}
