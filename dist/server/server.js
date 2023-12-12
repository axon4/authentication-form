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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var fastify_1 = __importDefault(require("fastify"));
var static_1 = __importDefault(require("@fastify/static"));
var cookie_1 = __importDefault(require("@fastify/cookie"));
var formbody_1 = __importDefault(require("@fastify/formbody"));
var zod_1 = require("zod");
var nunjucks_1 = __importDefault(require("nunjucks"));
var middleWare_1 = require("./middleWare");
var dataBase_1 = __importStar(require("./dataBase"));
var validate_1 = require("../validate");
var authentication_1 = require("./authentication");
dotenv_1.default.config();
var environment = process.env.NODE_ENV;
var cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
    console.error('missing environment-variable: COOKIE_SECRET');
    process.exit(1);
}
;
var server = (0, fastify_1.default)({ logger: true });
var dataBaseConnectionString = path_1.default.join(__dirname, 'dataBase.sqlite');
var templates = new nunjucks_1.default.Environment(new nunjucks_1.default.FileSystemLoader(path_1.default.join(__dirname, 'templates')));
server.register(static_1.default, { root: path_1.default.join(__dirname, '../../dist') });
server.register(middleWare_1.clearFlashMessageCookie);
server.register(cookie_1.default, { secret: cookieSecret });
server.register(formbody_1.default);
function setFlashMessageCookie(response, message) {
    response.setCookie(middleWare_1.flashMessageCookieKey, message, { path: '/' });
}
;
function getFlashMessageCookie(request) {
    return request.cookies[middleWare_1.flashMessageCookieKey];
}
;
var sessionCookieKey = 'sessionID';
function setSessionCookie(response, sessionID) {
    response.setCookie(sessionCookieKey, sessionID, { path: '/' });
}
;
function getSessionCookie(request) {
    return request.cookies[sessionCookieKey];
}
;
server.get('/', function (_request, response) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, response.redirect('/home')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var registrationSchema = zod_1.z.object({
    eMail: zod_1.z.string(),
    passWord: zod_1.z.string(),
    termsAndConditions: zod_1.z.string().optional()
});
server.get('/register', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var serverMessage, rendered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                serverMessage = getFlashMessageCookie(request);
                rendered = templates.render('register.njk', { environment: environment, serverMessage: serverMessage });
                return [4 /*yield*/, response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
server.post('/register', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_1, eMailInValidations, forMattedErrors, passWordInValidations, forMattedErrors, dataBase, userRepository, hashedPassWord, newUser, user, _a, session, sessionID, _b, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 1, , 3]);
                data = registrationSchema.parse(request.body);
                return [3 /*break*/, 3];
            case 1:
                error_1 = _c.sent();
                setFlashMessageCookie(response, 'Error Registering');
                return [4 /*yield*/, response.redirect('/register')];
            case 2:
                _c.sent();
                return [3 /*break*/, 3];
            case 3:
                ;
                if (!(data.termsAndConditions !== 'on')) return [3 /*break*/, 5];
                setFlashMessageCookie(response, 'Terms & Conditions Must be Accepted');
                return [4 /*yield*/, response.redirect('/register')];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                ;
                eMailInValidations = (0, validate_1.validateEMail)(data.eMail);
                if (!(eMailInValidations.length > 0)) return [3 /*break*/, 7];
                forMattedErrors = eMailInValidations.join('<br />');
                setFlashMessageCookie(response, forMattedErrors);
                return [4 /*yield*/, response.redirect('/register')];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                ;
                passWordInValidations = (0, validate_1.validatePassWord)(data.passWord);
                if (!(passWordInValidations.length > 0)) return [3 /*break*/, 9];
                forMattedErrors = passWordInValidations.join('<br />');
                setFlashMessageCookie(response, forMattedErrors);
                return [4 /*yield*/, response.redirect('/register')];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9:
                ;
                return [4 /*yield*/, (0, dataBase_1.default)(dataBaseConnectionString)];
            case 10:
                dataBase = _c.sent();
                userRepository = new dataBase_1.SQLiteUserRepository(dataBase);
                return [4 /*yield*/, (0, authentication_1.hash)(data.passWord)];
            case 11:
                hashedPassWord = _c.sent();
                _c.label = 12;
            case 12:
                _c.trys.push([12, 20, , 22]);
                newUser = __assign(__assign({}, data), { ID: 7, hash: hashedPassWord, termsAndConditions: true });
                if (!(environment === 'development')) return [3 /*break*/, 14];
                return [4 /*yield*/, userRepository.create(newUser)];
            case 13:
                _a = _c.sent();
                return [3 /*break*/, 15];
            case 14:
                _a = newUser;
                _c.label = 15;
            case 15:
                user = _a;
                session = new dataBase_1.SQLiteSessionRepository(dataBase);
                if (!(environment === 'development')) return [3 /*break*/, 17];
                return [4 /*yield*/, session.create(user.ID)];
            case 16:
                _b = _c.sent();
                return [3 /*break*/, 18];
            case 17:
                _b = 'sessionID';
                _c.label = 18;
            case 18:
                sessionID = _b;
                setSessionCookie(response, sessionID);
                return [4 /*yield*/, response.redirect('/home')];
            case 19:
                _c.sent();
                return [3 /*break*/, 22];
            case 20:
                error_2 = _c.sent();
                setFlashMessageCookie(response, 'Error Posting New User');
                return [4 /*yield*/, response.redirect('/register')];
            case 21:
                _c.sent();
                return [3 /*break*/, 22];
            case 22:
                ;
                return [2 /*return*/];
        }
    });
}); });
var logInSchema = zod_1.z.object({
    eMail: zod_1.z.string(),
    passWord: zod_1.z.string()
});
server.get('/log-in', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var serverMessage, rendered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                serverMessage = getFlashMessageCookie(request);
                rendered = templates.render('logIn.njk', { environment: environment, serverMessage: serverMessage });
                return [4 /*yield*/, response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
server.post('/log-in', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_3, eMailInValidations, forMattedErrors, passWordInValidations, forMattedErrors, dataBase, userRepository, user, match, session, sessionID, _a, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 1, , 3]);
                data = registrationSchema.parse(request.body);
                return [3 /*break*/, 3];
            case 1:
                error_3 = _b.sent();
                setFlashMessageCookie(response, 'Error Logging-In');
                return [4 /*yield*/, response.redirect('/log-in')];
            case 2:
                _b.sent();
                return [3 /*break*/, 3];
            case 3:
                ;
                eMailInValidations = (0, validate_1.validateEMail)(data.eMail);
                if (!(eMailInValidations.length > 0)) return [3 /*break*/, 5];
                forMattedErrors = eMailInValidations.join('<br />');
                setFlashMessageCookie(response, forMattedErrors);
                return [4 /*yield*/, response.redirect('/log-in')];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                ;
                passWordInValidations = (0, validate_1.validatePassWord)(data.passWord);
                if (!(passWordInValidations.length > 0)) return [3 /*break*/, 7];
                forMattedErrors = passWordInValidations.join('<br />');
                setFlashMessageCookie(response, forMattedErrors);
                return [4 /*yield*/, response.redirect('/log-in')];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                ;
                return [4 /*yield*/, (0, dataBase_1.default)(dataBaseConnectionString)];
            case 8:
                dataBase = _b.sent();
                userRepository = new dataBase_1.SQLiteUserRepository(dataBase);
                _b.label = 9;
            case 9:
                _b.trys.push([9, 21, , 23]);
                return [4 /*yield*/, userRepository.find(data.eMail)];
            case 10:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 12];
                setFlashMessageCookie(response, 'User Not Found');
                return [4 /*yield*/, response.redirect('/log-in')];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                ;
                return [4 /*yield*/, (0, authentication_1.authenticate)(data.passWord, user.hash)];
            case 13:
                match = _b.sent();
                if (!match) return [3 /*break*/, 18];
                session = new dataBase_1.SQLiteSessionRepository(dataBase);
                if (!(environment === 'development')) return [3 /*break*/, 15];
                return [4 /*yield*/, session.create(user.ID)];
            case 14:
                _a = _b.sent();
                return [3 /*break*/, 16];
            case 15:
                _a = 'sessionID';
                _b.label = 16;
            case 16:
                sessionID = _a;
                setSessionCookie(response, sessionID);
                return [4 /*yield*/, response.redirect('/home')];
            case 17:
                _b.sent();
                return [3 /*break*/, 20];
            case 18:
                setFlashMessageCookie(response, 'InCorrect PassWord');
                return [4 /*yield*/, response.redirect('/log-in')];
            case 19:
                _b.sent();
                _b.label = 20;
            case 20:
                ;
                return [3 /*break*/, 23];
            case 21:
                error_4 = _b.sent();
                setFlashMessageCookie(response, 'Error Getting Existing User');
                return [4 /*yield*/, response.redirect('/log-in')];
            case 22:
                _b.sent();
                return [3 /*break*/, 23];
            case 23:
                ;
                return [2 /*return*/];
        }
    });
}); });
server.get('/home', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionID, dataBase, sessions, user, _a, rendered;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                sessionID = getSessionCookie(request);
                if (!!sessionID) return [3 /*break*/, 2];
                setFlashMessageCookie(response, 'Logged-Out');
                return [4 /*yield*/, response.redirect('/log-in')];
            case 1: return [2 /*return*/, _b.sent()];
            case 2:
                ;
                return [4 /*yield*/, (0, dataBase_1.default)(dataBaseConnectionString)];
            case 3:
                dataBase = _b.sent();
                sessions = new dataBase_1.SQLiteSessionRepository(dataBase);
                if (!(environment === 'development')) return [3 /*break*/, 5];
                return [4 /*yield*/, sessions.get(sessionID)];
            case 4:
                _a = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                _a = { eMail: 'SQLiteReadOnlyByPass' };
                _b.label = 6;
            case 6:
                user = _a;
                if (!!user) return [3 /*break*/, 8];
                setFlashMessageCookie(response, 'Session Expired');
                return [4 /*yield*/, response.redirect('/log-in')];
            case 7: return [2 /*return*/, _b.sent()];
            case 8:
                ;
                rendered = templates.render('home.njk', {
                    environment: environment,
                    eMail: user.eMail
                });
                return [4 /*yield*/, response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered)];
            case 9:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var dataBase, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, dataBase_1.default)(dataBaseConnectionString)];
                case 1:
                    dataBase = _a.sent();
                    return [4 /*yield*/, (0, dataBase_1.seed)(dataBase)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, server.listen({ port: 3000 })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    server.log.error(error_5);
                    process.exit(1);
                    return [3 /*break*/, 5];
                case 5:
                    ;
                    return [2 /*return*/];
            }
        });
    });
})();
