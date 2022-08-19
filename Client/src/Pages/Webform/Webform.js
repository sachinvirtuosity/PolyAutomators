import React, { useEffect, useState } from 'react'
import TokenDetails from "../../components/TokenDetails"
import TokenFeatures from "../../components/TokenFeatures"
import TokenNetwork from "../../components/TokenNetwork"
import BillingDetails from "../../components/BillingDetails"
import CheckoutTokens from "../../components/CheckoutTokens"

import { Formik, useFormik } from "formik"

export const FormContext = React.createContext();

export default function Webform() {
  const formik = useFormik({
    initialValues: {
      tokenName: "",
      tokenSymbol: "",
      initialSupply: "",
      tokenDecimals: "",
      tokenSupply: "",
      supplyType: "",
      accessType: "",
      transferType: "",
      verifiedSourceCode: "",
      removeCopyright: "",
      burnable: "",
      mintable: "",
      erc1363: "",
      tokenRecover: "",
      tokenType: "",
      network: "",
      agreement: "",
    },
  })
  const [data, setData] = useState(null);
  const [dataout, getData] = useState(null);
  const [showBillingDtl, setshowBillingDtl] = useState(false);
  const [isCheckoutDisabled, setCheckoutDisabled] = useState(false);
  const [submitted, setSubmitted] = useState(undefined);
  const [tokentp, settokentp] = useState(null);
  const [billingDtl, setbillingDtl] = useState(false)

  const getTokenDetails = (tokenDetails) => {
    setData(tokenDetails);


  }
  const setTokenDetails = () => {
    getData(data);
    ;

    if (data != null) {

      if (Object.keys(data.billingDetails).length == 0 || data.billingDetails["validBillingDtls"] == false) {
        setCheckoutDisabled(false);
      } else {
        setCheckoutDisabled(true);
      }
    }

  }
  useEffect(() => {
    setTokenDetails();
  }, [data, billingDtl])


  const formikRef = React.createRef();
  const isTabActive = submitted ? "active" : ""


  return (
    <>
      <p className='text-2xl font-medium'>Create Token</p>

      <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={formik.initialValues}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitted(true);
        }}
      >
        <div>
          <div className="flex md:flex-row flex-col">
            <TokenDetails getTokenDetails={getTokenDetails} tokentp={tokentp} />
            <TokenFeatures setTokenDetails={dataout} tokentp={tokentp} />
            <TokenNetwork setTokenDetails={dataout} setshowBillingDtl={setshowBillingDtl} settokentp={settokentp} />
          </div>

          {showBillingDtl && <div className='mt-5'>
            <p className='text-2xl font-medium'>Billing Details</p>
            <BillingDetails setTokenDetails={dataout} setbillingDtl={setbillingDtl} billingDtl={billingDtl} />
          </div>
          }
          {isCheckoutDisabled && <div className='mt-5'>
            <p className='text-2xl font-medium mb-5'>Summary</p>
            <CheckoutTokens setTokenDetails={dataout} />
          </div>}
        </div>

      </Formik>
    </>

  )
}
