import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// High-level wrapper for handling the upload safely
export async function uploadMediaAsset(file: File, title: string, category: string) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    // 1. Upload to the exact case-sensitive storage bucket
    const { error: storageError, data } = await supabase.storage
      .from('Groove-media')
      .upload(filePath, file);

    if (storageError) throw storageError;

    // 2. Get the public URL path
    const { data: urlData } = supabase.storage
      .from('Groove-media')
      .getPublicUrl(filePath);

    // 3. Insert metadata record straight into your database table
    const { error: dbError } = await supabase
      .from('media_items')
      .insert([
        {
          title: title,
          category: category,
          url: urlData.publicUrl,
          created_at: new Date().toISOString(),
        }
      ]);

    if (dbError) throw dbError;
    return { success: true };

  } catch (error: any) {
    console.error("Operation failed:", error.message);
    return { success: false, error: error.message };
  }
}
