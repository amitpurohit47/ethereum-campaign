// Compile Workflow
/* 
    We don't need to compile contracts again and again
    We compile once and store the compiled output in build directory
    We compile only if we change our contracts

    1. Delete build directory if initially present thereby removing all initial contract output
    2. Compile the source
    3. Make build directory again
    4. Store the output in separate files in build directory
    5. Use output from build directory
*/

const path = require("path"); // path module
const solc = require("solc"); // solidity compiler
const fs = require("fs-extra"); // this gives extra functionalities

const buildPath = path.resolve(__dirname, "build");
// getting path of build directory initially to delete it if it exists
fs.removeSync(buildPath);
// special function of fs-extra to delete directory as it is hectic to do it using normal fs

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
// Getting path for contracts file
const source = fs.readFileSync(campaignPath, "utf-8");
// Reading the contract file
const output = solc.compile(source, 1).contracts;
// Compiling the contract file using source and 1 to activate the optimizer

fs.ensureDirSync(buildPath);
// Preparing the build directory again

for (let contract in output) {
  // iterating over all contracts in output
  fs.outputJSONSync(
    // make a json file for each contract
    path.resolve(buildPath, contract.replace(/:/g, "") + ".json"), // 1st argument is path of the new file
    output[contract] // 2nd argument is contents of new file
  );
}
