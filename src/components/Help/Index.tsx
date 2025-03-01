import React, { useState } from "react";

export function PlayHelp() {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <React.Fragment>
      <div
        onClick={() => {
          setShowHelp(true);
        }}
        className="w-[auto] pt-0.5 pr-1 pl-1 pb-0.5 h-[auto] cursor-pointer text-[16px]  text-center font-[600] text-white bg-[#3898ff] rounded-xl"
      >
        How to play?
      </div>
      {showHelp && (
        <div className="w-[100vw] h-[100vh] top-0 left-0 z-52 absolute flex bg-[#000009e6] justify-center items-center">
          <div className="w-60 h-90 border-blue-400 border-3 rounded-xs">
            <div className="border-3 rounded-xs border-amber-50 w-full h-full">
              <div className="w-full h-full bg-[#4e4747]">
                <h3 className="text-[16px] w-full text-center text-blue-400 mb-2">
                  How to play
                </h3>
                <p className="text-[12px] text-emerald-300 w-full text-center ">
                  Pick the results for this draw correctly and win your share of
                  the jackpot. The more people play, the bigger the prize pool
                  gets, $20 guaranteed.
                </p>
                <div className="w-full mb-2 mt-2">
                  <h4 className="text-blue-400 text-center text-[15px]">
                    step1
                  </h4>
                  <p className="text-center  text-[12px] text-white">
                    Connect a Sepolia wallet
                  </p>
                </div>
                <div className="w-full mb-2 ">
                  <h4 className="text-blue-400 text-center text-[15px]">
                    step2
                  </h4>
                  <p className="text-center  text-[12px] text-white">
                    Pick 3 winning numbers
                  </p>
                </div>
                <div className="w-full mb-2 ">
                  <h4 className="text-blue-400 text-center text-[15px]">
                    step3
                  </h4>
                  <p className="text-center  text-[12px] text-white">
                    Submit your entry
                  </p>
                </div>
                <div className="w-full mb-2 ">
                  <h4 className="text-blue-400 text-center text-[15px]">
                    step4
                  </h4>
                  <p className="text-center  text-[12px] text-white">
                    Keep hope alive
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowHelp(false);
                  }}
                  className="mt-1  text-white  bg-blue-300 p-1 rounded-2xl cursor-pointer ml-[50%] translate-x-[-50%]"
                >
                  let's go
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
