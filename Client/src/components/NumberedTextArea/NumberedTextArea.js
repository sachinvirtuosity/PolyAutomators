import React, { useState, useRef } from 'react'
export default function NumberedTextArea({setTokenList}) {

  const [value, setvalue] = useState({ counter: 2, text: `1 ` });
  const [error, setError] = useState("");
  const onChange = (e) => {
    const {
      target: { value: currentValue },
    } = e;
    setvalue({ counter: value.counter, text: currentValue });
    setTokenList(value.text);
  };
  const _onKeyDown = (e) => {

    if (e.keyCode === 13) {
      let tokenList = value.text.split("\n");
      console.log(tokenList[tokenList.length - 1].toString().includes(","));
      if (tokenList.length > 200) {
        setError("Tokens will be sent to batches of 200 addresses.");
        return false;
      } else if (!tokenList[tokenList.length - 1].toString().includes(",")) {

        setError("Use comma between address and amount.");
        return false;
      } else {

        let amt = tokenList[tokenList.length - 1].toString();
        let tempAmt = amt.substring(amt.indexOf(",") + 1, amt.length);
        let tempaddress = amt.substring(amt.indexOf(" "),amt.indexOf(","));
        console.log(tempaddress);
        let contractAddress_regex = new RegExp('0x[a-fA-F0-9]{40}$');
        if(!contractAddress_regex.test(tempaddress)){
          
        setError("Invalid Address.");
        return false;
        }
        if (isNaN(parseInt(tempAmt))) {
          setError("Invalid amount.");
          return false;
        } else {
          let amt = tokenList[tokenList.length - 1].toString();
          let tempcount = amt.substring(0, 1);
          let newTxt = "";
          let cnt = 0;
          if (value.counter != (parseInt(tempcount) + 1)) {
            cnt = parseInt(tempcount) + 1;
            newTxt = `${value.text}\n${cnt} `;

          } else {
            newTxt = `${value.text}\n${value.counter++} `;
            cnt = value.counter++;
          }

          setvalue({ counter: cnt, text: newTxt });
          
          setError("");
        }

      }
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <>
      <textarea className='bg-gray-50 h-60 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
      ' value={value.text}
        onChange={(e) => onChange(e)} onKeyDown={_onKeyDown}>
        {value.text}
      </textarea>
     
      <p className='mt-px clear-both text-xs text-gray-400'>Insert one address and the respective amount per line. Separate the address and amount with a comma and no space in between.

        Please NOTE: tokens will be sent to batches of 200 addresses. If there are more than 200 addresses in your list, you will have to approve each batch separately.</p>
        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{error}</div>
    </>
  );

}
