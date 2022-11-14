import {
    render,
    screen,
    waitFor,
    within,
    getAllByRole,
    fireEvent,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FeatureView } from '../feature/FeatureView/FeatureView';
import { ThemeProvider } from 'themes/ThemeProvider';
import { AccessProvider } from '../providers/AccessProvider/AccessProvider';
import { AnnouncerProvider } from '../common/Announcer/AnnouncerProvider/AnnouncerProvider';
import { testServerRoute, testServerSetup } from '../../utils/testServer';
import { UIProviderContainer } from '../providers/UIProvider/UIProviderContainer';

const server = testServerSetup();

test('create change request', async () => {
    testServerRoute(
        server,
        '/api/admin/projects/default/change-requests/config',
        [
            {
                environment: 'development',
                type: 'development',
                changeRequestEnabled: false,
            },
            {
                environment: 'production',
                type: 'production',
                changeRequestEnabled: true,
            },
        ]
    );

    testServerRoute(server, '/api/admin/ui-config', {
        environment: 'Open Source',
        flags: {
            changeRequests: true,
        },
        slogan: 'getunleash.io - All rights reserved',
        name: 'Unleash enterprise',
        links: [
            {
                value: 'Documentation',
                icon: 'library_books',
                href: 'https://docs.getunleash.io/docs',
                title: 'User documentation',
            },
            {
                value: 'GitHub',
                icon: 'c_github',
                href: 'https://github.com/Unleash/unleash',
                title: 'Source code on GitHub',
            },
        ],
        version: '4.18.0-beta.5',
        emailEnabled: false,
        unleashUrl: 'http://localhost:4242',
        baseUriPath: '',
        authenticationType: 'enterprise',
        segmentValuesLimit: 100,
        strategySegmentsLimit: 5,
        frontendApiOrigins: ['*'],
        versionInfo: {
            current: { oss: '4.18.0-beta.5', enterprise: '4.17.0-beta.1' },
            latest: {},
            isLatest: true,
            instanceId: 'c7566052-15d7-4e09-9625-9c988e1f2be7',
        },
        disablePasswordAuth: false,
    });

    testServerRoute(server, '/api/admin/projects/default', {
        name: 'Default',
        description: 'Default project',
        health: 100,
        updatedAt: '2022-11-14T10:15:59.228Z',
        environments: ['development', 'production'],
        features: [
            {
                type: 'release',
                name: 'test',
                createdAt: '2022-11-14T08:16:33.338Z',
                lastSeenAt: null,
                stale: false,
                environments: [
                    {
                        name: 'development',
                        enabled: false,
                        type: 'development',
                        sortOrder: 100,
                    },
                    {
                        name: 'production',
                        enabled: false,
                        type: 'production',
                        sortOrder: 200,
                    },
                ],
            },
        ],
        members: 0,
        version: 1,
    });
    testServerRoute(server, '/api/admin/projects/default/features/test', {
        environments: [
            {
                name: 'development',
                enabled: false,
                type: 'development',
                sortOrder: 100,
                strategies: [],
            },
            {
                name: 'production',
                enabled: false,
                type: 'production',
                sortOrder: 200,
                strategies: [],
            },
        ],
        name: 'test',
        impressionData: false,
        description: '',
        project: 'default',
        stale: false,
        variants: [],
        createdAt: '2022-11-14T08:16:33.338Z',
        lastSeenAt: null,
        type: 'release',
        archived: false,
    });

    render(
        <UIProviderContainer>
            <AccessProvider>
                <MemoryRouter
                    initialEntries={['/projects/default/features/test']}
                >
                    <ThemeProvider>
                        <AnnouncerProvider>
                            <Routes>
                                <Route
                                    path="/projects/:projectId/features/:featureId/*"
                                    element={<FeatureView />}
                                />
                            </Routes>
                        </AnnouncerProvider>
                    </ThemeProvider>
                </MemoryRouter>
            </AccessProvider>
        </UIProviderContainer>
    );

    const featureToggleStatusBox = screen.getByTestId('feature-toggle-status');

    await within(featureToggleStatusBox).findByText('production');
    const toggle = screen.getAllByRole('checkbox')[1];
    fireEvent.click(toggle);

    await screen.findByText('Request changes');
});
