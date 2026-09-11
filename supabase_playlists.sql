-- Criação da tabela de playlists
CREATE TABLE IF NOT EXISTS public.playlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criação da tabela de relacionamento entre playlists e músicas (songs)
CREATE TABLE IF NOT EXISTS public.playlist_songs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id uuid REFERENCES public.playlists(id) ON DELETE CASCADE,
  song_id uuid REFERENCES public.songs(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(playlist_id, song_id)
);

-- Habilitar RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "public_read_playlists" ON public.playlists FOR SELECT USING (true);
CREATE POLICY "public_insert_playlists" ON public.playlists FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_playlists" ON public.playlists FOR UPDATE USING (true);
CREATE POLICY "public_delete_playlists" ON public.playlists FOR DELETE USING (true);

CREATE POLICY "public_read_playlist_songs" ON public.playlist_songs FOR SELECT USING (true);
CREATE POLICY "public_insert_playlist_songs" ON public.playlist_songs FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_playlist_songs" ON public.playlist_songs FOR UPDATE USING (true);
CREATE POLICY "public_delete_playlist_songs" ON public.playlist_songs FOR DELETE USING (true);
