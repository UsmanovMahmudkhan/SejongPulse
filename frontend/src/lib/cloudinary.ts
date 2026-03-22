// src/lib/cloudinary.ts
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "";

export async function uploadImage(file: File): Promise<string | null> {
  try {
    // 1. Get signature from our secure backend
    const signRes = await fetch("http://localhost:8000/api/upload/sign");
    if (!signRes.ok) throw new Error("Failed to get upload signature");
    
    const { signature, timestamp, folder, api_key } = await signRes.json();
    
    // 2. Upload directly to Cloudinary using the signature
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await uploadRes.json();
    if (data.secure_url) {
      return data.secure_url;
    }
    return null;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
}
