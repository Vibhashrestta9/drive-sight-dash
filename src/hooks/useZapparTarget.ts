
import { useState, useEffect } from 'react';

export function useZapparTarget(targetFile: string) {
  const [targetFileLoaded, setTargetFileLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if the target file exists
    fetch(targetFile)
      .then(response => {
        if (response.ok) {
          setTargetFileLoaded(true);
        } else {
          console.error("Failed to load target file:", response.statusText);
          setErrorMessage("QR target file could not be loaded");
        }
      })
      .catch(error => {
        console.error("Error loading target file:", error);
        setErrorMessage("Error loading QR target file");
      });
  }, [targetFile]);

  return { targetFileLoaded, errorMessage };
}
