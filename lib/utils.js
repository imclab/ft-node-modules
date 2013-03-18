// Merge any passed config with the default or previosuly set config
var mergeConfig = function (config, passedConfig) {
    var key;

    // Don't bother trying to parse anything other than an object
    if (config instanceof Object) {
        for (key in passedConfig) {
            if (passedConfig.hasOwnProperty(key)) {
                if (config[key] instanceof Object) {
                    config[key] = mergeConfig(config[key], passedConfig[key]);
                } else {
                    config[key] = passedConfig[key];
                }
            }
        }
    }
    return config;
};

exports.mergeConfig = mergeConfig;