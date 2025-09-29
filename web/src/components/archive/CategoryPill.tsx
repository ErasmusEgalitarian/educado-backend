import React from 'react'

import { XMarkIcon } from "@heroicons/react/24/outline"

export const CategoryPill = ({ category }: { category: string }) => {
    return (
        <span className="px-3 py-1 flex items-center text-lg rounded-full bg-blue-500 hover:bg-blue-700 text-white shadow cursor-pointer">
            <span>{category}</span>
            <button className="bg-transparent">
                <XMarkIcon className='w-3 h-3 ml-2' />
            </button>
        </span>
    )
}
