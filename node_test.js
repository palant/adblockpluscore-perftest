let fs = require("fs");
let path = require("path");

let data = fs.readFileSync(path.join(__dirname, "easylist.txt"), "utf-8").split(/[\r\n]+/).slice(1);
let result = {};

function toMB(bytes)
{
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

let {Filter} = require("filterClasses");
global.gc();
let memory = process.memoryUsage();
result.memLoaded = memory.heapUsed + memory.external;

let startTime = process.hrtime()
for (let line of data)
  Filter.fromText(line);
let [seconds, nanos] = process.hrtime(startTime);
result.time = seconds + nanos / 1000000000;

global.gc();
memory = process.memoryUsage();
result.memFinal = memory.heapUsed + memory.external;

try
{
  let memoryLayout = require("compiled").getMemoryLayout();
  result.memEmscriptenUsed = memoryLayout.dynamic_top;
}
catch (e)
{
  // Not Emscripten
}

console.log(JSON.stringify(result));
