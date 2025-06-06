import { createContext, useContext } from "react";
import React from 'react'

const GlobalContext = createContext()

export const ContextProvider = ({ children }) => {
    const [query, setQuery] = React.useState('')
    const [searchUsers, setSearchUsers] = React.useState([])
    const [searchCommunities, setSearchCommunities] = React.useState([])

    return(
        <GlobalContext.Provider
            value={{ query, setQuery, searchCommunities, searchUsers, setSearchCommunities, setSearchUsers }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = ()=> useContext(GlobalContext)