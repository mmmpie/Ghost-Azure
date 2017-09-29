/* eslint-env node */
/* eslint-disable camelcase */
module.exports = {
    framework: 'mocha',
    test_page: 'tests/index.html?hidepassed',
    disable_watching: true,
    launch_in_ci: [
        'Chrome',
        'Firefox'
    ],
    launch_in_dev: [
        'Chrome',
        'Firefox'
    ],
    browser_args: {
        chrome: {
            mode: 'ci',
            args: [
                '--disable-gpu',
                '--headless',
                '--remote-debugging-port=9222',
                '--window-size=1440,900'
            ]
        }
    }
};
