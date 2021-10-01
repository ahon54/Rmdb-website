import React, { useState, useEffect, useRef } from "react";

import searchIcon from '../../images/search-icon.svg';
import { Wrapper, Content } from './SearchBar.styles';

const SearchBar = ({ setSearchTerm }) => {
    const [state, setState] = useState('');
    const initial = useRef(true);

    //useEffect always trigger on the initial render.
    //only want to trigger when user types something
    useEffect(() => {
        if (initial.current) {
            initial.current = false;
            return; //skip initial re-render on useEffect
        }
        const timer = setTimeout(() => {
            setSearchTerm(state);
        }, 500)

        return () => clearTimeout(timer) //clear timer to prevent multiple timers
    },[setSearchTerm, state])
    return (
        <Wrapper>
            <Content>
                <img src={searchIcon} alt='search-icon' />
                <input
                    type='text'
                    placeholder='Search Movie'
                    onChange={event => setState(event.currentTarget.value)}
                    value={state}
                />
            </Content>
        </Wrapper>
    )
}

export default SearchBar;