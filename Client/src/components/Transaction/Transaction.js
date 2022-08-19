import "./transaction.scss"
import React, { useState, useEffect } from 'react'
import Loader from 'react-loading';
import {
    USER_BASE_URL,
    globalService,
    GET_SUBSCRIPTION_FEE,
} from "../../helpers";
var txnDtl = {
    "commisionFee": "",
    "gasFee": "100",
    "subscriptionFee": "2000",
    "showBilling": false
}
export default function Transaction(inputTxn) {
    const [commisionFee, setcommition] = useState('');
    const [isDisabledBtn, setisDisabledBtn] = useState(true);
    const [isloading, setLoading] = useState(false);


    useEffect(async () => {

        const user = JSON.parse(sessionStorage.getItem("user"));

        if (inputTxn.setTransaction != null) {

            if (inputTxn.setTransaction[2].setTokenDetails != null) {
                setisDisabledBtn(!inputTxn.setTransaction[2].setTokenDetails["validForm"]);
            }
            const contract = inputTxn.setTransaction[0].label;
            const network = inputTxn.setTransaction[1].label;
            var config = {
                method: "GET",

                url: `${USER_BASE_URL}/${GET_SUBSCRIPTION_FEE}/${contract}/${network}`,

            };

            try {
                const resp = await globalService(config);

                if (resp.length > 0) {
                    setcommition(resp[0].feeIn$);
                    txnDtl.commisionFee = resp[0].feeIn$;

                    inputTxn.getTransaction(txnDtl)
                }
            } catch (err) {

            }
        }
    }, [inputTxn])
    const handleSubmit = () => {

        if (inputTxn.setTransaction[2].setTokenDetails["validForm"]) {
            setLoading(true)
            txnDtl.showBilling = true;
            inputTxn.setTransaction[2].setshowBillingDtl(true);

            inputTxn.getTransaction(txnDtl)
            setLoading(false);
        }


    }

    return (
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700 mx-auto mt-6">
            <h5 className="text-xl font-medium text-center text-gray-900 dark:text-white">Transaction</h5>
            <div className="flex justify-between items-center my-1">
                <span>Commission Fee: </span>
                <span className="text-center badge badge-success">${commisionFee} </span>
            </div>
            <div className="flex justify-between items-center my-1">
                <span>Gas Fee: </span>
                <span className="text-center badge badge-info">Variable</span>
            </div>
            {isloading ? <div className="cover-spin flex justify-center items-center">

                <Loader type={'spinningBubbles'} color="#ed8936">

                </Loader>

            </div> :
                <button disabled={isDisabledBtn} onClick={(e) => handleSubmit()} className={`w-full rounded text-white h-10 ${isDisabledBtn ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500"}`}>Next</button>}
        </div>
    )
}