import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { ABI, contractAddress } from "../../assets/abi";
import _ from "lodash";

export function JoinGame() {
  const [showJoin, setShowJoin] = useState(false);
  const [login, setLogin] = useState(false);
  const [formData, setFormData] = useState({
    no1: 1,
    no2: 1,
    no3: 1,
  });

  const checkLogin = useCallback(async () => {
    // @ts-ignore
    const users = await window?.ethereum?.request({ method: "eth_accounts" });
    if (!users.length) {
      setLogin(false);
    }
    setLogin(true);
  }, []);

  useEffect(() => {
    const keyDownHandel = (evnet: KeyboardEvent) => {
      if (evnet.key === "Escape") {
        setShowJoin(false);
      }
    };
    document.addEventListener("keyup", keyDownHandel);
  }, []);

  useEffect(() => {
    checkLogin();
  }, []);

  const signAndJoinGame = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (!login) {
        return alert("Please connect your wallet first");
      }

      const valueFilter = Object.values(formData).find((item) => !item);
      if (valueFilter) {
        return alert("Please enter a number between 1 and 256");
      }
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);

      const Arraydata = [formData.no1, formData.no2, formData.no3];
      const numberArray = Arraydata.map((n) => ethers.toBigInt(n));

      try {
        const tx = await contract.enterRaffle(numberArray, {
          value: ethers.parseUnits("0.002").toString(),
        });
        await tx.wait(); // 等待交易确认
        alert("join ok:");
        setShowJoin(false);
      } catch (error: any) {
        if (error.data) {
          const decodedError = contract.interface.parseError(error.data);
          console.log(decodedError.name);
          alert(decodedError.name); //
        }
      }
    },
    [login]
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (value < 1) {
      return setFormData({
        ...formData,
        [name]: 1,
      });
    }
    if (value > 256) {
      return setFormData({
        ...formData,
        [name]: 256,
      });
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setShowJoin(true);
        }}
        className="h-10 w-fit pr-1.5 pl-1.5 rounded-2xl bg-amber-50 text-blue-400 cursor-pointer"
      >
        JoinGame
      </button>
      {showJoin && (
        <div className="w-[100vw] h-[100vh] top-0 left-0 z-52 absolute flex bg-[#000009e6] justify-center items-center">
          <div className="w-50 h-fit border-blue-400 border-3 rounded-xs ">
            <form
              onSubmit={_.throttle(signAndJoinGame, 5000)}
              className="flex gap-1 justify-center items-center pt-1.5 flex-wrap"
            >
              <input
                type="number"
                name="no1"
                placeholder="Enter a number between 0-256"
                pattern="^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-5][0-6])$"
                className="bg-white text-blue-700 outline-amber-50"
                value={formData.no1}
                onChange={handleChange}
                min={1}
                max={256}
              />
              <input
                type="number"
                name="no2"
                placeholder="Enter a number between 0-256"
                pattern="^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-5][0-6])$"
                className="bg-white text-blue-700 outline-amber-50"
                min={1}
                max={256}
                onChange={handleChange}
                value={formData.no2}
              />
              <input
                type="number"
                name="no3"
                placeholder="Enter a number between 0-256"
                pattern="^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-5][0-6])$"
                className="bg-white text-blue-700 outline-amber-50"
                min={1}
                value={formData.no3}
                onChange={handleChange}
                max={256}
              />
              <div className="basis-full">
                <button
                  type="submit"
                  className="mt-1  text-white  bg-blue-300 p-1 rounded-2xl cursor-pointer ml-[50%] translate-x-[-50%]"
                >
                  let's go
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
