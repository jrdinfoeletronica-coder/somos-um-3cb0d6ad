import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = "https://ibickxigovgcwwsqfpeb.supabase.co";
const FALLBACK_ANON_KEY = "sb_publishable_ujOgrDJiP7ITpMRtfYRfuw_WagffxIl";

const supabase = createClient(FALLBACK_URL, FALLBACK_ANON_KEY);

async function check() {
  // Get a valid song id
  const { data: songs } = await supabase.from('songs').select('id').limit(1);
  if (!songs || songs.length === 0) return console.log("No songs available");
  
  const songId = songs[0].id;
  
  const { data: insertData, error: insertError } = await supabase.from('schedule_songs').insert([{
    schedule_id: "b54f0b5e-ee59-4992-a5b4-eee6c6bde80f", // Culto de Quarta
    song_id: songId
  }]).select();
  
  console.log("INSERT RESULT:", insertData);
  console.log("INSERT ERROR:", insertError);
}

check();
