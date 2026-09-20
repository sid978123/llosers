export interface ServerConversionOptions {
  password?: string;
  onProgress?: (percent: number) => void;
}

export async function executeServerTool(
  endpoint: string,
  file: File,
  options?: ServerConversionOptions
): Promise<{ blob: Blob; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);
  if (options?.password) {
    formData.append('password', options.password);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errorMsg = errData.detail;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }

  // Get filename from Content-Disposition header if available
  const disposition = response.headers.get('content-disposition');
  let filename = 'converted_document';
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match && match[1]) {
      filename = match[1].replace(/['"]/g, '');
    }
  }

  const blob = await response.blob();
  return { blob, filename };
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    return res.ok;
  } catch {
    return false;
  }
}
