import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers, network } from "hardhat";
import { deploy } from "./utils/helpers";
import { any } from "hardhat/internal/core/params/argumentTypes";

describe("Tunnels", function () {
  let owner: any,
    fxRoot: any,
    fxChild: any,
    childTunnel: any,
    fxerc20: any,
    checkpointManager: any,
    rootTunnel: any;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    fxChild = "0xCf73231F28B7331BBe3124B907840A94851f9f11";
    fxRoot = "0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA";
    checkpointManager = "0x2890bA17EfE978480615e330ecB65333b880928e";
    fxerc20 = await deploy("FxERC20");
    rootTunnel = await deploy("FxERC20RootTunnel", [
      checkpointManager,
      owner.address,
      fxerc20.address,
    ]);

    childTunnel = await deploy("FxERC20ChildTunnel", [
      owner.address,
      fxerc20.address,
    ]);
    await childTunnel.setFxRootTunnel(rootTunnel.address);
  });

  describe("process message from root", function () {
    it("sets token mapping", async () => {
      expect(
        await childTunnel.processMessageFromRoot(
          1,
          rootTunnel.address,
          "0x2CEF46A936BDC5B7E6E8C71AA04560C41CF7D88BB26901A7E7F4936FF02ACCAD000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001000000000000000000000000008A26C63177B4AAD7507389864457DCE2489B03E1000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000C0000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000094A6F6E20546F6B656E000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034A6F6E0000000000000000000000000000000000000000000000000000000000"
        )
      ).to.emit(childTunnel, "TokenMapped");
      await childTunnel.processMessageFromRoot(
        1,
        rootTunnel.address,
        "0x87A7811F4BFEDEA3D341AD165680AE306B01AAEACC205D227629CF157DD9F821000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000E00000000000000000000000008A26C63177B4AAD7507389864457DCE2489B03E10000000000000000000000004FDD54A50623A7C7B5B3055700EB4872356BD5B30000000000000000000000004FDD54A50623A7C7B5B3055700EB4872356BD5B30000000000000000000000000000000000000000000000008AC7230489E8000000000000000000000000000000000000000000000000000000000000000000A000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000"
      );
    });
  });
});