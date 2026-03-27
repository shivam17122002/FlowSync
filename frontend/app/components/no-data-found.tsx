import { CirclePlus, LayoutGrid } from "lucide-react";
import { Button } from "./ui/button";

interface NoDataFoundProps {
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
}

export const NoDataFound = ({
  title,
  description,
  buttonText,
  buttonAction,
}: NoDataFoundProps) => {
  return (
    <div className="surface-panel mesh-bg col-span-full text-center py-12 2xl:py-24">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner shadow-primary/10">
        <LayoutGrid className="size-8" />
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      <Button onClick={buttonAction} className="mt-6">
        <CirclePlus className="size-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
};
