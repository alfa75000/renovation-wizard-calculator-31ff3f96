
import React from 'react';
import { useAutresSurfacesWithSupabase } from '@/hooks/useAutresSurfacesWithSupabase';
import RoomCustomItems from './RoomCustomItems';

interface AutresSurfacesListWithSupabaseProps {
  roomId: string;
}

const AutresSurfacesListWithSupabase: React.FC<AutresSurfacesListWithSupabaseProps> = ({ roomId }) => {
  // Utiliser le nouveau hook avec Supabase
  const { 
    autresSurfaces, 
    loading, 
    error 
  } = useAutresSurfacesWithSupabase(roomId);

  return (
    <div className="mt-4">
      <RoomCustomItems roomId={roomId} />
    </div>
  );
};

export default AutresSurfacesListWithSupabase;
