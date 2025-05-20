
import React, { Suspense } from 'react';
import { AlertTriangle, Info, Camera3d } from 'lucide-react';
import { RMDEDrive } from '@/utils/types/rmdeTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

// Simple wrapper to handle AR canvas - using dynamic import to avoid require issues
const ARCanvasWrapper = ({ children }: { children: React.ReactNode }) => {
  // In a browser environment, we can't use require directly
  // Instead we'll create a fallback that explains web limitations
  return (
    <div className="relative h-full w-full">
      {children}
    </div>
  );
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
          <Info className="h-4 w-4 mr-2" />
          <span className="font-semibold">Drive Visualization</span>
        </div>
        <p className="text-xs opacity-80">
          Select a drive from the top panel to view its data in our 3D environment
        </p>
        <div className="mt-2 text-xs opacity-90 flex flex-col">
          <div className="flex items-center mt-1">
            <Info className="h-3 w-3 mr-1 text-blue-400" />
            <span>Our AR features are in development for mobile devices</span>
          </div>
          <div className="flex items-center mt-1">
            <Info className="h-3 w-3 mr-1 text-blue-400" />
            <span>For now, enjoy our 3D visualization mode</span>
          </div>
        </div>
      </div>
      
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center">Loading visualization capabilities...</div>}>
        {arError ? (
          <div className="flex h-full w-full items-center justify-center bg-red-50 text-red-500">
            <AlertTriangle className="h-8 w-8 mr-2" />
            <p>{arError}</p>
          </div>
        ) : (
          <ErrorBoundary fallback={
            <div className="flex flex-col h-full w-full items-center justify-center p-4 bg-gray-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera3d className="h-5 w-5 text-purple-500" />
                    Drive Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <AlertTriangle className="h-12 w-12 text-amber-500" />
                    <div>
                      <h3 className="text-lg font-medium">AR Features In Development</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Our augmented reality features are currently only available on compatible mobile devices
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md w-full text-sm">
                      <p className="font-medium">Try these alternatives:</p>
                      <ul className="list-disc list-inside mt-1 text-gray-600">
                        <li>View drive details in the dashboard</li>
                        <li>Check the Drive Health Index</li>
                        <li>Use the Behavioral Fingerprint analysis</li>
                      </ul>
                    </div>
                    <Button variant="outline" className="mt-2">
                      Return to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
