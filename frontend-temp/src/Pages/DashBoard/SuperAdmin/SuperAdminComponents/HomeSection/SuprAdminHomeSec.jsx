import "./SuprAdminHomeSec.css";

export const SuperAdminHomeSec = () => {
    const modules = [
        { icon: "🏛️", title: "Institutional Management", desc: "Core administration of all registered service provider profiles and credentials." },
        { icon: "🛡️", title: "Access Control", desc: "System-wide monitoring of service activation status and security protocols." },
        { icon: "📈", title: "Request Pipeline", desc: "Real-time overview of incoming applications and pending approval workflows." },
    ];

    return (
        <div className="SA_home">
            <div className="SA_home_container">
                <header className="SA_header">
                    <span className="SA_badge">System Overview</span>
                    <h1 className="SA_home_title">Super Admin Dashboard</h1>
                    <p className="SA_home_tagline">Central monitoring and control for all integrated services.</p>
                </header>

                <div className="SA_home_highlights">
                    {modules.map((item, index) => (
                        <div key={index} className="SA_home_card">
                            <div className="SA_icon_container">{item.icon}</div>
                            <div className="SA_text_container">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};