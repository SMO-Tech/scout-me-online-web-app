/**
 * Upload image to S3 via backend API
 * This function uploads an image file and returns the S3 URL
 * 
 * TODO: Update the endpoint URL to match your actual S3 upload API endpoint
 * Expected response format: { status: 'success', data: { url: 'https://...' } }
 * or { url: 'https://...' } or { imageUrl: 'https://...' }
 */
export const uploadImageToS3 = async (file: File, token: string): Promise<string> => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseURL) {
    throw new Error('Base URL is not configured');
  }
  
  const formData = new FormData();
  formData.append('image', file);
  // You may need to adjust the field name based on your API (e.g., 'file', 'photo', 'avatar')
  
  const response = await fetch(`${baseURL}/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type header - let browser set it with boundary for FormData
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to upload image: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Return the S3 URL from the response
  // Adjust this based on your API response structure
  if (data.status === 'success' && data.data?.url) {
    return data.data.url;
  }
  if (data.url) {
    return data.url;
  }
  if (data.data?.imageUrl) {
    return data.data.imageUrl;
  }
  if (data.imageUrl) {
    return data.imageUrl;
  }
  
  throw new Error('Invalid response format from upload endpoint');
};

