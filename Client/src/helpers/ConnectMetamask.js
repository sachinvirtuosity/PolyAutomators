import { useMetaMask } from "metamask-react";
import MetaMaskOnboarding from '@metamask/onboarding';
import {
    metaMaskLogin
} from "./";
export function ConnectMetamask() {
    const { status, account, ethereum } = useMetaMask();
    console.log(status);
    if (status == "unavailable") {

        onboarding.current = new MetaMaskOnboarding();
        onboarding.current.startOnboarding();


    } else {
        if (status == "notConnected") {
            ethereum.request({
                method: "eth_requestAccounts"

            }).then((res) => {
                return (res[0]);
            });


        } else {
            return (account);

        }


    }
}