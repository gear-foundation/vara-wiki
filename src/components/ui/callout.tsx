'use client';
import { 
  Callout as BaseCallout,
  CalloutContainer,
  CalloutTitle,
  CalloutDescription,
} from 'fumadocs-ui/components/callout';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { Info } from 'lucide-react';

export interface CalloutProps extends ComponentProps<typeof BaseCallout> {
  /**
   * Variant for custom display styles
   * @default 'default'
   */
  variant?: 'default' | 'compact' | 'bordered' | 'minimal';
}

// Extended alias resolution function
function resolveExtendedAlias(type: string): string {
  if (type === 'warn') return 'warning';
  if (type === 'tip') return 'info';
  if (type === 'important') return 'warning'; // Maps to warning
  if (type === 'note') return 'note'; // Keep for custom handling with muted colors
  return type;
}

export function Callout({ 
  variant = 'default',
  className,
  type,
  ...props 
}: CalloutProps) {
  const variantClasses = {
    default: '',
    compact: 'py-2 px-3 text-sm',
    bordered: 'border-2 border-fd-border',
    minimal: 'bg-transparent border-none shadow-none',
  };

  // Resolve type alias
  const resolvedType = resolveExtendedAlias(type || 'info');

  // Custom handling for 'note' type with muted colors
  if (resolvedType === 'note') {
    const iconClass = 'text-fd-muted fill-fd-muted';
    
    return (
      <CalloutContainer
        className={cn(
          'relative',
          variantClasses[variant],
          className
        )}
      >
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-fd-muted/50" />
        <div className="flex gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded">
            <Info className={cn('h-4 w-4', iconClass)} />
          </div>
          <div className="flex-1 space-y-1">
            {props.title && (
              <CalloutTitle>{props.title}</CalloutTitle>
            )}
            <CalloutDescription>{props.children}</CalloutDescription>
          </div>
        </div>
      </CalloutContainer>
    );
  }

  // For all other types, use BaseCallout with resolved type
  return (
    <BaseCallout
      type={resolvedType as any}
      className={cn(
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
