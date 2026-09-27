import os

file_path = 'src/components/voters/VoterTable.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

hide_meta = ',\n      meta: { className: "hidden md:table-cell" }'
hide_lg_meta = ',\n      meta: { className: "hidden lg:table-cell" }'

content = content.replace(
    '''      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Age <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),''',
    '''      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Age <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )''' + hide_meta
)

content = content.replace(
    '''      accessorKey: "gender",
      header: "Gender",''',
    '''      accessorKey: "gender",
      header: "Gender"''' + hide_meta
)

content = content.replace(
    '''      accessorKey: "party",
      header: "Party",''',
    '''      accessorKey: "party",
      header: "Party"''' + hide_meta
)

content = content.replace(
    '''      accessorKey: "contactVolunteer",
      header: "Contact Volunteer",''',
    '''      accessorKey: "contactVolunteer",
      header: "Contact Volunteer"''' + hide_lg_meta
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("VoterTable columns updated.")
