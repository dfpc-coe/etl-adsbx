import test from 'node:test';
import assert from 'node:assert';
import type { TSchema } from '@sinclair/typebox';
import { SchemaType, DataFlowType } from '@tak-ps/etl';

// task.ts calls Task.init() at module scope which requires an ETL environment,
// so these must be set before the dynamic import below
process.env.ETL_API = process.env.ETL_API || 'http://localhost:5001';
process.env.ETL_LAYER = process.env.ETL_LAYER || '1';
process.env.ETL_TOKEN = process.env.ETL_TOKEN || 'etl.test-token';

const { default: Task } = await import('../task.js');

type Property = { type?: unknown; default?: unknown };

function properties(schema: TSchema): Record<string, Property | undefined> {
    const props: unknown = schema.properties;
    assert.ok(typeof props === 'object' && props !== null);
    return props as Record<string, Property | undefined>;
}

test('Task static config', () => {
    assert.equal(Task.name, 'etl-adsbx');
    assert.deepEqual(Task.flow, [DataFlowType.Incoming]);
});

test('Incoming Input schema', async () => {
    const task = await Task.init();
    const schema = await task.schema(SchemaType.Input, DataFlowType.Incoming);
    const props = properties(schema);

    assert.equal(schema.type, 'object');

    for (const key of [
        'Query LatLon',
        'Query Dist',
        'ADSBX_API',
        'ADSBX_TOKEN',
        'ADSBX_INCLUDES_FILTERING',
        'ADSBX_INCLUDES',
        'ADSBX_INCLUDE_BELOW_ELEVATION',
        'ADSBX_BELOW_ELEVATION_FEET',
        'ADSBX_EMERGENCY_HOSTILE',
        'DEBUG'
    ]) {
        assert.ok(props[key], `Env schema missing property: ${key}`);
    }

    assert.equal(props.ADSBX_INCLUDE_BELOW_ELEVATION?.type, 'boolean');
    assert.equal(props.ADSBX_INCLUDE_BELOW_ELEVATION?.default, false);
    assert.equal(props.ADSBX_BELOW_ELEVATION_FEET?.type, 'number');
    assert.equal(props.ADSBX_BELOW_ELEVATION_FEET?.default, 18000);
});

test('Incoming Output schema', async () => {
    const task = await Task.init();
    const schema = await task.schema(SchemaType.Output, DataFlowType.Incoming);
    const props = properties(schema);

    assert.equal(schema.type, 'object');
    assert.ok(props.hex);
    assert.ok(props.lat);
    assert.ok(props.lon);
});
