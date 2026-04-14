-- Add lernziel (detailed learning goal) to palaces and loci tables
alter table palaces add column if not exists lernziel text default '';
alter table loci add column if not exists lernziel text default '';
alter table loci add column if not exists lernziel_bilder jsonb default '[]';
