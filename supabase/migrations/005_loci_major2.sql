-- Add second major number field to loci
alter table loci add column if not exists major_zahl_2 text default '';
