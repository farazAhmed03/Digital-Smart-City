import { useEffect, useState, useMemo } from "react";
import "./SearchBar.css";

export const SearchBar = ({ SearchedInst, AllInst }) => {

    /* ===============================
       Local State
    =============================== */

    const [filteredItem, setFiltereditem] = useState(null);
    const [inputValue, setInputValue] = useState("");

    /* ⭐ Prevent undefined crash */
    const AllInstitute = useMemo(() => AllInst || [], [AllInst]);

    /* ===============================
       Past Suggestion List
    =============================== */

    const PastResArr = useMemo(() => [
        "School",
        "Sports",
        "Arts",
        "Science",
        "Event",
        "Education",
        "College"
    ], []);

    /* ===============================
       Filter Suggestions
    =============================== */

    const filterSearch = (search) => {

        if (!search) {
            setFiltereditem(null);
            return;
        }

        const result = PastResArr.filter(v =>
            v.toLowerCase().includes(search.toLowerCase())
        );

        setFiltereditem(result);
    };

    /* ===============================
       Select Search Option
    =============================== */

    const OptionSlctd = (option) => {

        if (!option) return;

        const searchText =
            typeof option === "string"
                ? option
                : option.serviceName ||
                option.name ||
                option.title ||
                "";

        setInputValue(searchText);
        setFiltereditem(null);

        const SearchedRes = AllInstitute.filter(v => {

            const itemName =
                v.serviceName ||
                v.name ||
                v.title ||
                "";

            return itemName.toLowerCase().includes(
                searchText.toLowerCase()
            );
        });

        SearchedInst(SearchedRes);
    };

    /* ===============================
       Enter Key Handler
    =============================== */

    const HandEnterKeyPress = (e) => {
        if (e.key === "Enter") {
            OptionSlctd(inputValue);
        }
    };

    /* ===============================
       Reset List When Input Empty ⭐
    =============================== */

    useEffect(() => {
        if (inputValue === "") {
            SearchedInst(AllInstitute);
        }
    }, [inputValue, AllInstitute, SearchedInst]);

    /* ===============================
       UI Render
    =============================== */

    return (
        <div className="Search-Area">

            <div className="Search-bar">

                <input
                    placeholder="Search here"
                    value={inputValue}
                    onChange={(e) => {
                        const val = e.target.value;
                        setInputValue(val);
                        filterSearch(val);
                    }}
                    onKeyDown={HandEnterKeyPress}
                    autoComplete="off"
                />

                <button
                    className="search-btn"
                    onClick={() => OptionSlctd(inputValue)}
                    type="button"
                >
                    🔍
                </button>

            </div>

            {/* Suggestions List */}

            {
                filteredItem &&
                filteredItem.length > 0 && (
                    <ul className="result-cont">

                        {filteredItem.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => OptionSlctd(item)}
                            >
                                {item}
                            </li>
                        ))}

                    </ul>
                )
            }

        </div>
    );
}; 