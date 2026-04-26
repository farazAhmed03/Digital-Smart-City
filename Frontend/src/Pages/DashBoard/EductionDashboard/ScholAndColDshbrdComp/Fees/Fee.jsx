import "./Fee.css";
import "../ScholAndColDshbrdComp.css";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { SendFeeTabDataToDb, SendPaymentGatewayToDb } from "../../../../../ApiCalls/DashBoardApiCalls";

export const FeeStructure = ({ dashboardData }) => {
    const [CanSubmitForm, setCanSubmitForm] = useState(false);

    // Decides to show class adder form or not
    let [showAdderForm, setShowAdderForm] = useState(false);

    // Setting the Db Data if any, instead of default data
    let [rowsData, setRowsData] = useState(dashboardData.feeData || [{
        Class: 1,
        MonthlyFee: 700,
        AnnualFee: 6000,
        AdmissionFee: 1000
    }]);

    // New Rows
    let [newRowdta, setNewRowDta] = useState({
        Class: "",
        MonthlyFee: "",
        AnnualFee: "",
        AdmissionFee: ""
    });

    // Arranging class in increasing order like 1 , 2, 3 , ....;
    let sortedArr = [...rowsData].sort((a, b) => Number(a.Class) - Number(b.Class));
    let row = sortedArr.map((rowObj, i) => {
        return (
            <tr key={i}>
                <td>{rowObj.Class}</td>
                <td>{rowObj.MonthlyFee}</td>
                <td>{rowObj.AnnualFee}</td>
                <td>{rowObj.AdmissionFee}</td>
                <td className="actionTd">
                    <button type="button" className="delActionTd tdBtns" onClick={() => { delTheRow(rowObj) }}><FaTrash /></button>
                </td>
            </tr>
        )
    });

    const delTheRow = (rowObj) => {
        let updatedArr = rowsData.filter((rows) => rows !== rowObj);
        setRowsData(updatedArr);
        setCanSubmitForm(true);
    }

    const FinalFun = (e) => {
        e.preventDefault();
        SendFeeTabDataToDb(rowsData, setCanSubmitForm);
    }


    /* ============================= */
    /* ===== PAYMENT GATEWAYS ====== */
    /* ============================= */

    const [canSubmitGateway, setCanSubmitGateway] = useState(false);

    const [paymentData, setPaymentData] = useState(
        dashboardData.paymentGateways || {
            easypaisa: { accountTitle: "", accountNumber: "" },
            jazzcash: { accountTitle: "", accountNumber: "" },
            bank: { bankName: "", accountTitle: "", accountNumber: "", iban: "" }
        }
    );

    const handlePaymentChange = (e, gateway) => {
        const { name, value } = e.target;

        setPaymentData(prev => ({
            ...prev,
            [gateway]: {
                ...prev[gateway],
                [name]: value
            }
        }));

        setCanSubmitGateway(true);
    };

    const handleGatewaySubmit = (e) => {
        e.preventDefault();
        SendPaymentGatewayToDb(paymentData, setCanSubmitGateway);
    };

    return (
        <>
            <section className="form-area Dshbrdfee-Sec">
                {/* To show notification */}
                <ToastContainer />
                <form onSubmit={(e) => FinalFun(e)}>
                    <h2>Fee Structure</h2>
                    <p className="addressingPara">Add the classes fee details, your institute offer.</p>
                    <table className="feeTable">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Monthly Fee</th>
                                <th>Annual Fee</th>
                                <th>Admission Fee</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {row}
                        </tbody>
                    </table>
                    <div className="AddField tableRowAdder" onClick={() => { setShowAdderForm(!showAdderForm) }}>
                        +
                    </div>
                    {(showAdderForm)
                        ?
                        NewRowDataGettingFun(rowsData, setRowsData, newRowdta, setNewRowDta, setCanSubmitForm, setShowAdderForm)
                        :
                        <></>
                    }
                    <div className="form-actions">
                        <button type="submit" disabled={!CanSubmitForm} className="save-btn">Save</button>
                    </div>
                </form>

                <hr className="sectionDivider" />

                {/* ================= GATEWAY FORM ================= */}
                <form onSubmit={handleGatewaySubmit}>

                    <h2>Payment Gateway Details</h2>

                    <div className="gatewaySection">

                        {/* Easypaisa */}
                        <div className="gatewayCard">
                            <h3>Easypaisa</h3>
                            <input
                                type="text"
                                name="accountTitle"
                                placeholder="Account Title"
                                value={paymentData.easypaisa.accountTitle}
                                onChange={(e) => handlePaymentChange(e, "easypaisa")}
                            />
                            <input
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={paymentData.easypaisa.accountNumber}
                                onChange={(e) => handlePaymentChange(e, "easypaisa")}
                            />
                        </div>

                        {/* JazzCash */}
                        <div className="gatewayCard">
                            <h3>JazzCash</h3>
                            <input
                                type="text"
                                name="accountTitle"
                                placeholder="Account Title"
                                value={paymentData.jazzcash.accountTitle}
                                onChange={(e) => handlePaymentChange(e, "jazzcash")}
                            />
                            <input
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={paymentData.jazzcash.accountNumber}
                                onChange={(e) => handlePaymentChange(e, "jazzcash")}
                            />
                        </div>

                        {/* Bank */}
                        <div className="gatewayCard">
                            <h3>Bank Transfer</h3>
                            <input
                                type="text"
                                name="bankName"
                                placeholder="Bank Name"
                                value={paymentData.bank.bankName}
                                onChange={(e) => handlePaymentChange(e, "bank")}
                            />
                            <input
                                type="text"
                                name="accountTitle"
                                placeholder="Account Title"
                                value={paymentData.bank.accountTitle}
                                onChange={(e) => handlePaymentChange(e, "bank")}
                            />
                            <input
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={paymentData.bank.accountNumber}
                                onChange={(e) => handlePaymentChange(e, "bank")}
                            />
                            <input
                                type="text"
                                name="iban"
                                placeholder="IBAN"
                                value={paymentData.bank.iban}
                                onChange={(e) => handlePaymentChange(e, "bank")}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={!canSubmitGateway}
                            className="save-btn"
                        >
                            Save Payment Gateways
                        </button>
                    </div>

                </form>
            </section>
        </>
    )
}


// Creating new row componenet:
const NewRowDataGettingFun = (rowsData, setRowsData, newRowdta, setNewRowDta, setCanSubmitForm, setShowAdderForm) => {

    const handleNewRowDataChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setNewRowDta({ ...newRowdta, [name]: value })
    }

    const updateRows = () => {
        let IsEmptyData;
        Object.entries(newRowdta).map(([key, value]) => {
            if (!newRowdta[key] || newRowdta[key] === "") {
                IsEmptyData = true;
            } else {
                IsEmptyData = false
            }
        });
        if (IsEmptyData) {
            alert("Fill the fields first.")
        } else {
            setRowsData([...rowsData, newRowdta]);
            setNewRowDta({
                Class: "",
                MonthlyFee: "",
                AnnualFee: "",
                AdmissionFee: ""
            });
            setCanSubmitForm(true);
            setShowAdderForm(false);
        }
    }

    return (
        <div className="feeFormCont">
            <div className="adderForm">
                <div className="smallInputCont">
                    <div className="form-group">
                        <label>Class</label>
                        <input type="number" name="Class" value={newRowdta.Class} onChange={(e) => handleNewRowDataChange(e)} />
                    </div>
                    <div className="form-group">
                        <label>Monthly Fee</label>
                        <input type="number" name="MonthlyFee" value={newRowdta.MonthlyFee} onChange={(e) => handleNewRowDataChange(e)} />
                    </div>
                </div>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label>Annual Fee</label>
                        <input type="number" name="AnnualFee" value={newRowdta.AnnualFee} onChange={(e) => handleNewRowDataChange(e)} />
                    </div>
                    <div className="form-group">
                        <label>Admission Fee</label>
                        <input type="number" name="AdmissionFee" value={newRowdta.AdmissionFee} onChange={(e) => handleNewRowDataChange(e)} />
                    </div>
                </div>
                <button type="button" className="AddFeeDtaBtn" onClick={updateRows}>
                    Add
                </button>
            </div>
        </div>
    )
}