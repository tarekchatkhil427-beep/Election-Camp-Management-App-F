import re

file_path = 'src/features/voters/VoterDatabase.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract from toolbarFilters={ to toolbarActions={
start_idx = content.find('toolbarFilters={')
end_idx = content.find('toolbarActions={')

if start_idx != -1 and end_idx != -1:
    new_filters = """toolbarFilters={
              <div className="flex flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="grid grid-cols-3 gap-2 w-full">
                  <select value={wardFilter} onChange={e => { setWardFilter(e.target.value); setHouseFilter(''); }} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">Ward</option>
                    {wards.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  <select value={houseFilter} onChange={e => setHouseFilter(e.target.value)} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">House</option>
                    {houses.filter(h => !wardFilter || h.wardId === wardFilter).map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                  <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 w-full">
                  <select value={partyFilter} onChange={e => setPartyFilter(e.target.value)} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">Party</option>
                    <option value="support">Support</option>
                    <option value="neutral">Neutral</option>
                    <option value="oppose">Oppose</option>
                  </select>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-8 rounded-lg border border-border bg-muted/50 px-2 text-[11px] sm:text-xs font-medium focus:ring-1 focus:ring-primary truncate">
                    <option value="">Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3 mr-1" /> Reset
                    </Button>
                  )}
                </div>
              </div>
            }
            """
    content = content[:start_idx] + new_filters + content[end_idx:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Filters layout updated.")
else:
    print("Could not find toolbarFilters block.")
