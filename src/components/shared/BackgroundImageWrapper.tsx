import { cn } from '@/lib/utils';
import { BackgroundImageWrapperProps } from '@/types';

const BackgroundImageWrapper: React.FC<BackgroundImageWrapperProps> = ({
  image,
  children,
  height = 'h-[100vh]',
  className = '',
  overlayClassName = '',
  overlay = false,
  opacity = 'opacity-50',
  childrenClass = 'relative z-10 flex justify-center items-center w-full h-full',
}) => {
  return (
    <div
      className={cn('relative w-full bg-cover bg-center overflow-hidden', `${height}`, className)}
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay */}
      {overlay && <div className={cn('absolute inset-0 bg-black', opacity, overlayClassName)} />}

      {/* Content */}
      <div className={cn(childrenClass)}>{children}</div>
    </div>
  );
};

export default BackgroundImageWrapper;
