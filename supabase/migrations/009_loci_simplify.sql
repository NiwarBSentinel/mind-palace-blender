-- Simplify loci: add lerninhalt (was will ich lernen) and vorstellung (wie stelle ich mir das vor)
-- Old columns (person, action, object, major_zahl, major_zahl_2, notiz) remain in the table for safety.

alter table loci add column if not exists lerninhalt text default '';
alter table loci add column if not exists vorstellung text default '';

-- Populate vorstellung from existing fields so previously entered content is not lost in the UI.
-- Combines person / action / object / notiz into a single free-text block.
update loci
set vorstellung = trim(both E' \n' from concat_ws(
  E'\n',
  nullif(trim(coalesce(person, '')),   ''),
  nullif(trim(coalesce(action, '')),   ''),
  nullif(trim(coalesce(object, '')),   ''),
  nullif(trim(coalesce(notiz, '')),    '')
))
where coalesce(vorstellung, '') = ''
  and (
    coalesce(person, '') <> '' or
    coalesce(action, '') <> '' or
    coalesce(object, '') <> '' or
    coalesce(notiz, '')  <> ''
  );
