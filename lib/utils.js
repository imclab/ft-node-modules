// Merge any passed config with the default or previosuly set config
exports.mergeConfig = function (config, passedConfig) {
    var key;

    // Don't bother trying to parse anything other than an object
    if (typeof config === 'object') {
        for (key in passedConfig) {
            if (passedConfig.hasOwnProperty(key)) {
                config[key] = passedConfig[key];
            }
        }
    }
    console.log('Updated config', config);
    return config;
};