import { Type, TSchema } from '@sinclair/typebox';
import {
    FeatureCollection,
    Feature
} from 'geojson';
import ETL, { Event, SchemaType, handler as internal, local, env } from '@tak-ps/etl';

export default class Task extends ETL {
    async schema(type: SchemaType = SchemaType.Input): Promise<TSchema> {
        if (type === SchemaType.Input) {
            return Type.Object({
                'ADSBX_TOKEN': Type.String({ description: 'API Token for ADSBExchange' }),
                'ADSBX_INCLUDES': Type.Array(Type.Object({
                    domain: Type.String({
                        description: 'Public Safety domain of the Aircraft',
                        enum: ['EMS', 'FIRE', 'LAW']
                    }),
                    agency: Type.String({ description: 'Agency in control of the Aircraft' }),
                    callsign: Type.String({ description: 'Callsign of the Aircraft' }),
                    registration: Type.String({ description: 'Registration Number of the Aircraft' }),
                    type: Type.String({
                        description: 'Type of Aircraft',
                        enum: [
                            'HELICOPTER',
                            'FIXED WING'
                        ]
                    }),
                    icon: Type.String({ description: 'Optional TAK Custom Icon' })
                })),
                'DEBUG': Type.Boolean({ description: 'Print ADSBX results in logs', default: false })
            })
        } else {
            return Type.Object({
                registration: Type.String(),
                squak: Type.String(),
                emergency: Type.String()
            })
        }
    }

    async control() {
        const layer = await this.fetchLayer();

        if (!layer.environment.ADSBX_TOKEN) throw new Error('No ADSBX API Token Provided');
        if (!layer.environment.ADSBX_INCLUDES) layer.environment.ADSBX_INCLUDES = [];
        if (!Array.isArray(layer.environment.ADSBX_INCLUDES)) throw new Error('ADSBX_INCLUDES Must be Array');

        const token = String(layer.environment.ADSBX_TOKEN);
        const includes = layer.environment.ADSBX_INCLUDES;
        const api = 'https://adsbexchange.com/api/aircraft/v2/lat/40.14401/lon/-119.81204/dist/2650/';

        const url = new URL(api);
        url.searchParams.append('apiKey', token);
        url.searchParams.append('cacheBuster', String(new Date().getTime()));

        const res = await fetch(url, {
            headers: {
                'api-auth': token
            }
        });

        const ids = new Map();

        for (const ac of (await res.json()).ac) {
            if (!ac.flight && !ac.r) continue;

            const id = (ac.r || ac.flight).toLowerCase().trim();
            const coordinates = [ac.lon, ac.lat];

            // If alt. is present convert to meters
            if (!isNaN(parseInt(ac.alt_geom))) coordinates.push(ac.alt_geom * 0.3048);

            if (!id.trim().length) continue;

            ids.set(id, {
                id: id,
                type: 'Feature',
                properties: {
                    type: 'a-f-A',
                    registration: (ac.r || '').trim(),
                    callsign: (ac.flight || '').trim(),
                    time: new Date(),
                    start: new Date(),
                    emergency: ac.emergency,
                    speed: ac.gs * 0.514444 || 9999999.0,
                    course: ac.track || 9999999.0,
                    metadata: {
                        squak: ac.squak,
                    }
                },
                geometry: {
                    type: 'Point',
                    coordinates
                }
            });
        }

        const features = [];
        const features_ids = new Set();
        for (const include of includes) {
            const id = include.registration.toLowerCase().trim();

            if (ids.has(id)) {
                const feat = ids.get(id);
                if (include.type === 'HELICOPTER') feat.properties.type = 'a-f-A-C-H';
                if (include.type === 'FIXED WING') feat.properties.type = 'a-f-A-C-F';

                if (include.callsign) feat.properties.callsign = include.callsign;

                if (include.icon) {
                    feat.properties.icon = include.icon;
                } else if (include.type === 'HELICOPTER' && include.domain === 'EMS') {
                    feat.properties.icon = '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/EMS_ROTOR.png'
                } else if (include.type === 'HELICOPTER' && include.domain === 'FIRE') {
                    feat.properties.icon = '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/FIRE_ROTOR.png'
                } else if (include.type === 'HELICOPTER' && include.domain === 'LAW') {
                    feat.properties.icon = '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/LE_ROTOR.png'
                } else if (include.type === 'FIXED WING' && include.domain === 'EMS') {
                    feat.properties.icon = '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/EMS_FIXED_WING.png'
                } else if (include.type === 'FIXED WING' && include.domain === 'FIRE') {
                    feat.properties.icon = '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/FIRE_AIR_ATTACK.png'
                } else if (include.type === 'FIXED WING' && include.domain === 'LAW') {
                    feat.properties.icon = '66f14976-4b62-4023-8edb-d8d2ebeaa336/Public Safety Air/LE_FIXED_WING.png'
                }

                if (feat.properties.callsign === 'FIREBIRD09-PPD') console.log(new Date(), feat.geometry.coordinates)

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

