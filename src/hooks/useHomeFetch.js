import { useState, useEffect} from "react";
//API
import API from '../API'
//helpers
import { isPersistedState } from "../helpers";
const initialState = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
}

//custom hook func
export const useHomeFetch = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [state, setState] = useState(initialState)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const fetchMovies = async (page, searchTerm = "") => {
        try {
            setError(false);
            setLoading(true);

            const movies = await API.fetchMovies(searchTerm, page);

            //return obj 
            setState(prev => ({ //advantage of using a callback here is to ensure the previous state is accurate.
                ...movies,
                results:
                    page > 1 ? [...prev.results, ...movies.results] : [...movies.results]//pend movies to new array
            }))
        } catch (error) {
            setError(true);
        }
        setLoading(false);
    }
    //initial and search
    useEffect(() => {
        if (!searchTerm) {
            const sessionState = isPersistedState('homeState');
            if (sessionState) {
                console.log("grabbing from sessionStorage")
                setState(sessionState);
                return;
            }
        }
        console.log("grabbing from api")
        setState(initialState); //because I want to reset the state whenever i search again
        fetchMovies(1, searchTerm);
    }, [searchTerm]); //depedency array
    //return state here

    //Load more
    useEffect(() => {
        if (!isLoadingMore) return;

        fetchMovies(state.page + 1, searchTerm);
        setIsLoadingMore(false);
    }, [isLoadingMore, searchTerm, state.page])

    //Write to sessionStorage

    useEffect(() => {
        if(!searchTerm) sessionStorage.setItem('homeState', JSON.stringify(state)) //can only write string in session storage
    }, [searchTerm, state])
    return { state, loading, error, searchTerm, setSearchTerm, setIsLoadingMore };
}