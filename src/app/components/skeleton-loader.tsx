import { motion } from "motion/react";

export function ProjectCardSkeleton() {
  return (
    <div className="relative bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] backdrop-blur-xl rounded-3xl border border-[var(--border-color)] overflow-hidden min-h-[300px]">
      {/* Image skeleton */}
      <div className="absolute inset-0 bg-[var(--bg-secondary)] shimmer" />
      
      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-4">
        {/* Tags */}
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-[var(--bg-secondary)] rounded-full shimmer" />
          <div className="w-20 h-6 bg-[var(--bg-secondary)] rounded-full shimmer" />
          <div className="w-14 h-6 bg-[var(--bg-secondary)] rounded-full shimmer" />
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="w-3/4 h-8 bg-[var(--bg-secondary)] rounded shimmer" />
          <div className="w-1/2 h-6 bg-[var(--bg-secondary)] rounded shimmer" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-[var(--bg-secondary)] rounded shimmer" />
          <div className="w-5/6 h-4 bg-[var(--bg-secondary)] rounded shimmer" />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-[var(--bg-secondary)] rounded-xl shimmer" />
          <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-xl shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ExperienceCardSkeleton() {
  return (
    <div className="relative bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] backdrop-blur-xl rounded-3xl border border-[var(--border-color)] p-6 md:p-8">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-2xl shimmer" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-[var(--bg-secondary)] rounded shimmer" />
              <div className="w-32 h-5 bg-[var(--bg-secondary)] rounded shimmer" />
            </div>
          </div>
          <div className="w-20 h-8 bg-[var(--bg-secondary)] rounded-full shimmer" />
        </div>
        
        {/* Meta info */}
        <div className="flex gap-4">
          <div className="w-24 h-4 bg-[var(--bg-secondary)] rounded shimmer" />
          <div className="w-28 h-4 bg-[var(--bg-secondary)] rounded shimmer" />
          <div className="w-20 h-4 bg-[var(--bg-secondary)] rounded shimmer" />
        </div>
        
        {/* Achievements */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-[var(--bg-secondary)] rounded-xl shimmer" />
          <div className="h-16 bg-[var(--bg-secondary)] rounded-xl shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton({ type = "default" }: { type?: "default" | "hero" | "about" }) {
  if (type === "hero") {
    return (
      <section className="relative min-h-screen py-20 px-4 bg-[var(--bg-primary)] flex items-center">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <div className="space-y-6">
              <div className="w-32 h-8 bg-[var(--bg-secondary)] rounded shimmer" />
              <div className="space-y-4">
                <div className="w-full h-12 bg-[var(--bg-secondary)] rounded shimmer" />
                <div className="w-4/5 h-12 bg-[var(--bg-secondary)] rounded shimmer" />
              </div>
              <div className="space-y-2">
                <div className="w-full h-6 bg-[var(--bg-secondary)] rounded shimmer" />
                <div className="w-5/6 h-6 bg-[var(--bg-secondary)] rounded shimmer" />
              </div>
              <div className="flex gap-4">
                <div className="w-32 h-14 bg-[var(--bg-secondary)] rounded-xl shimmer" />
                <div className="w-32 h-14 bg-[var(--bg-secondary)] rounded-xl shimmer" />
              </div>
            </div>
            
            {/* Right side */}
            <div className="hidden lg:block">
              <div className="w-full h-[500px] bg-[var(--bg-secondary)] rounded-3xl shimmer" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (type === "about") {
    return (
      <section className="relative py-20 px-4 bg-[var(--bg-primary)]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <div className="w-64 h-12 bg-[var(--bg-secondary)] rounded mx-auto shimmer" />
            <div className="w-96 h-6 bg-[var(--bg-secondary)] rounded mx-auto shimmer" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="w-full h-96 bg-[var(--bg-secondary)] rounded-3xl shimmer" />
            <div className="space-y-4">
              <div className="w-full h-6 bg-[var(--bg-secondary)] rounded shimmer" />
              <div className="w-full h-6 bg-[var(--bg-secondary)] rounded shimmer" />
              <div className="w-4/5 h-6 bg-[var(--bg-secondary)] rounded shimmer" />
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="h-24 bg-[var(--bg-secondary)] rounded-xl shimmer" />
                <div className="h-24 bg-[var(--bg-secondary)] rounded-xl shimmer" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-4 bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="w-64 h-12 bg-[var(--bg-secondary)] rounded mx-auto shimmer" />
        </div>
        <div className="grid gap-6">
          <div className="w-full h-48 bg-[var(--bg-secondary)] rounded-3xl shimmer" />
          <div className="w-full h-48 bg-[var(--bg-secondary)] rounded-3xl shimmer" />
          <div className="w-full h-48 bg-[var(--bg-secondary)] rounded-3xl shimmer" />
        </div>
      </div>
    </section>
  );
}

export function ImageSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[var(--bg-secondary)] shimmer ${className}`}>
      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
        <svg className="w-12 h-12 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
}
