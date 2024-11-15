var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function measureRequest(url) {
    return __awaiter(this, void 0, void 0, function () {
        var start, response, end;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = performance.now();
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    end = performance.now();
                    return [2 /*return*/, {
                            duration: end - start,
                            timestamp: new Date(),
                            status: response.status,
                        }];
            }
        });
    });
}
function calculateMedian(numbers) {
    var sorted = __spreadArray([], numbers, true).sort(function (a, b) { return a - b; });
    var middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}
function runBenchmark(url_1) {
    return __awaiter(this, arguments, void 0, function (url, iterations) {
        var results, errors, i, progress, result, error_1, durations, average, median, p95, p99;
        if (iterations === void 0) { iterations = 500; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting benchmark for ".concat(url));
                    console.log("Running ".concat(iterations, " iterations..."));
                    results = [];
                    errors = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < iterations)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    progress = Math.round((i / iterations) * 100);
                    process.stdout.write("\rProgress: ".concat(progress, "% (").concat(i, "/").concat(iterations, ")"));
                    return [4 /*yield*/, measureRequest(url)];
                case 3:
                    result = _a.sent();
                    results.push(result);
                    // small delay to prevent spamming
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 4:
                    // small delay to prevent spamming
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    errors.push(error_1);
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log("\n\nBenchmark complete!");
                    durations = results.map(function (r) { return r.duration; });
                    average = durations.reduce(function (a, b) { return a + b; }, 0) / durations.length;
                    median = calculateMedian(durations);
                    console.log("\nResults:");
                    console.log("-".repeat(50));
                    console.log("Total Requests: ".concat(results.length));
                    console.log("Failed Requests: ".concat(errors.length));
                    console.log("Average Latency: ".concat(average.toFixed(2), "ms"));
                    console.log("Median Latency: ".concat(median.toFixed(2), "ms"));
                    console.log("Min Latency: ".concat(Math.min.apply(Math, durations).toFixed(2), "ms"));
                    console.log("Max Latency: ".concat(Math.max.apply(Math, durations).toFixed(2), "ms"));
                    p95 = durations[Math.floor(durations.length * 0.95)];
                    p99 = durations[Math.floor(durations.length * 0.99)];
                    console.log("95th Percentile: ".concat(p95.toFixed(2), "ms"));
                    console.log("99th Percentile: ".concat(p99.toFixed(2), "ms"));
                    if (errors.length > 0) {
                        console.log("\nErrors encountered:");
                        errors.forEach(function (error, index) {
                            console.log("Error ".concat(index + 1, ": ").concat(error.message));
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var url = process.argv[2];
runBenchmark(url).catch(console.error);
