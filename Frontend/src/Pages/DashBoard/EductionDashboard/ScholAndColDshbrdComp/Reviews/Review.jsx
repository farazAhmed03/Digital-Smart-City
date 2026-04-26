import "./Review.css";
import "../ScholAndColDshbrdComp.css";
import { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { SendReviewTabDataToDb } from "../../../../../ApiCalls/DashBoardApiCalls";

export const ReviewForm = ({ dashboardData }) => {
    // Setting the Db Data if any, instead of default data:
    // Converting Review array stored in Db to Obj:
    const dbReviewObj = useMemo(() => {
        if (!dashboardData?.Reviews) return null;
        return {
            "firstReview": dashboardData.Reviews[0],
            "secReview": dashboardData.Reviews[1],
            "thirdReview": dashboardData.Reviews[2],
            "fourthReview": dashboardData.Reviews[3]
        };
    }, []);

    let [reviews, setReviews] = useState(dbReviewObj || {
        firstReview: "",
        secReview: "",
        thirdReview: "",
        fourthReview: ""
    });

    // Tracking changes
    const [ReviewSecChanged, setReviewSecChanged] = useState(false);

    // Handling data entry
    const hndleReviewChng = (e) => {
        let { name, value } = e.target;
        setReviews({ ...reviews, [name]: value });
        setReviewSecChanged(true);
    }

    // %%%%%% Form Submission %%%%%%%
    const FinalFun = (e) => {
        e.preventDefault();
        let parentReviews = [];
        for (const key in reviews) {
            parentReviews.push(reviews[key]);
        }
        SendReviewTabDataToDb(parentReviews, setReviewSecChanged);
    }

    return (
        <section className="form-area">
            {/* To show notification */}
            <ToastContainer />
            <form onSubmit={(e) => FinalFun(e)}>
                <h2>Reviews</h2>
                <p className="addressingPara">Enter Top reviews about your service.</p>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label >1st Review</label>
                        <input type="text" name="firstReview" value={reviews.firstReview} onChange={(e) => hndleReviewChng(e)} required />
                    </div>
                    <div className="form-group">
                        <label >2nd Review</label>
                        <input type="text" name="secReview" value={reviews.secReview} onChange={(e) => hndleReviewChng(e)} required />
                    </div>
                </div>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label >3rd Review</label>
                        <input type="text" name="thirdReview" value={reviews.thirdReview} onChange={(e) => hndleReviewChng(e)} required />
                    </div>
                    <div className="form-group">
                        <label >4th Review (<em>optional</em>)</label>
                        <input type="text" name="fourthReview" value={reviews.fourthReview} onChange={(e) => hndleReviewChng(e)} />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={!ReviewSecChanged} className="save-btn">Save</button>
                </div>
            </form>
        </section>
    )
}