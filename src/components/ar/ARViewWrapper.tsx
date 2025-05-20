
import React, { Suspense } from 'react';
import { AlertTriangle, ScanLine, QrCode, Info } from 'lucide-react';
import { RMDEDrive } from '@/utils/types/rmdeTypes';

// Lazily load the AR Scene component
const ARScene = React.lazy(() => 
  import('@/components/ar/ARScene')
    .catch(err => {
      console.error("Failed to load AR Scene:", err);
      // Return a fallback component
      return {
        default: () => (
          <div className="flex h-full w-full items-center justify-center">
            <p>AR functionality could not be loaded. Please check your device compatibility.</p>
          </div>
        )
      };
    })
);

// Simple wrapper to handle AR canvas
const ARCanvasWrapper = ({ children }: { children: React.ReactNode }) => {
  try {
    // Dynamically import ZapparCanvas only when needed
    const { ZapparCanvas } = require('@zappar/zappar-react-three-fiber');
    return <ZapparCanvas>{children}</ZapparCanvas>;
  } catch (error) {
    console.error("Failed to initialize ZapparCanvas:", error);
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>AR functionality could not be initialized.</p>
      </div>
    );
  }
};

// Properly define the ErrorBoundary component with the necessary props
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("AR Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface ARViewWrapperProps {
  drives: RMDEDrive[];
  arMode: boolean;
  arError: string | null;
}

const ARViewWrapper: React.FC<ARViewWrapperProps> = ({ drives, arMode, arError }) => {
  if (!arMode) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Enable AR mode to visualize drive data in augmented reality.</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
      {/* AR instructions overlay */}
      <div className="absolute z-10 top-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
        <div className="flex items-center mb-1">
          <ScanLine className="h-4 w-4 mr-2" />
          <span className="font-semibold">Point camera at QR code</span>
        </div>
        <p className="text-xs opacity-80">
          Hold your device steady and point at the QR code to view drive data in AR
        </p>
        <div className="mt-2 text-xs opacity-90 flex flex-col">
          <div className="flex items-center">
            <QrCode className="h-3 w-3 mr-1 text-green-400" />
            <span>These QR codes are <span className="text-green-400">ONLY for the AR Dashboard</span>, not web browsers</span>
          </div>
          <div className="flex items-center mt-1">
            <Info className="h-3 w-3 mr-1 text-blue-400" />
            <span>Tap on 3D models to see maintenance options and error fix instructions</span>
          </div>
        </div>
      </div>
      
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center">Loading AR capabilities...</div>}>
        {arError ? (
          <div className="flex h-full w-full items-center justify-center bg-red-50 text-red-500">
            <AlertTriangle className="h-8 w-8 mr-2" />
            <p>{arError}</p>
          </div>
        ) : (
          <ErrorBoundary fallback={
            <div className="flex flex-col h-full w-full items-center justify-center p-4">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
              <p className="text-center">Something went wrong with AR initialization</p>
              <p className="text-sm text-gray-500 mt-2">
                Try refreshing the page or check if your device supports AR features
              </p>
            </div>
          }>
            <ARCanvasWrapper>
              <ARScene drives={drives} />
            </ARCanvasWrapper>
          </ErrorBoundary>
        )}
      </Suspense>
    </div>
  );
};

export default ARViewWrapper;
