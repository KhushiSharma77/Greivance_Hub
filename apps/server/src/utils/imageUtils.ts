import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
// import { ApiError } from "./apiError";

type MulterFile = Express.Multer.File;

function extractFilePathAndNameFromUrl(fileUrl: string): {
  filePath: string;
  fileName: string;
} {
  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/"); // ['', 'storage', 'v1', 'object', 'public', 'images', ...filePathParts]
    const filePath = pathParts.slice(6).join("/"); // 'images/...'
    if (!filePath) throw new Error("Invalid file URL");
    const fileName = filePath.split("/").pop() || "";
    return { filePath, fileName };
  } catch {
    // throw new ApiError("Invalid file URL", 400);
    throw new Error("Invalid file URL");
  }
}

export async function uploadFile(
  supabase: SupabaseClient,
  file: MulterFile,
  folder: string,
  fileUrl?: string,
): Promise<string> {
  const mime = file.mimetype;
  if (!mime) throw new Error("File type is missing");
  const allowedTypes = [
    "image/jpeg", 
    "image/png", 
    "image/gif", 
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime"
  ];
  if (!allowedTypes.includes(mime)) {
       throw new Error(
      "Invalid file type. Only images and videos (MP4, WebM, QuickTime) are allowed.");
  }
  const ext = file.originalname.split('.').pop();

  
  if (fileUrl) {
    await deleteFile(supabase,fileUrl);
  }
  const filename:string =  `${uuidv4()}.${ext}`;

  const filePath = `${folder}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from("Grievance")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) {
     throw new Error(`File upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("Grievance")
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error("Failed to get public URL");
  }

  return urlData.publicUrl;
}

export async function deleteFile(
  supabase: SupabaseClient,
  fileUrl: string,
): Promise<void> {
  const { filePath } = extractFilePathAndNameFromUrl(fileUrl);

  const { error: deleteError } = await supabase.storage
    .from("Grievance")
    .remove([filePath]);

  if (deleteError) {
    throw new Error(`File deletion failed: ${deleteError.message}`);
  }
}
