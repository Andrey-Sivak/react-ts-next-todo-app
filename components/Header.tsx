'use client';

// import {useEffect, useState} from "react";
import Image from "next/image";
import logo from "@/public/logo.svg";
import avatar from "@/public/user-profile.jpg";
import {MagnifyingGlassIcon, UserCircleIcon} from "@heroicons/react/24/solid";
import {useBoardStore} from "@/store/BoardStore";
// import fetchSuggestion from "@/lib/fetchSuggestion";

const Header = () => {
    const [board, searchString, setSearchString] = useBoardStore(state =>
        [state.board, state.searchString, state.setSearchString]
    );

    // const [loading, setLoading] = useState<boolean>(false);
    // const [suggestion, setSuggestion] = useState<string>('');

    // useEffect(() => {
    //     if (board.columns.size === 0) return;
    //
    //     setLoading(true);
    //
    //     const fetchSuggestionFunc = async () => {
    //         const suggestion = await fetchSuggestion(board);
    //         setSuggestion(suggestion);
    //         setLoading(false);
    //     }
    //
    //     fetchSuggestionFunc();
    // }, [board]);

    return (
        <header>
            <div className="flex flex-col md:flex-row items-center justify-between p-5 bg-gray-500/10 rounded-b-2xl">

                <div
                    className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055d1] rounded-md filter blur-3xl opacity-50 -z-10"/>

                <Image
                    src={logo}
                    width={111.43}
                    height={37.5}
                    alt="logo"
                    className="pb-10 md:pb-0 object-contain"
                />

                <div className="flex items-center space-x-5">
                    <form
                        className="flex items-center space-x-5 rounded-md p-2 shadow-md flex-1 md:flex-initial bg-white">
                        <MagnifyingGlassIcon className="w-6 h-6 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 outline-none"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                        <button hidden type="submit">
                            Search
                        </button>
                    </form>

                    <Image
                        src={avatar}
                        width={40}
                        height={40}
                        alt="logo"
                        className="rounded-full"
                    />
                </div>
            </div>

            <div className="flex items-center justify-center px-5 py-2 md:py-5">
                <p className="flex items-center text-sm font-light p-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-blue-600">
                    <UserCircleIcon
                        className="inline-block h-10 w-10 text-blue-600 mr-1 grow-0 shrink-0"
                    />
                    {/*{
                        suggestion && !loading ?
                            suggestion :
                            'GPT is summarising your tasks for the day...'
                    }*/}
                    Welcome to the TODO App
                </p>
            </div>
        </header>
    )
}

export default Header;