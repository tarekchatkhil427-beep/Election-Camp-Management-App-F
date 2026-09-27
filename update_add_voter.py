import os

file_path = 'src/features/organization/OrgFolderExplorer.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make AddVoterModal always visible for the House voter table
old_str = "{mode === 'view' && <AddVoterModal wardId={activeHouse.wardId} houseId={activeHouse.id} />}"
new_str = "<AddVoterModal wardId={activeHouse.wardId} houseId={activeHouse.id} />"

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("OrgFolderExplorer updated: AddVoterModal is now always visible.")
else:
    print("Could not find the target string in OrgFolderExplorer.")
