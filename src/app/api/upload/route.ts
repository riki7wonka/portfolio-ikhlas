import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // إنشاء اسم فريد للملف
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // الرفع إلى Supabase
    const { data, error } = await supabase.storage
      .from('ikhlas')
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // جلب الرابط العام للصورة
    const { data: publicUrlData } = supabase.storage
      .from('ikhlas')
      .getPublicUrl(uniqueFilename);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Error uploading:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
