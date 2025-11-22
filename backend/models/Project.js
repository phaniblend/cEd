import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  techStack: {
    type: DataTypes.STRING,
    allowNull: false
  },
  repoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// relationships
Project.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasMany(Project, { foreignKey: "ownerId" });

export default Project;
