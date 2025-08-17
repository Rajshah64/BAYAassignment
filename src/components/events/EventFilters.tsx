// "use client";

// import { FilterOptions } from "@/lib/types/neo";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { AlertTriangle, Calendar, Ruler } from "lucide-react";
// // Import the proper DateRangePicker from the library
// import { DateRangePicker } from "@/components/ui/date-range-picker";

// interface EventFiltersProps {
//   filters: FilterOptions;
//   onFiltersChange: (filters: Partial<FilterOptions>) => void;
// }

// export default function EventFilters({
//   filters,
//   onFiltersChange,
// }: EventFiltersProps) {
//   const handleDateRangeUpdate = ({
//     range,
//   }: {
//     range: { from: Date; to?: Date };
//   }) => {
//     const startDate = range.from ? range.from.toISOString().split("T")[0] : "";
//     const endDate = range.to ? range.to.toISOString().split("T")[0] : "";

//     onFiltersChange({
//       startDate,
//       endDate,
//     });
//   };

//   // Convert filter strings back to Date objects for the component
//   const initialDateFrom = filters.startDate
//     ? new Date(filters.startDate)
//     : undefined;
//   const initialDateTo = filters.endDate ? new Date(filters.endDate) : undefined;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-lg">Filters</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Date Range */}
//         <div className="space-y-3">
//           <Label className="flex items-center gap-2">
//             <Calendar className="h-4 w-4" />
//             Date Range
//           </Label>
//           <DateRangePicker
//             onUpdate={handleDateRangeUpdate}
//             initialDateFrom={initialDateFrom}
//             initialDateTo={initialDateTo}
//             align="start"
//             locale="en-US"
//             showCompare={false}
//           />
//         </div>

//         {/* Hazardous Filter */}
//         <div className="space-y-3">
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="hazardous-only"
//               checked={filters.showHazardousOnly}
//               onCheckedChange={(checked) =>
//                 onFiltersChange({ showHazardousOnly: checked })
//               }
//             />
//             <Label htmlFor="hazardous-only" className="flex items-center gap-2">
//               <AlertTriangle className="h-4 w-4" />
//               Show Hazardous Only
//             </Label>
//           </div>
//         </div>

//         {/* Sort Options */}
//         <div className="space-y-3">
//           <Label className="flex items-center gap-2">
//             <Ruler className="h-4 w-4" />
//             Sort By
//           </Label>
//           <Select
//             value={filters.sortBy}
//             onValueChange={(value: "date" | "size" | "distance") =>
//               onFiltersChange({ sortBy: value })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="date">Approach Date</SelectItem>
//               <SelectItem value="size">Size</SelectItem>
//               <SelectItem value="distance">Distance</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-3">
//           <Label className="flex items-center gap-2">
//             <Calendar className="h-4 w-4" />
//             Sort Order
//           </Label>
//           <Select
//             value={filters.sortOrder}
//             onValueChange={(value: "asc" | "desc") =>
//               onFiltersChange({ sortOrder: value })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="asc">Ascending</SelectItem>
//               <SelectItem value="desc">Descending</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { FilterOptions } from "@/lib/types/neo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Calendar, Ruler } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface EventFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
}

// Helper function to format Date to YYYY-MM-DD string safely
const formatDateForFilter = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to parse filter date string to Date object
const parseFilterDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;

  try {
    // Parse YYYY-MM-DD format
    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return undefined;

    // Create date in local timezone
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return undefined;
  }
};

export default function EventFilters({
  filters,
  onFiltersChange,
}: EventFiltersProps) {
  // Handle date range updates from the DateRangePicker
  const handleDateRangeUpdate = ({
    range,
  }: {
    range: { from: Date; to?: Date };
    rangeCompare?: { from: Date; to?: Date };
  }) => {
    console.log("DateRangePicker update received:", range); // Debug log

    const startDate = range.from ? formatDateForFilter(range.from) : "";
    const endDate = range.to ? formatDateForFilter(range.to) : "";

    console.log("Formatted dates for filters:", { startDate, endDate }); // Debug log

    onFiltersChange({
      startDate,
      endDate,
    });
  };

  // Convert filter strings to Date objects for the DateRangePicker
  const initialDateFrom = parseFilterDate(filters.startDate);
  const initialDateTo = parseFilterDate(filters.endDate);

  console.log("Current filters:", filters); // Debug log
  console.log("Parsed dates for DateRangePicker:", {
    initialDateFrom,
    initialDateTo,
  }); // Debug log

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Label>
          <DateRangePicker
            onUpdate={handleDateRangeUpdate}
            initialDateFrom={initialDateFrom}
            initialDateTo={initialDateTo}
            align="start"
            locale="en-US"
            showCompare={false}
          />
          {/* Debug display - remove this once working */}
          {/* <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Debug: Start: {filters.startDate || "none"} | End:{" "}
            {filters.endDate || "none"}
          </div> */}
        </div>

        {/* Hazardous Filter */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="hazardous-only"
              checked={filters.showHazardousOnly}
              onCheckedChange={(checked) =>
                onFiltersChange({ showHazardousOnly: checked })
              }
            />
            <Label htmlFor="hazardous-only" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Show Hazardous Only
            </Label>
          </div>
        </div>

        {/* Sort Options */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Sort By
          </Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: "date" | "size" | "distance") =>
              onFiltersChange({ sortBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Approach Date</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sort Order
          </Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value: "asc" | "desc") =>
              onFiltersChange({ sortOrder: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
