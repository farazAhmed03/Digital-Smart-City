import "./Events.css";
import "../ScholAndColDshbrdComp.css";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import { AddNewEvent, deleteTheEvent, UpdateExtraActivities } from "../../../../../ApiCalls/DashBoardApiCalls";
const extraActivities = [
    "Debate",
    "Sports",
    "Science",
    "Arts",
    "Environment",
    "Photography",
    "Coding",
    "Service",
    "Quizzes",
    "Leadership"
];
export const EventManagingForm = ({ dashboardData }) => {
    // =========================
    // Handling Event Section
    // =========================
    const [isSubmitting, setIsSubmitting] = useState(true);

    // Handling the data entry
    let [eventData, setEventData] = useState({
        title: "",
        catagory: "",
        location: "",
        time: "",
        Audience: ""
    });

    // Handling the data entry:
    const handleEventChngs = (e) => {
        let { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
        setIsSubmitting(false);
    }

    // %%%%%% Form Submission of "EVENT" Section %%%%%%%
    const AddNewEventFun = (e) => {
        e.preventDefault();
        AddNewEvent(eventData, setIsSubmitting);
    }

    // =========================
    // Handling Activity Section
    // =========================

    // Tracking changes
    const [acitivtiesSecChanged, setAcitivtiesSecChanged] = useState(false);

    let defaultActivitiesMap = {
        Debate: false,
        Sports: false,
        Science: false,
        Arts: false,
        Environment: false,
        Photography: false,
        Coding: false,
        Service: false,
        Quizzes: false,
        Leadership: false
    };

    // Update activity map based on dashboard data
    const syncActivitiesFromDashboard = () => {
        if (dashboardData?.extraActivities) {
            let updatedActivities = { ...defaultActivitiesMap };

            for (const activity in updatedActivities) {
                if (dashboardData.extraActivities.includes(activity)) {
                    updatedActivities[activity] = true;
                } else {
                    updatedActivities[activity] = false;
                }
            }
            setOferActvty(updatedActivities);
        }
    };

    useEffect(() => {
        syncActivitiesFromDashboard();
    }, [dashboardData]);

    let [activities, setActivities] = useState(extraActivities);
    let [oferActvty, setOferActvty] = useState(defaultActivitiesMap);


    // Creating Items (Checkboxes of activities);
    let Item = activities.map((activity, i) => {
        return (
            <div className="actitvityCont" key={i}>
                <input type="checkbox" name={activity} id={activity} checked={oferActvty[activity] || false} className="dshbrdCheckbox" onChange={(e) => hndleActvtyChange(e)} />
                <label htmlFor={activity} className="DshbrdActivityLabel">{activity}</label>
            </div>
        )
    });

    // Adding New Activity Field (Checkbox)
    const AddActivity = () => {
        let newActivityName = prompt("Enter the Activity name. If it has two words, separate them with an underscore, e.g., First_Name.");
        setActivities([...activities, newActivityName]);
        setOferActvty({ ...oferActvty, [newActivityName]: false });
        setAcitivtiesSecChanged(true);
    }

    // Handling Activity Section Changes
    const hndleActvtyChange = (e) => {
        let { name, checked } = e.target;
        setOferActvty({ ...oferActvty, [name]: checked });
        setAcitivtiesSecChanged(true);
    }

    // %%%%%% Form Submission of "ACTIVITIES" Section %%%%%%%
    const UpdateActivities = (e) => {
        e.preventDefault();
        let extraActivities = [];
        for (const key in oferActvty) {
            if (oferActvty[key]) {
                extraActivities.push(key);
            }
        }
        UpdateExtraActivities(extraActivities, setAcitivtiesSecChanged);
    }

    return (
        <section className="form-area">
            {/* To show notification */}
            <ToastContainer />
            <h2>Events</h2>
            <form onSubmit={(e) => AddNewEventFun(e)}>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label >Event Title</label>
                        <input type="text" name="title" value={eventData.title} onChange={(e) => handleEventChngs(e)} />
                    </div>
                </div>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label >Event Catagory</label>
                        <select type="text" name="catagory" value={eventData.catagory} onChange={(e) => handleEventChngs(e)}>
                            <option>--Select--</option>
                            <option>Academic</option>
                            <option>Sports</option>
                            <option>Cultural</option>
                            <option>Workshop</option>
                            <option>Workshop</option>
                            <option>Seminar</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label >Event Location</label>
                        <input type="text" name="location" value={eventData.location} onChange={(e) => handleEventChngs(e)} />
                    </div>
                </div>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label >Event Time</label>
                        <input type="date" name="time" value={eventData.time} onChange={(e) => handleEventChngs(e)} />
                    </div>
                    <div className="form-group">
                        <label >Audience</label>
                        <select type="text" name="Audience" value={eventData.Audience} onChange={(e) => handleEventChngs(e)}>
                            <option>--Select--</option>
                            <option>Public</option>
                            <option>Institute Member</option>
                        </select>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={isSubmitting} className="save-btn">Save</button>
                </div>
            </form>
            <br></br>
            {
                (dashboardData.eventData)
                    ?
                    EventCards(dashboardData)
                    :
                    <></>
            }
            <br></br>
            <br></br>
            <h2>Extra Activities</h2>
            <form onSubmit={(e) => UpdateActivities(e)}>
                <div className="activitiesCont">
                    {Item}
                </div>
                <div className="AddField" onClick={AddActivity}>
                    +
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={!acitivtiesSecChanged} className="save-btn">Save</button>
                </div>
            </form>
            <br></br>
        </section>
    )
}

const EventCards = ({ eventData }) => {

    if (!eventData || eventData.length === 0) return null;

    return (
        <div className="Adm-event-cards-container">

            {
                eventData.map((event, i) => (

                    <div className="Adm-event-card" key={i}>

                        <div className="Adm-event-card-header">
                            <h3 className="Adm-event-title">
                                {event.title}
                            </h3>

                            <button
                                type="button"
                                className="Adm-event-delete-btn"
                                onClick={() => deleteTheEvent(event.title)}
                            >
                                <FiTrash2 />
                            </button>
                        </div>

                        <p className="Adm-event-info">
                            <strong>Location:</strong> {event.location}
                        </p>

                        <p className="Adm-event-info">
                            <strong>Category:</strong> {event.catagory}
                        </p>

                        <p className="Adm-event-info">
                            <strong>Time:</strong> {event.time}
                        </p>

                        <p className="Adm-event-info">
                            <strong>Audience:</strong> {event.Audience}
                        </p>

                    </div>

                ))
            }

        </div>
    );
};
