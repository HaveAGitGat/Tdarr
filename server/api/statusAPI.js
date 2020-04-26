import { GlobalSettingsDB } from "../../imports/api/database.js";

Picker.route('/api/status', function (params, req, res, next) {
    const response = {
        status: 'good',
        isProduction: process.env.NODE_ENV == "production",
        os: process.platform,
        version: GlobalSettingsDB.find({}).fetch()[0].version,
    }
    res.end(JSON.stringify(response));
});