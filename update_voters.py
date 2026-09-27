import os

file_path = 'src/features/voters/VoterDatabase.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update filters to be a 3-column grid
content = content.replace(
    'toolbarFilters={\n              <>\n                <select',
    'toolbarFilters={\n              <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto">\n                <select'
)
content = content.replace(
    '                </select>\n              </>',
    '                </select>\n              </div>'
)

# 2. Add responsive classes to columns
# We want to keep Select, Name, Mobile, Actions visible on mobile.
# Ward, House, Age, Gender, Party, Contact Volunteer should be hidden on small screens.

hide_meta = ',\n      meta: { className: "hidden md:table-cell" }'
hide_lg_meta = ',\n      meta: { className: "hidden lg:table-cell" }'

# Ward
content = content.replace(
    '''      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('Ward')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),''',
    '''      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('Ward')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )''' + hide_meta
)
# House
content = content.replace(
    '''      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('House')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),''',
    '''      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('House')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )''' + hide_meta
)
# Age
content = content.replace(
    '''      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('Age')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),''',
    '''      header: ({ column }) => (
        <Button variant="ghost" className="p-0 font-semibold hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t('Age')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )''' + hide_lg_meta
)
# Gender
content = content.replace(
    '''      accessorKey: "gender",
      header: t('Gender') || "Gender",''',
    '''      accessorKey: "gender",
      header: t('Gender') || "Gender"''' + hide_lg_meta
)
# Party
content = content.replace(
    '''      accessorKey: "party",
      header: t('Party') || "Party",''',
    '''      accessorKey: "party",
      header: t('Party') || "Party"''' + hide_meta
)
# Contact Volunteer
content = content.replace(
    '''      accessorKey: "contactVolunteer",
      header: t('Contact Volunteer') || "Contact Volunteer",''',
    '''      accessorKey: "contactVolunteer",
      header: t('Contact Volunteer') || "Contact Volunteer"''' + hide_lg_meta
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("VoterDatabase columns and filters updated.")
