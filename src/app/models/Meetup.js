import Sequelize, { Model } from 'sequelize';

class File extends Model {
	static init(sequelize) {
		super.init(
			{
				title: Sequelize.STRING,
				description: Sequelize.STRING,
				location: Sequelize.STRING,
				date: Sequelize.DATE,
			},
			{
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.File, { foreignKey: 'file_id', as: 'banner' });
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
	}
}

export default File;
