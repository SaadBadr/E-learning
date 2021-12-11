const authenticationController = require("../controllers/authenticationController");
const logger = require("../utils/logger");
const User = require("../models/UserModel");

const initializeDB = async () => {
	logger.log('info', `⏳ Checking DB.`);
	let adminsCount = (await User.find({type: 'admin'})).length;
	if(adminsCount  > 0)
	{
		logger.log('info', `✅ DB is okay.`);
		return;
	}
	logger.log('info', `🏁 DB is not initialized. Started db seeding...`);
	if(adminsCount  == 0)
	{
		await authenticationController.adminSignupService(process.env.ADMIN_DEFAULT_FIRST_NAME, process.env.ADMIN_DEFAULT_LAST_NAME, '1980-01-01', process.env.ADMIN_DEFAULT_EMAIL, process.env.ADMIN_DEFAULT_USERNAME, process.env.ADMIN_DEFAULT_PASSWORD, 'admin');
		adminsCount = (await User.find({type: 'admin'})).length;
		logger.log('info', `✅ Admins are seeded --> count = ${adminsCount}`);
	}

	logger.log('info', `✅ Finished db seeding successfully`);
};
module.exports = initializeDB;

