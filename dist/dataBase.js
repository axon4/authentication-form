"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = exports.connect = exports.SQLiteSessionRepository = exports.SQLiteUserRepository = void 0;
var promised_sqlite3_1 = require("promised-sqlite3");
var uuid_1 = require("uuid");
var authentication_1 = require("./authentication");
;
;
;
var SQLiteUserRepository = /** @class */ (function () {
    function SQLiteUserRepository(dataBase) {
        this.dataBase = dataBase;
    }
    ;
    SQLiteUserRepository.prototype.create = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var ID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataBase.get('INSERT INTO users ("eMail", hash, "termsAndConditions") VALUES (?, ?, ?) RETURNING "ID";', [user.eMail, user.hash.hash, user.termsAndConditions])];
                    case 1:
                        ID = (_a.sent()).ID;
                        return [2 /*return*/, __assign(__assign({}, user), { ID: ID })];
                }
            });
        });
    };
    ;
    SQLiteUserRepository.prototype.get = function (ID) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataBase.get('SELECT * FROM users WHERE "ID" = ?;', ID)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, undefined];
                        else
                            return [2 /*return*/, __assign(__assign({}, user), { hash: new authentication_1.Hash(user.hash) })];
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    SQLiteUserRepository.prototype.find = function (eMail) {
        return __awaiter(this, void 0, void 0, function () {
            var ID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataBase.get('SELECT "ID" FROM users WHERE "eMail" = ?;', eMail)];
                    case 1:
                        ID = _a.sent();
                        if (!!ID) return [3 /*break*/, 2];
                        return [2 /*return*/, undefined];
                    case 2: return [4 /*yield*/, this.get(ID.ID)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    return SQLiteUserRepository;
}());
exports.SQLiteUserRepository = SQLiteUserRepository;
;
;
var SQLiteSessionRepository = /** @class */ (function () {
    function SQLiteSessionRepository(dataBase) {
        this.dataBase = dataBase;
    }
    ;
    SQLiteSessionRepository.prototype.create = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionID;
            return __generator(this, function (_a) {
                sessionID = (0, uuid_1.v4)();
                this.dataBase.run('INSERT INTO sessions ("sessionID", "userID") values (?, ?);', [sessionID, userID]);
                return [2 /*return*/, sessionID];
            });
        });
    };
    ;
    SQLiteSessionRepository.prototype.get = function (ID) {
        return __awaiter(this, void 0, void 0, function () {
            var userID, users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataBase.get('SELECT "userID" FROM sessions WHERE "sessionID" = ?;', ID)];
                    case 1:
                        userID = _a.sent();
                        if (!!userID) return [3 /*break*/, 2];
                        return [2 /*return*/, undefined];
                    case 2:
                        users = new SQLiteUserRepository(this.dataBase);
                        return [4 /*yield*/, users.get(userID.userID)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return SQLiteSessionRepository;
}());
exports.SQLiteSessionRepository = SQLiteSessionRepository;
;
function connect(connectionString) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promised_sqlite3_1.AsyncDatabase.open(connectionString)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.connect = connect;
;
function seed(dataBase) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dataBase.exec("\n\t\tCREATE TABLE IF NOT EXISTS users (\n\t\t\t\"ID\" INTEGER PRIMARY KEY,\n\t\t\t\"eMail\" TEXT UNIQUE NOT NULL,\n\t\t\thash TEXT NOT NULL,\n\t\t\t\"termsAndConditions\" BOOLEAN NOT NULL\n\t\t);\n\n\t\tCREATE TABLE IF NOT EXISTS sessions (\n\t\t\t\"sessionID\" UUID PRIMARY KEY,\n\t\t\t\"userID\" INTEGER NOT NULL,\n\t\t\tFOREIGN KEY (\"userID\") REFERENCES USERS(\"ID\") ON DELETE CASCADE\n\t\t);\n\t")];
        });
    });
}
exports.seed = seed;
;
