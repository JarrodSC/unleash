import { createTestConfig } from '../../config/test-config';
import dbInit from '../helpers/database-init';
import StateService from '../../../lib/services/state-service';
import oldFormat from '../../examples/variantsexport_v3.json';

let stores;
let db;
let stateService: StateService;

beforeAll(async () => {
    const config = createTestConfig();
    db = await dbInit('state_service_serial', config.getLogger);
    stores = db.stores;
    stateService = new StateService(stores, config);
});

afterAll(async () => {
    db.destroy();
});
test('Exporting featureEnvironmentVariants should work', async () => {
    await stores.projectStore.create({
        id: 'fancy',
        name: 'extra',
        description: 'No surprises here',
    });
    await stores.environmentStore.create({
        name: 'dev',
        type: 'development',
    });
    await stores.environmentStore.create({
        name: 'prod',
        type: 'production',
    });
    await stores.featureToggleStore.create('fancy', {
        name: 'Some-feature',
    });
    await stores.featureToggleStore.create('fancy', {
        name: 'another-feature',
    });
    await stores.featureEnvironmentStore.addEnvironmentToFeature(
        'Some-feature',
        'dev',
        true,
    );
    await stores.featureEnvironmentStore.addEnvironmentToFeature(
        'another-feature',
        'dev',
        true,
    );
    await stores.featureEnvironmentStore.addEnvironmentToFeature(
        'another-feature',
        'prod',
        true,
    );
    await stores.featureToggleStore.saveVariantsOnEnv('Some-feature', 'dev', [
        { name: 'blue', weight: 333, stickiness: 'default', weightType: '' },
        { name: 'green', weight: 333, stickiness: 'default', weightType: '' },
        { name: 'red', weight: 333, stickiness: 'default', weightType: '' },
    ]);
    await stores.featureToggleStore.saveVariantsOnEnv(
        'another-feature',
        'dev',
        [
            {
                name: 'purple',
                weight: 333,
                stickiness: 'default',
                weightType: '',
            },
            {
                name: 'lilac',
                weight: 333,
                stickiness: 'default',
                weightType: '',
            },
            {
                name: 'azure',
                weight: 333,
                stickiness: 'default',
                weightType: '',
            },
        ],
    );
    await stores.featureToggleStore.saveVariantsOnEnv(
        'another-feature',
        'prod',
        [
            {
                name: 'purple',
                weight: 333,
                stickiness: 'default',
                weightType: '',
            },
            {
                name: 'lilac',
                weight: 333,
                stickiness: 'default',
                weightType: '',
            },
            {
                name: 'azure',
                weight: 333,
                stickiness: 'default',
                weightType: '',
            },
        ],
    );
    const exportedData = await stateService.export({});
    expect(exportedData.featureEnvironments).toHaveLength(3);
});

test('Should import variants from old format and convert to new format (per environment)', async () => {
    await stateService.import({
        data: oldFormat,
        keepExisting: false,
        dropBeforeImport: true,
    });
    let variants = await stores.featureToggleStore.getAllVariants();
    expect(variants).toHaveLength(3); // There are 3 environments enabled
});
test('Should import variants in new format (per environment)', async () => {
    await stateService.import({
        data: oldFormat,
        keepExisting: false,
        dropBeforeImport: true,
    });
    let exportedJson = await stateService.export({});
    await stateService.import({
        data: exportedJson,
        keepExisting: false,
        dropBeforeImport: true,
    });
    let variants = await stores.featureToggleStore.getAllVariants();
    expect(variants).toHaveLength(3);
});
