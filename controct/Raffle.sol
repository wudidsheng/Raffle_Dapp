// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

import "Price.sol";
enum Status {
    PENDING, //参与中
    OPEN //号码产生中
}

contract Raffle is AutomationCompatibleInterface, VRFConsumerBaseV2Plus {
    //参与人员结构体
    struct PlayerWithNumber {
        address player;
        uint8[3] numbers;
    }
    bytes32 private immutable keyHash;
    uint256 private immutable subId;
    uint16 private immutable requestConfirmations;
    uint32 private immutable callbackGasLimit;

    //etc/usd 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
    AggregatorV3Interface internal dataFeed;
    //号码产生时间1天
    uint256 private constant intervalNumber = 60 * 60 * 24;
    //抽奖参与时间3天
    uint256 private constant intervalJoin = 60 * 60 * 24 * 3;
    uint256 private lastTime;
    //中奖号码3位
    uint8[3] private WinningNumbers;
    // 合约状态
    Status public status = Status.PENDING;
    // 参与人员
    PlayerWithNumber[] private i_playerWithNumberList;
    // 5usd
    uint256 private immutable i_enterFee = 5;
    uint8 private index = 0;
    address[] private winners;
    //自定义错误
    error NotEnoughEthSend();
    error StatusIsOpen();
    error DateNotArrived();
    //自定义事件
    event JoinGame(address indexed user);

    constructor(
        address _dataFeed,
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint256 _subId,
        uint16 _requestConfirmations,
        uint32 _callbackGasLimit
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        keyHash = _keyHash;
        subId = _subId;
        requestConfirmations = _requestConfirmations;
        callbackGasLimit = _callbackGasLimit;
        dataFeed = AggregatorV3Interface(_dataFeed);
        lastTime = block.timestamp;
    }

    modifier canJoinGame() {
        if (status != Status.PENDING) {
            revert StatusIsOpen();
        }
        if (
            Price.getConversionEth(msg.value, AggregatorV3Interface(dataFeed)) <
            i_enterFee
        ) {
            revert NotEnoughEthSend();
        }

        emit JoinGame(msg.sender);
        _;
    }

    //判断是否相同
    function areEqual(
        uint8[3] memory arr1,
        uint8[3] memory arr2
    ) public pure returns (bool) {
        if (arr1.length != arr2.length) {
            return false; // 长度不同，直接返回 false
        }
        return keccak256(abi.encode(arr1)) == keccak256(abi.encode(arr2));
    }

    function pickWiner() internal {
        winners = new address[](0);
        for (uint256 i = 0; i < i_playerWithNumberList.length; i++) {
            PlayerWithNumber memory play = i_playerWithNumberList[i];
            bool isWiner = areEqual(play.numbers, WinningNumbers);
            if (isWiner) {
                winners.push(play.player);
            }
        }
        uint256 totalBalance = address(this).balance;
        if (winners.length > 0) {
            for (uint256 j = 0; j < winners.length; j++) {
                address winer = winners[j];
                (bool success, ) = winer.call{
                    value: totalBalance / winners.length
                }("");
            }
        }
        //开始新的一轮
        status = Status.PENDING;
        index = 0;
        delete i_playerWithNumberList;
    }

    //请求随机数
    function requestRandomWords() internal {
        if ((block.timestamp - lastTime) > intervalNumber) {
            revert DateNotArrived();
        }
        VRFV2PlusClient.RandomWordsRequest memory RandomParams = VRFV2PlusClient
            .RandomWordsRequest({
                keyHash: keyHash,
                subId: subId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: 1,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            });
        s_vrfCoordinator.requestRandomWords(RandomParams);
        lastTime = block.timestamp;
    }

    // fulfillRandomWords function
    function fulfillRandomWords(
        uint256,
        uint256[] calldata randomWords
    ) internal override {
        if (index > 2) revert();
        uint8 number = uint8(randomWords[0] % 255) + 1;
        WinningNumbers[index] = number;
        index++;
    }

    function performUpkeep(bytes calldata) external {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert();
        }
        pickWiner();
    }

    //自动化检测
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        if (status == Status.PENDING) {
            //关闭抽奖
            if (block.timestamp - lastTime > intervalJoin) {
                status = Status.OPEN;
                lastTime = block.timestamp;
            }
            return (false, "0x0");
        }
        if (WinningNumbers.length == 3) {
            //选取获胜者
            return (true, "0x0");
        }
        //生产随机数
        if (block.timestamp - lastTime > intervalNumber) {
            requestRandomWords();
        }
        return (false, "0x0");
    }

    //参与中奖
    function enterRaffle(uint8[3] memory numbers) public payable canJoinGame {
        i_playerWithNumberList.push(PlayerWithNumber(msg.sender, numbers));
    }

    // 获取参与者
    function getPlayNumbers(
        uint256 index
    ) external view returns (uint8[3] memory) {
        PlayerWithNumber memory player = i_playerWithNumberList[index];
        return player.numbers;
    }

    //中间号码
    function getWinNumbers() external view returns (uint8[3] memory) {
        return WinningNumbers;
    }
}
