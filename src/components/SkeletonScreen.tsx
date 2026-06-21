import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface border border-outline-variant p-4 rounded-lg flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-outline-variant rounded w-1/3" />
        <div className="w-5 h-5 rounded-full bg-outline-variant" />
      </div>
      <div className="h-6 bg-outline-variant rounded w-1/2" />
      <div className="h-3 bg-outline-variant rounded w-3/4" />
    </div>
  );
};

export const SkeletonTable: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-2 p-4 animate-pulse">
      <div className="h-8 bg-surface-container-high rounded w-full" />
      <div className="h-10 bg-surface-container rounded w-full" />
      <div className="h-10 bg-surface-container rounded w-full" />
      <div className="h-10 bg-surface-container rounded w-full" />
      <div className="h-10 bg-surface-container rounded w-full" />
    </div>
  );
};
export default SkeletonCard;
