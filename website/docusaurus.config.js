/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'Unleash',
    tagline: 'The enterprise ready feature toggle service',
    url: 'https://docs.getunleash.io',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'throw',
    favicon: 'img/favicon.ico',
    organizationName: 'Unleash', // Usually your GitHub org/user name.
    projectName: 'unleash.github.io', // Usually your repo name.
    trailingSlash: false,
    customFields: {
        // expose env vars etc here
        unleashProxyUrl: process.env.UNLEASH_PROXY_URL,
        unleashProxyClientKey: process.env.UNLEASH_PROXY_CLIENT_KEY,
        unleashFeedbackTargetUrl: process.env.UNLEASH_FEEDBACK_TARGET_URL,
        environment: process.env.NODE_ENV,
    },
    themeConfig: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
        algolia: {
            appId: '5U05JI5NE1',
            apiKey: 'dc9c4491fcf9143ee34015f22d1dd9d6',
            indexName: 'getunleash',
        },
        announcementBar: {
            id: 'strategy-constraints-announcement',
            content:
                '🚀 Unleash brings powerful Constraints feature to OSS users. <a href=https://www.getunleash.io/blog/unleash-brings-powerful-constraints-feature-to-oss-users title="Unleash blog: Constraints are now available to open-source users">Read more</a> →',
            isCloseable: true,
        },
        navbar: {
            title: 'Unleash',
            logo: {
                alt: 'Unleash logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    href: 'https://www.getunleash.io/plans',
                    label: 'Unleash Enterprise',
                    position: 'right',
                },
                {
                    href: 'https://github.com/Unleash/unleash',
                    position: 'right',
                    className: 'header-github-link',
                    'aria-label': 'Unleash GitHub repository',
                },
            ],
        },
        prism: {
            additionalLanguages: [
                'csharp',
                'http',
                'java',
                'kotlin',
                'php',
                'ruby',
                'swift',
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Product',
                    items: [
                        {
                            label: 'Docs',
                            to: '/',
                        },
                        {
                            label: 'Unleash on GitHub',
                            href: 'https://github.com/Unleash/unleash',
                        },
                        {
                            label: 'Roadmap',
                            href: 'https://github.com/orgs/Unleash/projects/5',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Stack Overflow',
                            href: 'https://stackoverflow.com/questions/tagged/unleash',
                        },
                        {
                            label: 'Slack',
                            href: 'https://slack.unleash.run/',
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/getunleash',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Unleash. Built with Docusaurus.`,
            logo: {
                src: 'img/logo.svg',
                alt: 'Unleash logo',
            },
        },
        image: 'img/logo.png',
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/Unleash/unleash/edit/main/website/',
                    routeBasePath: '/',
                    remarkPlugins: [
                        [
                            require('@docusaurus/remark-plugin-npm2yarn'),
                            { sync: true },
                        ],
                    ],
                    docLayoutComponent: '@theme/DocPage',
                    docItemComponent: '@theme/ApiItem',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                googleAnalytics: {
                    trackingID: 'UA-134882379-1',
                },
            },
        ],
    ],
    plugins: [
        [
            // heads up to anyone making redirects:
            //
            // remember that redirects only work in production and not in
            // development, as mentioned in the docs
            // https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-client-redirects/
            '@docusaurus/plugin-client-redirects',
            {
                fromExtensions: ['html', 'htm'],
                redirects: [
                    {
                        to: '/sdks',
                        from: [
                            '/user_guide/client-sdk',
                            '/client-sdk',
                            '/user_guide/connect_sdk',
                            '/sdks/community',
                        ],
                    },
                    {
                        to: '/user_guide/api-token',
                        from: '/deploy/user_guide/api-token',
                    },
                    {
                        to: '/sdks/unleash-proxy',
                        from: '/user_guide/native_apps/',
                    },
                    {
                        to: '/user_guide/activation_strategy',
                        from: '/user_guide/control_rollout',
                    },
                    {
                        from: '/advanced/audit_log',
                        to: '/reference/event-log',
                    },
                    {
                        from: '/api/open_api',
                        to: '/reference/api/unleash',
                    },
                    {
                        from: '/advanced/api_access',
                        to: '/how-to/how-to-use-the-admin-api',
                    },
                    {
                        from: '/advanced/archived_toggles',
                        to: '/reference/archived-toggles',
                    },
                    {
                        from: '/advanced/custom-activation-strategy',
                        to: '/reference/custom-activation-strategies',
                    },
                    {
                        from: '/advanced/feature_toggle_types',
                        to: '/reference/feature-toggle-types',
                    },
                    {
                        from: [
                            '/toggle_variants',
                            '/advanced/feature_toggle_variants',
                        ],
                        to: '/reference/feature-toggle-variants',
                    },
                    {
                        from: [
                            '/advanced/impression-data',
                            '/advanced/impression_data',
                        ],
                        to: '/reference/impression-data',
                    },
                    {
                        from: '/advanced/stickiness',
                        to: '/reference/stickiness',
                    },
                    {
                        from: '/advanced/sso-google',
                        to: '/how-to/how-to-add-sso-google',
                    },
                    {
                        from: '/advanced/sso-open-id-connect',
                        to: '/how-to/how-to-add-sso-open-id-connect',
                    },
                    {
                        from: '/advanced/sso-saml-keycloak',
                        to: '/how-to/how-to-add-sso-saml-keycloak',
                    },
                    {
                        from: '/advanced/sso-saml',
                        to: '/how-to/how-to-add-sso-saml',
                    },
                    {
                        from: '/advanced/strategy_constraints',
                        to: '/reference/strategy-constraints',
                    },
                    {
                        from: '/advanced/tags',
                        to: '/reference/tags',
                    },
                    {
                        from: '/advanced/enterprise-authentication',
                        to: '/reference/sso',
                    },
                    {
                        from: '/deploy',
                        to: '/reference/deploy',
                    },
                    {
                        from: '/deploy/getting_started',
                        to: '/reference/deploy/getting-started',
                    },
                    {
                        from: '/deploy/configuring_unleash',
                        to: '/reference/deploy/configuring-unleash',
                    },
                    {
                        from: '/deploy/configuring_unleash_v3',
                        to: '/reference/deploy/configuring-unleash-v3',
                    },
                    {
                        from: '/deploy/database-setup',
                        to: '/reference/deploy/database-setup',
                    },
                    {
                        from: '/deploy/database_backup',
                        to: '/reference/deploy/database-backup',
                    },
                    {
                        from: '/deploy/email',
                        to: '/reference/deploy/email-service',
                    },
                    {
                        from: '/deploy/google_auth_v3',
                        to: '/reference/deploy/google-auth-v3',
                    },
                    {
                        from: '/deploy/google_auth',
                        to: '/reference/deploy/google-auth-hook',
                    },
                    {
                        from: '/deploy/import_export',
                        to: '/reference/deploy/import-export',
                    },
                    {
                        from: '/deploy/migration_guide',
                        to: '/reference/deploy/migration-guide',
                    },
                    {
                        from: '/deploy/securing_unleash',
                        to: '/reference/deploy/securing-unleash',
                    },
                    {
                        from: '/deploy/securing-unleash-v3',
                        to: '/reference/deploy/securing-unleash-v3',
                    },
                    {
                        from: '/addons',
                        to: '/reference/addons',
                    },
                    {
                        from: '/addons/datadog',
                        to: '/reference/addons/datadog',
                    },
                    {
                        from: '/addons/slack',
                        to: '/reference/addons/slack',
                    },
                    {
                        from: '/addons/teams',
                        to: '/reference/addons/teams',
                    },
                    {
                        from: '/addons/webhook',
                        to: '/reference/addons/webhook',
                    },
                    {
                        from: '/guides/feature_updates_to_slack',
                        to: '/how-to/how-to-send-feature-updates-to-slack-deprecated',
                    },
                    {
                        from: ['/integrations/integrations', '/integrations'],
                        to: '/reference/integrations',
                    },
                    {
                        from: '/integrations/jira_server_plugin_installation',
                        to: '/reference/integrations/jira-server-plugin-installation',
                    },
                    {
                        from: '/integrations/jira_server_plugin_usage',
                        to: '/reference/integrations/jira-server-plugin-usage',
                    },
                ],
                createRedirects: function (toPath) {
                    if (
                        toPath.indexOf('/docs/') === -1 &&
                        toPath.indexOf('index.html') === -1
                    ) {
                        return `/docs/${toPath}`;
                    }
                },
            },
        ],
        [
            'docusaurus-plugin-openapi-docs',
            {
                id: 'api-operations',
                docsPluginId: 'classic',
                config: {
                    server: {
                        specPath:
                            process.env.OPENAPI_SOURCE === 'localhost'
                                ? 'http://localhost:4242/docs/openapi.json'
                                : 'https://us.app.unleash-hosted.com/ushosted/docs/openapi.json',
                        outputDir: 'docs/reference/api/unleash',
                        sidebarOptions: {
                            groupPathsBy: 'tag',
                            categoryLinkSource: 'tag',
                        },
                    },
                },
            },
        ],
    ],
    themes: ['docusaurus-theme-openapi-docs'], // Allows use of @theme/ApiItem and other components
};
