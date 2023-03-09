import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../utils/sequelize";

type UserType = {
  id: string;
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
