import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  animate?: boolean;
  style?: CSSProperties;
}

export function Skeleton({
  className,
  rounded = 'md',
  animate = true,
  style,
}: SkeletonProps) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'bg-gray-200',
        roundedClasses[rounded],
        animate && 'animate-pulse',
        className
      )}
      style={style}
    />
  );
}

/**
 * Product Card Skeleton
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
      {/* Image */}
      <Skeleton className="w-full aspect-[3/4] mb-4" rounded="lg" />

      {/* Title */}
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />

      {/* Author */}
      <Skeleton className="h-3 w-2/3 mb-4" />

      {/* Price */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20" rounded="lg" />
        <Skeleton className="h-4 w-14" />
      </div>

      {/* Button */}
      <Skeleton className="h-10 w-full mt-4" rounded="lg" />
    </div>
  );
}

/**
 * Product Grid Skeleton
 */
interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Banner Skeleton
 */
export function BannerSkeleton() {
  return (
    <Skeleton className="w-full h-[300px] md:h-[400px]" rounded="xl" />
  );
}

/**
 * Text Block Skeleton
 */
interface TextSkeletonProps {
  lines?: number;
}

export function TextSkeleton({ lines = 3 }: TextSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  );
}

/**
 * Avatar Skeleton
 */
interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarSkeleton({ size = 'md' }: AvatarSkeletonProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return <Skeleton className={sizes[size]} rounded="full" />;
}

/**
 * List Item Skeleton
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <AvatarSkeleton />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Cart Item Skeleton
 */
export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl">
      <Skeleton className="w-20 h-28 flex-shrink-0" rounded="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Skeleton className="h-8 w-24" rounded="lg" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}
