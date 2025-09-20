#!/bin/bash
bibtex-tidy --numeric --align=13 --duplicates=key --no-escape --sort-fields=title,author,abstract,journal,booktitle,eprint,archiveprefix,primaryclass,editor,volume,number,pages,month,year,doi,isbn,publisher,address,pdf,code,talk,video,blog,projects,note,nominated,abbr,preview,selected --no-remove-dupe-fields YOUR_FILE.bib
