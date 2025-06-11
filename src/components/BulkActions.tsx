import React from "react";
import { Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  allSelected: boolean;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  allSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Badge variant="secondary" className="bg-teal-100 text-teal-800">
          {selectedCount} selected
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="text-teal-700 hover:text-teal-900"
        >
          {allSelected ? (
            <>
              <Square className="h-4 w-4 mr-1" />
              Deselect All
            </>
          ) : (
            <>
              <CheckSquare className="h-4 w-4 mr-1" />
              Select All ({totalCount})
            </>
          )}
        </Button>
      </div>

      <Button
        
        size="sm"
        onClick={onDeleteSelected}
        className="flex items-center space-x-2 border-1 border-red-500 text-red-500 bg-red-100 hover:bg-red-500 hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete Selected</span>
      </Button>
    </div>
  );
};
