import "./FoodCatagories.css";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalFoodList, LocalFoodCardsData, Food_Details } from "../../../Store/Food_store";
import { FoodLandingPage } from "../FoodLanding/FoodLandingPage";
import { getMergedData, getFullMergedData } from "../../../utils/dataMerger";
import { FaFilter, FaSortAmountDown, FaStar, FaBicycle } from "react-icons/fa";
import { GetFoodCrdsDtaFrmDB } from "../../../ApiCalls/ApiCalls";

export const LocalFoodPage = () => {
    useEffect(() => { window.scrollTo(0, 0) }, []);

    const [allCrds, setAllCrds] = useState(LocalFoodCardsData);
    const [Crds, setCrds] = useState(LocalFoodCardsData);
    const [showList, setShowlist] = useState(false);
    const [sortBy, setSortBy] = useState("rating");
    const [filterPrice, setFilterPrice] = useState("all");
    const [filterDelivery, setFilterDelivery] = useState(false);

    const navigate = useNavigate();
    const { search } = useLocation();
    const id = new URLSearchParams(search).get("id");

    const [listData, setListData] = useState([]);

    useEffect(() => {
        const staticList = LocalFoodList.map(item => ({ name: item.name, id: item.id }));
        setListData(staticList);

        GetFoodCrdsDtaFrmDB((dbData) => {
            if (!dbData || !Array.isArray(dbData)) return;
            const filteredDb = dbData.filter(item => item.serviceType === "Local Food");
            const merged = [...LocalFoodCardsData, ...filteredDb];
            setAllCrds(merged);
            setCrds(merged);

            const staticList = LocalFoodList.map(item => ({ name: item.name, id: item.id }));
            const dynamicList = filteredDb.map(item => ({ name: item.InstName, id: item.id }));
            setListData([...staticList, ...dynamicList]);
        });
    }, []);

    useEffect(() => {
        if (!allCrds || allCrds.length === 0) return;
        let results = [...allCrds];
        if (filterPrice !== "all") results = results.filter(item => item.priceRange === filterPrice);
        if (filterDelivery) results = results.filter(item => item.deliveryAvailable === true);
        results.sort((a, b) => {
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "priceLow") return a.price - b.price;
            if (sortBy === "priceHigh") return b.price - a.price;
            return 0;
        });
        setCrds(results);
    }, [filterPrice, filterDelivery, sortBy, allCrds]);

    return (
        <>
            {(id) ? <FoodLandingPage id={id} Alldata={getFullMergedData(Food_Details, "Food")} /> :
                <section className="food-cata-pg-sec">
                    <div className={(showList) ? "food-lft-sec food-showList" : "food-lft-sec"} >
                        <h2 className="food-sector-label" onClick={() => { navigate(`/food`) }}>Food Section</h2>
                        <div className="institute-hd-lst">
                            <h2 className="food-institute-hd">Local Cuisine</h2>
                            <ul className="food-institute-lst">
                                {listData.map((v, i) => (<li onClick={() => { navigate(`?id=${v.id}`); setShowlist(false) }} key={i}>{v.name}</li>))}
                            </ul>
                        </div>
                        <div className="filter-sidebar-content">
                            <h3 className="filter-hd"><FaFilter /> Filters</h3>
                            <div className="filter-group"><label>Price Range</label>
                                <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
                                    <option value="all">All Prices</option>
                                    <option value="$">$ (Budget)</option>
                                    <option value="$$">$$ (Moderate)</option>
                                </select>
                            </div>
                            <div className="filter-group-check">
                                <input type="checkbox" id="deliveryCheck" checked={filterDelivery} onChange={(e) => setFilterDelivery(e.target.checked)} />
                                <label htmlFor="deliveryCheck"><FaBicycle /> Delivery Available</label>
                            </div>
                            <h3 className="filter-hd"><FaSortAmountDown /> Sort By</h3>
                            <div className="filter-group">
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="rating">Top Rated</option>
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="food-main-sec">
                        <div className="food-showLstBtn" onClick={() => { setShowlist(!showList) }}>{(showList) ? <>&times;</> : <>&#9776;</>}</div>
                        <div className="food-cata-banner">
                            <h1 className="fd-cata-pg-main-hd">Traditional Flavors of Kohat</h1>
                            <p>Discover the authentic taste of Kohat with our curated list of local favorites, from Chapli Kebabs to traditional Pulao.</p>
                            <div className="food-search-wrapper"><SearchBar SearchedInst={setCrds} AllInst={allCrds} /></div>
                        </div>
                        <div className="food-card-cont">
                            {Crds.length > 0 ? Crds.map((v, i) => (
                                <div className="food-pg-card" key={i} onClick={() => { navigate(`?id=${v.id}`) }}>
                                    <div className="card-img-wrapper">
                                        <img src={v.img} alt={v.InstName} />
                                        <div className="card-badges">
                                            {v.deliveryAvailable && <span className="delivery-badge"><FaBicycle /> Delivery</span>}
                                            {v.rating > 0 && <span className="rating-badge"><FaStar /> {v.rating}</span>}
                                        </div>
                                    </div>
                                    <div className="food-pg-card-content">
                                        <div className="card-top-info"><h3>{v.InstName}</h3><span className="price-label">{v.priceRange}</span></div>
                                        <p className="cuisine-label">{v.cuisine}</p><p className="card-desc">{v.Desc}</p>
                                        <div className="food-card-actions">
                                            <button className="food-pg-card-btn order-btn" onClick={(e) => { e.stopPropagation(); navigate(`?id=${v.id}#order-section`) }}>Order Now</button>
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="no-results"><h3>No local cuisine found matching your criteria.</h3><button onClick={() => { setFilterPrice("all"); setFilterDelivery(false); }}>Reset Filters</button></div>}
                        </div>
                    </div>
                </section>
            }
        </>
    )
}
