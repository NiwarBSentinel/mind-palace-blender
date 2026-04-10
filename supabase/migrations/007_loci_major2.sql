-- Add major_zahl_2 column to loci table
alter table loci add column if not exists major_zahl_2 text default '';
