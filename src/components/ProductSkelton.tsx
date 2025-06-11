import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <Card className="border-border bg-card min-h-[532px]">
      <CardHeader className="p-0">
        <Skeleton className="w-full aspect-square rounded-t-lg" />
      </CardHeader>

      <CardContent className="p-4 min-h-[176px]">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16 ml-2" />
        </div>

        <Skeleton className="h-6 w-20 mb-2" />

        <div className="flex justify-between text-sm mb-3">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-16" />
        </div>

        <div className="space-y-1">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </CardFooter>
    </Card>
  );
};

export default ProductSkeleton;
