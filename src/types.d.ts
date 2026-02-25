interface Window {
  electronAPI: {
    analyzeCommand: (text: string) => Promise<{ success: boolean; actionType: string; code?: string; error?: string; message?: string }>;
    executeCommand: (cmd: string) => Promise<{ success: boolean; stdout?: string; stderr?: string; error?: string }>;
  };
}
