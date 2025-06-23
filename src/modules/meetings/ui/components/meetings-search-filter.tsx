import { Input } from "@/components/ui/input";

import { SearchIcon } from "lucide-react";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsSearchFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();

    return (
        <div className="relative">
            <Input placeholder="Filterby Name"
            className= "h-9 bg-white w-[200px] pl-7"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            />
            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground "  />
        </div>
    )
}