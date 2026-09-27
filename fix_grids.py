import re
import os

file_path = 'src/features/organization/OrgFolderExplorer.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Ward Grid (currently grid-cols-1)
content = re.sub(
    r'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"',
    r'className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6"',
    content
)

# Replace House Grid (currently grid-cols-3)
content = re.sub(
    r'className="grid grid-cols-[1-4] sm:grid-cols-[1-4] lg:grid-cols-[1-4] gap-[^"]+"',
    r'className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6"',
    content,
    count=2
)

# Fix any stray House grids that had animate-in
content = re.sub(
    r'className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 animate-in fade-in zoom-in-95 duration-200"',
    r'className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 animate-in fade-in zoom-in-95 duration-200"',
    content
)

# Let's make the Ward card styling a bit more compact for 2-in-a-row
# Padding: p-3 sm:p-6 -> p-2 sm:p-4
content = content.replace('p-3 sm:p-6 flex flex-col', 'p-2 sm:p-4 flex flex-col')
content = content.replace('p-6 flex flex-col', 'p-2 sm:p-4 flex flex-col')
# Icon sizes for Wards
content = content.replace('h-10 w-10 rounded-full', 'h-7 w-7 sm:h-10 sm:w-10 rounded-full shrink-0')
content = content.replace('h-5 w-5', 'h-4 w-4 sm:h-5 sm:w-5')
# Font sizes
content = content.replace('font-bold text-lg text-foreground', 'font-bold text-[11px] sm:text-lg text-foreground truncate')
content = content.replace('text-sm text-muted-foreground font-medium', 'text-[10px] sm:text-sm text-muted-foreground font-medium truncate')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Grids successfully updated to 2-columns.")
