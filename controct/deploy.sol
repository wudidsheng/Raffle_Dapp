// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import {Raffle} from "./Raffle.sol";

contract DeployRaffle {
    Raffle raffle;

    constructor() {
        raffle = new Raffle(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43,
            0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B,
            0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae,
            90341041579258965582510458310545705229472713213703887701827109909512055165582,
            3,
            5000
        );
    }
}
