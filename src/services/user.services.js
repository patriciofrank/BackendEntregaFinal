import { getManagerUsers } from "../dao/daoManager.js";

const data = await getManagerUsers();
export const managerUser = new data.ManagerUserMongoDB();

export const getAllUsers = async () => {
  try {
    const users = await managerUser.getAllUserDTOs();
    return users;
  } catch (error) {
    throw new Error('Error fetching users');
  }
}

export const createUser = async (user) => {
  await managerUser.addElement(user);
};

export const getUserById = async (id) => {
  const user = await managerUser.getElementById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getUserByEmail = async (email) => {
  const user = await managerUser.getElementByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getUserByIdCart = async (id) => {
  const user = await managerUser.getUserByIdCart(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateUserPassword = async (id, newPassword) => {
  await managerUser.updateUserPassword(id, { password: newPassword });
};


export const updateUserRole = async (id, newRole) => {
  await managerUser.updateUserRole(id, { rol: newRole });
};

export const updateUser = async (id, newUser) => {
  await managerUser.updateElement(id, newUser);
}

export const deleteInactiveUsersService = async () => {
  await managerUser.deleteInactiveUsers();
}