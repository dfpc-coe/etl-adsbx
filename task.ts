import { Type, TSchema } from '@sinclair/typebox';
import { fetch } from '@tak-ps/etl'
import ETL, { Event, SchemaType, handler as internal, local, env } from '@tak-ps/etl';

const Env = Type.Object({
    'Query LatLon': Type.String({
        description: 'Lat, Lon value to use for centering the API request',
        default: '40.14401,-119.81204'
    }),
    'Query Dist': Type.String({
        description: 'Distance from the provided LatLon to provide results',
        default: "2650"
    }),
    'ADSBX_TOKEN': Type.String({ description: 'API Token for ADSBExchange' }),
    'ADSBX_INCLUDES': Type.Array(Type.Object({
        domain: Type.String({
            description: 'Public Safety domain of the Aircraft',
            enum: ['EMS', 'FIRE', 'LAW']
        }),
        agency: Type.Optional(Type.String({ description: 'Agency in control of the Aircraft' })),
        callsign: Type.Optional(Type.String({ description: 'Callsign of the Aircraft' })),
        registration: Type.Optional(Type.String({ description: 'Registration Number of the Aircraft' })),
        type: Type.String({
            description: 'Type of Aircraft',
            default: 'UNKNOWN',
            enum: [
                'UNKNOWN',
                'HELICOPTER',
                'FIXED WING'
            ]
        }),
    })),
    'DEBUG': Type.Boolean({ description: 'Print ADSBX results in logs', default: false })
});

const ADSBResponse = Type.Object({
    hex: Type.String(),
    type: Type.String(),
    flight: Type.Optional(Type.String()),
    r: Type.Optional(Type.String()),
    t: Type.Optional(Type.String()),
    alt_baro: Type.Optional(Type.Union([Type.Number(), Type.String()])),
    alt_geom: Type.Optional(Type.Number()),
    gs: Type.Optional(Type.Number()),
    track: Type.Optional(Type.Number()),
    baro_rate: Type.Optional(Type.Number()),
    squawk: Type.Optional(Type.String()),
    category: Type.Optional(Type.String()),
    nav_qnh: Type.Optional(Type.Number()),
    nav_altitude_mcp: Type.Optional(Type.Number()),
    nav_heading: Type.Optional(Type.Number()),
    lat: Type.Number(),
    lon: Type.Number(),
    seen_pos: Type.Number(),
    seen: Type.Number(),
    dst: Type.Optional(Type.Number())
})

export default class Task extends ETL {
    async schema(type: SchemaType = SchemaType.Input): Promise<TSchema> {
        if (type === SchemaType.Input) {
            return Env;
        } else {
            return ADSBResponse;
        }
    }

    async control() {
        const env = await this.env(Env);

        const api = `https://adsbexchange.com/api/aircraft/v2/lat/${env['Query LatLon'].split(',')[0].trim()}/lon/${env['Query LatLon'].split(',')[1].trim()}/dist/${env['Query Dist']}/`;

        const url = new URL(api);
        url.searchParams.append('apiKey', env.ADSBX_TOKEN);
        url.searchParams.append('cacheBuster', String(new Date().getTime()));

        const res = await fetch(url, {
            headers: {
                'api-auth': env.ADSBX_TOKEN
            }
        });

        const body = await res.typed(Type.Object({
            msg: Type.String(),
            ac: Type.Array(ADSBResponse)
        }));

        const ids = new Map();

        for (const ac of body.ac) {
            if (!ac.flight && !ac.r) continue;

            const id = (ac.r || ac.flight).toLowerCase().trim();
            const coordinates = [ac.lon, ac.lat];

            // If alt. is present convert to meters
            if (ac.alt_geom) coordinates.push(ac.alt_geom * 0.3048);

            if (!id.trim().length) continue;

            ids.set(id, {
                id: id,
                type: 'Feature',
                properties: {
                    type: 'a-f-A',
                    callsign: (ac.flight || '').trim(),
                    time: new Date(),
                    start: new Date(),
                    speed: ac.gs * 0.514444 || 9999999.0,
                    course: ac.track || 9999999.0,
                    metadata: ac
                },
                geometry: {
                    type: 'Point',
                    coordinates
                }
            });
        }

        const features = [];
        const features_ids = new Set();
        for (const include of env.ADSBX_INCLUDES) {
            const id = include.registration.toLowerCase().trim();

            if (ids.has(id)) {
                const feat = ids.get(id);
                if (include.type === 'HELICOPTER') feat.properties.type = 'a-f-A-C-H';
                if (include.type === 'FIXED WING') feat.properties.type = 'a-f-A-C-F';

                if (include.callsign) feat.properties.callsign = include.callsign;

                if (!features_ids.has(id)) {
                    features_ids.add(id);
                    features.push(feat);
                }
            }
        }

        console.log(`ok - fetched ${ids.size} aircraft`);
        const fc: FeatureCollection = {
            type: 'FeatureCollection',
            features
        };

        await this.submit(fc);
    }
}

env(import.meta.url)
await local(new Task(), import.meta.url);
export async function handler(event: Event = {}) {
    return await internal(new Task(), event);
}

