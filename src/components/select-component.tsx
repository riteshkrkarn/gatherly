import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SelectComponentProps {
  selectedFields: {
    name: boolean;
    username: boolean;
    avatar: boolean;
  };
  onFieldChange: (field: string, checked: boolean) => void;
}

export default function SelectComponent({
  selectedFields,
  onFieldChange,
}: SelectComponentProps) {
  const id = useId();
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${id}-1`}
          checked={selectedFields.name}
          onCheckedChange={(checked) =>
            onFieldChange("name", checked as boolean)
          }
        />
        <Label htmlFor={`${id}-1`}>Name</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${id}-2`}
          checked={selectedFields.username}
          onCheckedChange={(checked) =>
            onFieldChange("username", checked as boolean)
          }
        />
        <Label htmlFor={`${id}-2`}>Username</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${id}-3`}
          checked={selectedFields.avatar}
          onCheckedChange={(checked) =>
            onFieldChange("avatar", checked as boolean)
          }
        />
        <Label htmlFor={`${id}-3`}>Avatar</Label>
      </div>
    </div>
  );
}
