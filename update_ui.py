import os
import glob

# 1. Update Grid Layouts in all Dashboard files
files = glob.glob('src/components/dashboard/*Dashboard.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Safely replace grid-cols-4 with grid-cols-2 for mobile
    content = content.replace('grid-cols-4 sm:grid-cols-4 lg:grid-cols-4', 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# 2. Make StatCard thinner
stat_card = 'src/components/dashboard/StatCard.tsx'
with open(stat_card, 'r', encoding='utf-8') as file:
    content = file.read()

# Reduce padding to make them "thinner"
content = content.replace('p-3 sm:p-5', 'p-2 sm:p-4 py-1.5 sm:py-3')
# Reduce margin top of description
content = content.replace('mt-2 sm:mt-4', 'mt-1 sm:mt-3')

with open(stat_card, 'w', encoding='utf-8') as file:
    file.write(content)

print("Update complete!")
