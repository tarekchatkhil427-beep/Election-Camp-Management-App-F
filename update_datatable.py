import os

file_path = 'src/components/ui/data-table.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make DataTable headers support responsive hiding
content = content.replace(
    '<th key={header.id} className="px-4 py-3 font-semibold align-middle whitespace-nowrap">',
    '<th key={header.id} className={`px-4 py-3 font-semibold align-middle whitespace-nowrap ${(header.column.columnDef.meta as any)?.className || ""}`}>'
)

# Make DataTable cells support responsive hiding
content = content.replace(
    '<td key={cell.id} className="px-4 py-3 align-middle">',
    '<td key={cell.id} className={`px-4 py-3 align-middle ${(cell.column.columnDef.meta as any)?.className || ""}`}>'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("DataTable.tsx updated to support meta.className")
