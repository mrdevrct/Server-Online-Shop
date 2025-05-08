const userController = {
  // دریافت همه کاربران (نمونه)
  findAll: async (request, reply) => {
    return { message: "List of all users" };
  },

  // ایجاد کاربر جدید (نمونه)
  create: async (request, reply) => {
    const { username, email } = request.body;
    return { message: `User ${username} created with email ${email}` };
  },
};

module.exports = { userController };
