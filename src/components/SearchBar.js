import React, { useState, useEffect } from 'react';

function SearchBar({setFilteredItems, items, itemsToSearch}) {

    const [search, setSearch] = useState("");

    useEffect(() => {
        const filteredItems = items.filter(item => {
            return Object.values(item).some(value => {
                return value.toString().toLowerCase().includes(search.toLowerCase());
            });
        });

        setFilteredItems(filteredItems);
    }, [search, items]);

    return (
        <div className='search-container'>
            <input
                type='text'
                placeholder={`Search ${itemsToSearch}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}

export default SearchBar;