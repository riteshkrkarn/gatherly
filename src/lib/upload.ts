// // helpers/uploadToSupabase.ts
// import { supabase } from "@/lib/supabase";

// export async function upload(file: File): Promise<string> {
//   try {
//     const fileExtension = file.name.split(".").pop();
//     const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

//     const fileBuffer = await file.arrayBuffer();

//     const { error } = await supabase.storage
//       .from("avatar")
//       .upload(fileName, fileBuffer, {
//         contentType: file.type,
//       });

//     if (error) {
//       throw new Error(`Upload failed: ${error.message}`);
//     }

//     const { data } = supabase.storage.from("avatar").getPublicUrl(fileName);

//     return data.publicUrl;
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Upload failed";
//     throw new Error(errorMessage);
//   }
// }



// lib/upload.ts
import { supabaseAdmin } from "@/lib/supabase";

export async function upload(file: File): Promise<string> {
  try {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    const fileBuffer = await file.arrayBuffer();

    // Use supabaseAdmin instead of supabase
    const { error } = await supabaseAdmin.storage
      .from("avatar")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL using admin client
    const { data } = supabaseAdmin.storage.from("avatar").getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload function error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";
    throw new Error(errorMessage);
  }
}