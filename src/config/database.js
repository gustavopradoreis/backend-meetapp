module.exports = {
	dialect: 'postgres',
	host: process.env.DB_HOST,
	// username: process.env.DB_USER,
	// password: process.env.DB_PASS,
	// database: process.env.DB_NAME,
	username: 'postgres',
	password: 'docker',
	database: 'meetapp',
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
	},
};
