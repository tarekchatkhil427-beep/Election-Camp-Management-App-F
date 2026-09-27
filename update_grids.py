import os
import glob
import re

files = glob.glob('src/components/dashboard/*.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace grid-cols-3 or grid-cols-2 with grid-cols-4
    content = content.replace('grid-cols-3 sm:grid-cols-2 lg:grid-cols-4', 'grid-cols-4 sm:grid-cols-4 lg:grid-cols-4')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
        
print("Done replacing grid classes.")
