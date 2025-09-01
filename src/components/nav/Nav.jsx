import React from 'react'
import { TextLoopBasic } from './TextLoopBasic'
import StoreMenubar from './StoreMenubar'
import ActionSearchBar from './ActionSearchBar'
import AccountMenu from './AccountMenu'
import NavbarComp from './NavbarComp'

export const Nav = () => {
    return (
        <div className='flex flex-col justify-center gap-1.5 px-6 py-4 border-b bg-white dark:bg-transparent'>
            <div className='hidden sm:flex justify-between items-center'>
                <StoreMenubar />
                <TextLoopBasic />
                <div className='flex items-end text-sm'>
                    <p>Need help? Call Us:</p>
                    <span className='text-green-900 font-bold'>+2348075029003</span>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <h1><a href="/" className="hidden sm:block shrink-0 text-2xl font-bold text-primary-700 dark:text-white">
                    TIC
                </a></h1>
                <ActionSearchBar />
                < AccountMenu />
            </div>
            <NavbarComp />
        </div>
    )
}

