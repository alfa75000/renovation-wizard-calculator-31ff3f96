
import React from 'react';
import RoomCustomItems from './RoomCustomItems';

interface AutresSurfacesListWithSupabaseProps {
  roomId: string;
}

const AutresSurfacesListWithSupabase: React.FC<AutresSurfacesListWithSupabaseProps> = ({ roomId }) => {
  return (
    <div className="mt-4">
      <RoomCustomItems 
        roomId={roomId} 
        isLocalMode={false}
      />
    </div>
  );
};

export default AutresSurfacesListWithSupabase;
