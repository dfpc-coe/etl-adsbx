import test from 'node:test';
import assert from 'node:assert';
import { SchemaType, DataFlowType } from '@tak-ps/etl';

// task.ts calls Task.init() at module scope which requires an ETL environment,
// so these must be set before the dynamic import below
process.env.ETL_API = process.env.ETL_API || 'http://localhost:5001';
process.env.ETL_LAYER = process.env.ETL_LAYER || '1';
process.env.ETL_TOKEN = process.env.ETL_TOKEN || 'etl.test-token';

const { default: Task } = await import('../task.js');

test('Task static config', () => {
    assert.equal(Task.name, 'etl-adsbx');
    assert.deepEqual(Task.flow, [DataFlowType.Incoming]);
});

test('Incoming Input schema', async () => {
    const task = await Task.init();
    const schema = await task.schema(SchemaType.Input, DataFlowType.Incoming);

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
        assert.ok(schema.properties[key], `Env schema missing property: ${key}`);
    }

    assert.equal(schema.properties.ADSBX_INCLUDE_BELOW_ELEVATION.type, 'boolean');
    assert.equal(schema.properties.ADSBX_INCLUDE_BELOW_ELEVATION.default, false);
    assert.equal(schema.properties.ADSBX_BELOW_ELEVATION_FEET.type, 'number');
    assert.equal(schema.properties.ADSBX_BELOW_ELEVATION_FEET.default, 18000);
});

test('Incoming Output schema', async () => {
    const task = await Task.init();
    const schema = await task.schema(SchemaType.Output, DataFlowType.Incoming);

    assert.equal(schema.type, 'object');
    assert.ok(schema.properties.hex);
    assert.ok(schema.properties.lat);
    assert.ok(schema.properties.lon);
});
