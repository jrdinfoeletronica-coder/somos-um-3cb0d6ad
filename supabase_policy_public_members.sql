-- Enable public read access to the `members` table (temporary for testing)
-- Execute this in Supabase SQL editor (or via CLI)
create policy "public_read_members"
  on public.members
  for select
  using (true);

-- If you want to restrict to authenticated users only, replace the `using` clause with:
-- using (auth.role() = 'authenticated');
