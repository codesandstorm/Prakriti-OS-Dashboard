import React from 'react';

export const GlobalLoadingSkeleton: React.FC = () => {
  return (
    <div className="flex-1 bg-surface flex flex-col p-6 animate-pulse select-none h-full overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
        <div className="space-y-3 w-1/3">
          <div className="h-3 bg-surface-container-high rounded w-1/4"></div>
          <div className="h-6 bg-surface-container-high rounded w-3/4"></div>
        </div>
        <div className="flex items-center gap-4 w-1/4 justify-end">
          <div className="h-4 bg-surface-container-high rounded w-16"></div>
          <div className="h-8 w-8 bg-surface-container-high rounded-full"></div>
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-12 bg-surface-container-high rounded-lg w-full mb-6"></div>

      {/* Grid Skeleton */}
      <div className="flex-1 grid grid-cols-12 gap-4">
        {/* Large Main Panel */}
        <div className="col-span-8 bg-surface-container-low rounded-lg border border-outline-variant p-4 flex flex-col justify-between">
          <div className="h-5 bg-surface-container-high rounded w-1/3 mb-4"></div>
          <div className="flex-1 bg-surface-container-high rounded-md opacity-50"></div>
        </div>

        {/* Side Panels */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="h-1/3 bg-surface-container-low rounded-lg border border-outline-variant p-4">
            <div className="h-5 bg-surface-container-high rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-surface-container-high rounded w-full"></div>
              <div className="h-3 bg-surface-container-high rounded w-5/6"></div>
            </div>
          </div>
          <div className="flex-1 bg-surface-container-low rounded-lg border border-outline-variant p-4">
            <div className="h-5 bg-surface-container-high rounded w-2/3 mb-4"></div>
            <div className="flex flex-col gap-3 h-full justify-end">
               <div className="h-16 bg-surface-container-high rounded w-full"></div>
               <div className="h-16 bg-surface-container-high rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
