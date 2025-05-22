"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (_) try {
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
exports.__esModule = true;
exports.handler = void 0;
var typebox_1 = require("@sinclair/typebox");
var etl_1 = require("@tak-ps/etl");
var etl_2 = require("@tak-ps/etl");
var Env = typebox_1.Type.Object({
    'Query LatLon': typebox_1.Type.String({
        description: 'Lat, Lon value to use for centering the API request',
        "default": '40.14401,-119.81204'
    }),
    'Query Dist': typebox_1.Type.String({
        description: 'Distance from the provided Lat, Lon location in nautical miles (NM) to provide results',
        "default": "2650"
    }),
    'ADSBX_API': typebox_1.Type.String({
        "enum": [
            'https://adsbexchange-com1.p.rapidapi.com',
            'https://adsbexchange.com/api/aircraft'
        ],
        "default": 'https://adsbexchange.com/api/aircraft'
    }),
    'ADSBX_TOKEN': typebox_1.Type.String({ description: 'API Token for ADSBExchange' }),
    'ADSBX_INCLUDES_FILTERING': typebox_1.Type.Boolean({
        "default": true
    }),
    'ADSBX_INCLUDES': typebox_1.Type.Array(typebox_1.Type.Object({
        domain: typebox_1.Type.String({
            description: 'Public Safety domain of the Aircraft',
            "enum": ['EMS', 'FIRE', 'LAW']
        }),
        callsign: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Callsign of the Aircraft' })),
        registration: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Registration Number of the Aircraft' })),
        group: typebox_1.Type.String({
            description: 'Category of Aircraft',
            "default": 'UNKNOWN',
            "enum": [
                'UNKNOWN',
                'CIV_FIXED_CAP',
                'CIV_UAS',
                'EMS_ROTOR',
                'EMS_ROTOR_RESCUE',
                'FIRE_AIR_ATTACK',
                'FIRE_AIR_TANKER',
                'FIRE_INTEL',
                'FIRE_LEAD_PLANE',
                'FIRE_ROTOR',
                'FIRE_ROTOR_AIR_ATTACK',
                'FIRE_ROTOR_INTEL',
                'FIRE_ROTOR_RESCUE',
                'FIRE_SEAT',
                'FIRE_SMOKE_JMPR',
                'LAW_FIXED_WING',
                'LAW_ROTOR_RESCUE',
                'LE_FIXED_WING',
                'LE_FIXED_WING_ISR',
                'LE_ROTOR',
                'LE_ROTOR_RESCUE',
                'LE_UAS'
            ]
        })
    })),
    'ADSBX_EMERGENCY_HOSTILE': typebox_1.Type.Boolean({ description: 'Mark flights in status "emergency" as "hostile". This allows them to appear in red on a TAK map.', "default": false }),
    'DEBUG': typebox_1.Type.Boolean({ description: 'Print ADSBX results in logs', "default": false })
});
var ADSBResponse = typebox_1.Type.Object({
    hex: typebox_1.Type.String(),
    type: typebox_1.Type.String(),
    group: typebox_1.Type.Optional(typebox_1.Type.String({
        "default": 'UNKNOWN',
        description: 'Provided by the join with ADSBX_INCLUDES items'
    })),
    flight: typebox_1.Type.Optional(typebox_1.Type.String()),
    r: typebox_1.Type.Optional(typebox_1.Type.String()),
    t: typebox_1.Type.Optional(typebox_1.Type.String()),
    dbFlags: typebox_1.Type.Optional(typebox_1.Type.Number()),
    alt_baro: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.String()])),
    alt_geom: typebox_1.Type.Optional(typebox_1.Type.Number()),
    gs: typebox_1.Type.Optional(typebox_1.Type.Number()),
    track: typebox_1.Type.Optional(typebox_1.Type.Number()),
    baro_rate: typebox_1.Type.Optional(typebox_1.Type.Number()),
    squawk: typebox_1.Type.Optional(typebox_1.Type.String()),
    emergency: typebox_1.Type.Optional(typebox_1.Type.String()),
    category: typebox_1.Type.Optional(typebox_1.Type.String()),
    nav_qnh: typebox_1.Type.Optional(typebox_1.Type.Number()),
    nav_altitude_mcp: typebox_1.Type.Optional(typebox_1.Type.Number()),
    nav_heading: typebox_1.Type.Optional(typebox_1.Type.Number()),
    lat: typebox_1.Type.Number(),
    lon: typebox_1.Type.Number(),
    seen_pos: typebox_1.Type.Number(),
    seen: typebox_1.Type.Number(),
    dst: typebox_1.Type.Optional(typebox_1.Type.Number())
});
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Task.prototype.schema = function (type, flow) {
        if (type === void 0) { type = etl_2.SchemaType.Input; }
        if (flow === void 0) { flow = etl_2.DataFlowType.Incoming; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (flow === etl_2.DataFlowType.Incoming) {
                    if (type === etl_2.SchemaType.Input) {
                        return [2 /*return*/, Env];
                    }
                    else {
                        return [2 /*return*/, ADSBResponse];
                    }
                }
                else {
                    return [2 /*return*/, typebox_1.Type.Object({})];
                }
                return [2 /*return*/];
            });
        });
    };
    Task.prototype.control = function () {
        return __awaiter(this, void 0, void 0, function () {
            var env, api, url, res, body, ids, _i, _a, ac, id, coordinates, ac_type, ac_civmil, ac_emergency, features, features_ids, _b, _c, include, id, feat, _d, _e, feat, fc;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.env(Env)];
                    case 1:
                        env = _f.sent();
                        api = "".concat(env.ADSBX_API, "/v2/lat/").concat(env['Query LatLon'].split(',')[0].trim(), "/lon/").concat(env['Query LatLon'].split(',')[1].trim(), "/dist/").concat(env['Query Dist'], "/");
                        url = new URL(api);
                        url.searchParams.append('apiKey', env.ADSBX_TOKEN);
                        url.searchParams.append('cacheBuster', String(new Date().getTime()));
                        return [4 /*yield*/, (0, etl_1.fetch)(url, {
                                headers: {
                                    'x-rapidapi-key': env.ADSBX_TOKEN,
                                    'api-auth': env.ADSBX_TOKEN
                                }
                            })];
                    case 2:
                        res = _f.sent();
                        return [4 /*yield*/, res.typed(typebox_1.Type.Object({
                                msg: typebox_1.Type.String(),
                                ac: typebox_1.Type.Array(ADSBResponse)
                            }))];
                    case 3:
                        body = _f.sent();
                        ids = new Map();
                        for (_i = 0, _a = body.ac; _i < _a.length; _i++) {
                            ac = _a[_i];
                            if (!ac.flight && !ac.r)
                                continue;
                            id = (ac.r || ac.flight).toLowerCase().trim();
                            coordinates = [ac.lon, ac.lat];
                            // If alt. is present convert to meters
                            if (ac.alt_geom)
                                coordinates.push(ac.alt_geom * 0.3048);
                            if (!id.trim().length)
                                continue;
                            ac_type = '';
                            switch (ac.category) {
                                case 'A0': // No ADS-B emitter category information. Still used for some airplanes.
                                case 'A1': // Light (< 15500 lbs) fixed wing aircraft
                                case 'A2': // Small (15500-75000 lbs) fixed wing aircraft
                                case 'A3': // Large (75000 to 300000 lbs) fixed wing aircraft
                                case 'A4': // High vortex large (aircraft such as B-757) fixed wing aircraft
                                case 'A5': // Heavy (> 300000 lbs) fixed wing aircraft
                                case 'A6': // High performance (> 5g acceleration and 400 kts) fixed wing aircraft
                                    ac_type = '-F'; // Fixed Wing
                                    break;
                                case 'A7':
                                    ac_type = '-H'; // Rotorcraft – Any rotorcraft regardless of weight.
                                    break;
                                case 'B2':
                                    ac_type = '-L'; // Lighter-than-air – Any lighter than air (airship or balloon) regardless of weight.
                                    break;
                                default:
                                    break;
                            }
                            ac_civmil = '-C';
                            if (ac.dbFlags !== undefined && ac.dbFlags % 2 !== 0) {
                                ac_civmil = '-M'; // Military
                            }
                            ac_emergency = '-f';
                            if (ac.emergency !== undefined && ac.emergency !== 'none' && env.ADSBX_EMERGENCY_HOSTILE) {
                                ac_emergency = '-h'; // Emergency
                            }
                            ids.set(id, {
                                id: id,
                                type: 'Feature',
                                properties: {
                                    type: 'a' + ac_emergency + '-A' + ac_civmil + ac_type,
                                    callsign: (ac.flight || '').trim(),
                                    time: new Date(),
                                    start: new Date(),
                                    speed: ac.gs * 0.514444 || 9999999.0,
                                    course: ac.track || 9999999.0,
                                    metadata: ac,
                                    remarks: [
                                        'Flight: ' + (ac.flight || 'Unknown').trim(),
                                        'Registration: ' + (ac.r || 'Unknown').trim(),
                                        'Type: ' + (ac.t || 'Unknown').trim(),
                                        'Category: ' + (ac.category || 'Unknown').trim(),
                                        'Emergency: ' + (ac.emergency || 'Unknown').trim(),
                                        'Squawk: ' + (ac.squawk || 'Unknown').trim(),
                                    ].join('\n')
                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: coordinates
                                }
                            });
                        }
                        features = [];
                        features_ids = new Set();
                        if (env.ADSBX_INCLUDES_FILTERING) {
                            for (_b = 0, _c = env.ADSBX_INCLUDES; _b < _c.length; _b++) {
                                include = _c[_b];
                                id = include.registration.toLowerCase().trim();
                                if (ids.has(id)) {
                                    feat = ids.get(id);
                                    if (include.callsign) {
                                        feat.properties.callsign = include.callsign;
                                    }
                                    if (include.group) {
                                        feat.properties.metadata.group = include.group;
                                    }
                                    if (!features_ids.has(id)) {
                                        features_ids.add(id);
                                        features.push(feat);
                                    }
                                }
                            }
                        }
                        else {
                            for (_d = 0, _e = ids.values(); _d < _e.length; _d++) {
                                feat = _e[_d];
                                if (!features_ids.has(feat.id)) {
                                    features_ids.add(feat.id);
                                    features.push(feat);
                                }
                            }
                        }
                        console.log("ok - fetched ".concat(ids.size, " aircraft"));
                        fc = {
                            type: 'FeatureCollection',
                            features: features
                        };
                        return [4 /*yield*/, this.submit(fc)];
                    case 4:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Task.name = 'etl-adsbx';
    Task.flow = [etl_2.DataFlowType.Incoming];
    Task.invocation = [etl_2.InvocationType.Schedule];
    return Task;
}(etl_2["default"]));
exports["default"] = Task;
await (0, etl_2.local)(new Task(import.meta.url), import.meta.url);
function handler(event) {
    if (event === void 0) { event = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, etl_2.handler)(new Task(import.meta.url), event)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.handler = handler;
