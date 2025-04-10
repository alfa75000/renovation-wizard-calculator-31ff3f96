
import React from 'react';
import RoomCustomItems from './RoomCustomItems';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAutresSurfacesWithSupabase } from '@/hooks/useAutresSurfacesWithSupabase';
import { Loader } from '@/components/ui/loader';

interface AutresSurfacesListWithSupabaseProps {
  roomId: string;
}

const AutresSurfacesListWithSupabase: React.FC<AutresSurfacesListWithSupabaseProps> = ({ roomId }) => {
  const { loading, error } = useAutresSurfacesWithSupabase(roomId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Autres surfaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Autres surfaces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4">
      <RoomCustomItems 
        roomId={roomId} 
      />
    </div>
  );
};

export default AutresSurfacesListWithSupabase;
