-- Add lernziel (detailed learning goal) to palaces table
alter table palaces add column if not exists lernziel text default '';
