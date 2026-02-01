import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    priority?: boolean;
    blur?: boolean;
    fallback?: string;
    aspectRatio?: string;
    className?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export default function OptimizedImage({
    src,
    alt,
    priority = false,
    blur = true,
    fallback = '/images/placeholder.jpg',
    aspectRatio,
    className,
    onLoad,
    onError,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || isLoaded) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '100px', threshold: 0.01 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority, isLoaded]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    const imageSrc = hasError ? fallback : src;

    return (
        <div
            ref={imgRef}
            className={cn('relative overflow-hidden', className)}
            style={aspectRatio ? { aspectRatio } : undefined}
        >
            {/* Blur placeholder */}
            {blur && !isLoaded && (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse"
                    style={{
                        filter: 'blur(20px)',
                        transform: 'scale(1.1)',
                    }}
                />
            )}

            {/* Actual image */}
            {isInView && (
                <motion.img
                    src={imageSrc}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    decoding={priority ? 'sync' : 'async'}
                    onLoad={handleLoad}
                    onError={handleError}
                    initial={blur ? { opacity: 0 } : { opacity: 1 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        'w-full h-full object-cover',
                        !isLoaded && 'invisible'
                    )}
                />
            )}

            {/* Loading skeleton for non-blur mode */}
            {!blur && !isLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
        </div>
    );
}

/**
 * Picture component with WebP support
 */
interface OptimizedPictureProps extends OptimizedImageProps {
    webpSrc?: string;
}

export function OptimizedPicture({
    src,
    webpSrc,
    alt,
    ...props
}: OptimizedPictureProps) {
    // Auto-generate webp path if not provided
    const webp = webpSrc || src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    return (
        <picture>
            <source srcSet={webp} type="image/webp" />
            <OptimizedImage src={src} alt={alt} {...props} />
        </picture>
    );
}
