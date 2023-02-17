import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../utils/sequelize";

type UserType = {
  id: string;
  email: string;
  avatar_url: string;
  name: string;
  refreshTokens: string[];
  createdAt?: string;
  updatedAt?: string;
};

type UserCreationAttributes = Optional<UserType, "id">;

class User extends Model<UserType, UserCreationAttributes> {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    avatar_url: {
      type: DataTypes.TEXT,
      defaultValue: "default",
    },
    name: {
      type: DataTypes.STRING,
    },
    refreshTokens: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "users",
  }
);

export { User, UserType };
