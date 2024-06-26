import React from 'react';

interface FilterSelectProps {
    filter: string;
    onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
   filter,
   onFilterChange
}) => (
    <div className="flex items-center">
        <label className="text-gray-600 mr-3">Filter by:</label>
        <select
            value={filter}
            onChange={onFilterChange}
            className="bg-gray-200 border border-gray-300 text-gray-700 py-2 px-4 rounded mr-2"
        >
            <option value="all">All</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
        </select>
    </div>
);

export default FilterSelect;
