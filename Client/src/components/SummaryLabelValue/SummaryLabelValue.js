import React from 'react';

export default function SummaryLabelValue({ label, value, width }) {
    return (
        <div className="flex flex-row">
            <span className={`${width} mb-2 text-sm font-medium text-gray-900 dark:text-gray-300`}>
                {label}</span>
            <span>:</span>
            <span>{value}</span>
        </div>
    )
}