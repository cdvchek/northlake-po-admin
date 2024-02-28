import React, { useState, useEffect } from 'react';
import './Pagination.css'

function Pagination({ items, setCurrentItems }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setTotalPages(Math.ceil(items.length / ITEMS_PER_PAGE));
        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
        setCurrentItems(items.slice(indexOfFirstItem, indexOfLastItem));
    }, [items, currentPage, setCurrentItems]);    
    

    return (
        <div className="pagination">
            <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>Previous</button>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    disabled={currentPage === index + 1}
                >
                    {index + 1}
                </button>
            ))}
            <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
    );
}

export default Pagination;