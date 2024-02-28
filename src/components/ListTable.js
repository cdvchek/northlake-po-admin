import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import './ListTable.css';
import Tooltip from './Tooltip';

function ListTable({ items, itemsConfig, itemclick }) {
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortField, setSortField] = useState(itemsConfig[0].key);
    const [currentItems, setCurrentItems] = useState([]);
    const [sortedItems, setSortedItems] = useState([]);

    const [popupContent, setPopupContent] = useState(null); // Removed showPopup state

    const [attributeEditting, setAttributeEditting] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipText, setTooltipText] = useState('');

    const handleMouseEnter = (text) => (event) => {
        setTooltipPosition({ x: event.clientX, y: event.clientY });
        setTooltipText(text);
        setShowTooltip(true);
    }

    const handleMouseLeave = () => {
        setShowTooltip(false);
    }

    useEffect(() => {
        const sorted = getSortedItems();
        setSortedItems(sorted);
    }, [items, sortField, sortOrder]);

    const handleSort = (field) => {
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const getSortedItems = () => {
        return [...items].sort((a, b) => {
            let valueA = a[sortField], valueB = b[sortField];
            return (typeof valueA === 'number' && typeof valueB === 'number') ? 
                (sortOrder === 'asc' ? valueA - valueB : valueB - valueA) :
                valueA.toString().localeCompare(valueB.toString(), undefined, {numeric: true, sensitivity: 'base'}) * (sortOrder === 'asc' ? 1 : -1);
        });
    };

    const handleShowPopup = (PopupComponent, props, event) => {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();
    
        // Estimate the size of the popup. Adjust these values based on your popup's average size.
        const estimatedPopupWidth = 375;
        const estimatedPopupHeight = 150;
    
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
    
        // Calculate initial position
        let position = { 
            top: rect.top + window.scrollY + rect.height, 
            left: rect.left + window.scrollX 
        };
    
        // Adjust position to ensure the popup fits within the viewport
        // Check if the popup goes beyond the right edge of the viewport
        if (position.left + estimatedPopupWidth > viewportWidth) {
            position.left = viewportWidth - estimatedPopupWidth;
        }
    
        // Check if the popup goes beyond the bottom edge of the viewport
        if (position.top + estimatedPopupHeight > viewportHeight) {
            position.top -= (rect.height + estimatedPopupHeight);
        }
    
        // Make sure the popup's top and left positions are not negative
        position.top = Math.max(position.top, 0);
        position.left = Math.max(position.left, 0);
    
        // Directly setting popup content
        setPopupContent(
            <PopupComponent
                {...props}
                position={position}
                setShowPopup={() => setPopupContent(null)} // Simplified to directly control visibility through content
            />
        );
    };
    

    useEffect(() => {
        if (attributeEditting) {
            const inputFocus = document.getElementById(attributeEditting);
            if (inputFocus) inputFocus.focus();
        }
    }, [attributeEditting]);

    const handleSubmit = async (e, onEdit, id) => {
        if (e.key === "Enter") {
            const status = await onEdit(id, editingValue);

            if (status) {
                // successful edit, close the input
                setAttributeEditting(null);
            } else {
                // unsuccessful edit, do nothing
            }
        } else if (e.key === "Escape") {
            // Do not edit and close out of editing
            setAttributeEditting(null);
        }
    }

    return (
        <div className='item-list'>
            <div className="item-header" style={{ display: 'flex', justifyContent: 'space-between'}}>
                {itemsConfig.map((config, index) => (
                    <div
                        key={`header-${index}`} 
                        onClick={() => handleSort(config.key)}
                        style={{ flexBasis: `${config.space}`, padding: '15px', fontWeight: 'bold', cursor: 'pointer' }}    
                    >
                        {config.header} {sortField === config.key && (sortOrder === 'asc' ? '▲' : '▼')}
                    </div>
                ))}
            </div>
            {currentItems.map((item, index) => (
                <div
                    key={index}
                    className='item'
                    style={{ display: 'flex', justifyContent: 'space-between'}}
                    onClick={itemclick ? () => itemclick(item) : undefined}
                >
                    {itemsConfig.map((config, keyIndex) => {
                        if (config.type === 'info') {
                            return (attributeEditting !== `${item.id}-${config.key}`) ? (
                                <div
                                    key={`${index}-${config.key}-${keyIndex}`}
                                    onDoubleClick={config.onEdit ? () => setAttributeEditting(`${item.id}-${config.key}`) : undefined}
                                    onClick={config.popup ? (e) => handleShowPopup(config.popup, {...config.popupProps, item}, e) : undefined}
                                    style={{ flexBasis: `${config.space}`, padding: '15ps' }}
                                >
                                {item[config.key]}
                            </div>
                        )
                        :
                        (
                            <input
                                key={`${index}-${config.key}-${keyIndex}`}
                                id={`${item.id}-${config.key}`}
                                className='editable'
                                type='text'
                                placeholder={item[config.key]}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => handleSubmit(e, config.onEdit, item.id)}
                                style={{ flexBasis: `${config.space}`, padding: '15ps' }}
                            />
                            )
                        } else if (config.type === 'button') {
                            return (
                                <div
                                    key={`${index}-${config.key}-${keyIndex}`}
                                    onClick={config.popup ? (e) => handleShowPopup(config.popup, {...config.popupProps, item}, e) : undefined}
                                    style={{ flexBasis: `${config.space}`, padding: '15ps', cursor: 'pointer' }}
                                    onMouseEnter={handleMouseEnter(config.onHover)}
                                    onMouseMove={handleMouseEnter(config.onHover)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {config.staticName ? config.name : item[config.key]}
                                </div>
                            )
                        }
                    })}
                </div>
            ))}
            {showTooltip && <Tooltip text={tooltipText} position={tooltipPosition} />}
            <Pagination items={sortedItems} setCurrentItems={setCurrentItems} />
            {popupContent}
        </div>
    );
}

export default ListTable;