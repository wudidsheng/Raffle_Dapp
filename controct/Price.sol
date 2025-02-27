// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library Price {
    function getExchangeRate(
        AggregatorV3Interface price
    ) internal view returns (uint256) {
        (, int answer, , , ) = price.latestRoundData();
        // BTC / USD feed 上的答案使用 8 位小数，因此答案3030914000000表示 BTC / USD 价格为30309.14
        return uint256(answer * 1e10);
    }

    function getConversionEth(
        uint256 money,
        AggregatorV3Interface price
    ) internal view returns (uint256) {
        uint rate = getExchangeRate(price);
        //得到真实的价格
        return (money * rate) / 1e18;
    }
}
