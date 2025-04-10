
import React, { useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formaterQuantite } from "@/lib/utils";
import { Room } from "@/types";
import RoomForm from "@/components/room/RoomForm";
import RoomsList from "@/components/room/RoomsList";
import { useProjectInfo } from "@/features/chantier/hooks/useProjectInfo";

interface RoomsCardProps {
  rooms: Room[];
  editingRoomId: string | null;
  roomTypes: string[];
  onAddRoom: (room: Omit<Room, "id">) => void;
  onEditRoom: (id: string) => void;
  onDeleteRoom: (id: string) => void;
}

const RoomsCard: React.FC<RoomsCardProps> = ({
  rooms,
  editingRoomId,
  roomTypes,
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}) => {
  const { generateProjectNameIfNeeded, shouldGenerateProjectName } = useProjectInfo();

  const calculateTotalArea = () => {
    return rooms.reduce((total, room) => total + room.surface, 0);
  };

  const editingRoom = editingRoomId ? rooms.find(room => room.id === editingRoomId) || null : null;

  // Enhanced handler for adding a room that also generates project name if needed
  const handleAddRoom = async (room: Omit<Room, "id">) => {
    // Check if this is the first room and project name is empty
    if (rooms.length === 0 && shouldGenerateProjectName()) {
      // Generate project name before adding the room
      console.log("First room being added with empty project name, generating name automatically");
      await generateProjectNameIfNeeded();
    }
    
    // Call the original onAddRoom function
    onAddRoom(room);
  };

  return (
    <Card className="mb-8 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold">Pièces à rénover</h2>
        </div>
        
        <RoomForm 
          onAddRoom={handleAddRoom}
          editingRoom={editingRoom}
          roomTypes={roomTypes}
        />
        
        <RoomsList 
          rooms={rooms}
          onEditRoom={onEditRoom}
          onDeleteRoom={onDeleteRoom}
        />
        
        {rooms.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <div>
              <span className="font-medium">Surface totale des pièces : </span>
              <span className="text-xl font-bold">{formaterQuantite(calculateTotalArea())} m²</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomsCard;
